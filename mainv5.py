"""
Chinese Plagiarism Checker — C-checker v5
══════════════════════════════════════════════════════════════════
Architecture:
  - FastAPI + BackgroundTasks (job_id pattern)
  - Sentence-level granularity (câu → câu)
  - Lexical: n-gram Jaccard/Dice + TF-IDF cosine + LCS + contiguous substring
  - Semantic: paraphrase-multilingual-MiniLM-L12-v2 (sentence embedding thật)
  - Search: DDGS sliding-window + dedup cache
  - Report: HTML đẹp (inline, trả về qua /report/{job_id})
  - Stats: lưu run_statistics.csv

Install:
  pip install fastapi uvicorn jieba scikit-learn sentence-transformers \
              ddgs trafilatura beautifulsoup4 colorama requests torch

Run:
  uvicorn c_checker_v5:app --reload --port 8000

Endpoints:
  POST /check          — gửi văn bản, nhận job_id
  GET  /status/{id}   — poll trạng thái job
  GET  /result/{id}   — lấy JSON kết quả đầy đủ
  GET  /report/{id}   — lấy HTML report
  GET  /health        — health check
"""

# ─── STDLIB ────────────────────────────────────────────────────────────────
import re
import time
import csv
import uuid
import unicodedata
import asyncio
from collections import defaultdict
from datetime import datetime
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from typing import Dict, List, Optional, Any

# ─── THIRD-PARTY ───────────────────────────────────────────────────────────
import jieba
import torch
import requests
from bs4 import BeautifulSoup
from ddgs import DDGS
from fastapi import FastAPI, BackgroundTasks, HTTPException
from fastapi.responses import HTMLResponse, JSONResponse
from pydantic import BaseModel, Field
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sentence_transformers import SentenceTransformer, util

# ─── CONFIG ────────────────────────────────────────────────────────────────
CONFIG = {
    # Search
    "max_results_per_query": 4,
    "search_window_sizes": [4, 5, 6],
    "step": 1,
    "delay_between_requests": 0.3,
    "fetch_timeout": 10,
    "max_page_length": 4000,

    # Scoring thresholds
    "lcs_threshold": 0.12,
    "min_final_score": 0.35,
    "min_semantic_score": 0.12,
    "top_candidates": 3,

    # Weights for final score
    "w_lcs": 0.35,
    "w_ngram": 0.20,
    "w_semantic": 0.35,        # MiniLM thật → tăng trọng số
    "w_contiguous": 0.10,

    # NLP
    "model_name": "paraphrase-multilingual-MiniLM-L12-v2",
    "context_window": 10,
    "max_sentence_len": 120,

    # Report
    "stats_file": "run_statistics.csv",
}

STOPWORDS_ZH = {
    "的", "了", "在", "是", "我", "有", "和", "就", "不", "人", "都", "一",
    "一个", "上", "也", "很", "到", "说", "要", "去", "你", "会", "着",
    "没有", "看", "好", "自己", "这", "他", "她", "它", "们", "那", "些",
    "所", "为", "因为", "所以", "可以", "这个", "那个", "什么", "怎么",
    "如果", "但是", "还是", "只是", "的话", "一样", "可能", "已经",
    "知道", "觉得", "出来", "起来", "时候", "问题", "工作", "生活",
    "需要", "很多", "现在", "应该", "比较", "然后", "最后", "告诉",
    "让", "被", "把", "从", "对", "与", "或", "及", "之", "等",
    "更", "还", "又", "再", "才", "刚", "往往", "经常", "通常",
}

# ─── IN-MEMORY JOB STORE ───────────────────────────────────────────────────
# Dùng dict đơn giản; production nên thay bằng Redis
JOBS: Dict[str, Dict[str, Any]] = {}

SEARCH_CACHE: Dict[str, list] = {}

# ─── LAZY MODEL LOADER ─────────────────────────────────────────────────────
_semantic_model: Optional[SentenceTransformer] = None

def get_model() -> SentenceTransformer:
    global _semantic_model
    if _semantic_model is None:
        print(f"[*] Loading model {CONFIG['model_name']}...")
        _semantic_model = SentenceTransformer(CONFIG["model_name"])
        print("[✓] Model ready.")
    return _semantic_model


# ══════════════════════════════════════════════════════════════════════════════
# TEXT UTILITIES
# ══════════════════════════════════════════════════════════════════════════════

def clean_text(text: str) -> str:
    text = unicodedata.normalize("NFKC", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def normalize_text(text: str) -> str:
    text = clean_text(text)
    text = text.lower()
    text = re.sub(r"[^\u4e00-\u9fff0-9a-zA-Z\s]", " ", text)
    return re.sub(r"\s+", " ", text).strip()


def tokenize(text: str) -> List[str]:
    """Tách từ tiếng Trung bằng jieba, bỏ stopwords."""
    text = re.sub(r"[^\u4e00-\u9fff\s]", "", normalize_text(text))
    return [
        w.strip()
        for w in jieba.cut(text)
        if w.strip() and w not in STOPWORDS_ZH
    ]


def split_sentences(text: str) -> List[str]:
    """Tách văn bản thành câu, bỏ câu quá ngắn."""
    parts = re.split(r'[。！？；;？！\n]+', text)
    sentences = []
    for p in parts:
        p = p.strip()
        if not p:
            continue
        # Chunk dài thành nhiều câu nhỏ hơn
        for i in range(0, len(p), CONFIG["max_sentence_len"]):
            chunk = p[i:i + CONFIG["max_sentence_len"]].strip()
            if len(chunk) >= 8:
                sentences.append(chunk)
    return sentences


def normalize_url(url: str) -> str:
    return re.sub(r"[?#].*", "", url or "").rstrip("/")


# ══════════════════════════════════════════════════════════════════════════════
# SEARCH & FETCH
# ══════════════════════════════════════════════════════════════════════════════

def generate_queries(tokens: List[str]) -> List[str]:
    """Sliding window qua token list để tạo query đa dạng."""
    queries: set = set()
    if not tokens:
        return []
    if len(tokens) <= max(CONFIG["search_window_sizes"]):
        queries.add(" ".join(tokens))
        return list(queries)
    for size in CONFIG["search_window_sizes"]:
        if len(tokens) < size:
            continue
        for i in range(0, len(tokens) - size + 1, CONFIG["step"]):
            queries.add(" ".join(tokens[i:i + size]))
    return list(queries)


def search_query(query: str, ddgs: DDGS) -> List[Dict]:
    if query in SEARCH_CACHE:
        return SEARCH_CACHE[query]
    results = []
    try:
        results = list(ddgs.text(
            query,
            max_results=CONFIG["max_results_per_query"],
            region="cn-zh",
            safesearch="off",
        ))
        if not results:
            results = list(ddgs.text(query, max_results=CONFIG["max_results_per_query"]))
    except Exception as e:
        print(f"[!] Search error: {e}")
    SEARCH_CACHE[query] = results
    return results


def fetch_page(url: str) -> str:
    """Tải trang, dùng trafilatura rồi fallback BeautifulSoup."""
    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/122.0.0.0 Safari/537.36"
        )
    }
    try:
        resp = requests.get(url, headers=headers, timeout=CONFIG["fetch_timeout"])
        resp.encoding = resp.apparent_encoding
        try:
            import trafilatura
            main = trafilatura.extract(resp.text, include_comments=False, include_tables=False)
            if main and len(main) > 200:
                return clean_text(main)[: CONFIG["max_page_length"]]
        except ImportError:
            pass
        soup = BeautifulSoup(resp.text, "html.parser")
        for tag in soup(["script", "style", "nav", "footer", "header"]):
            tag.decompose()
        return clean_text(soup.get_text(separator=" "))[: CONFIG["max_page_length"]]
    except Exception:
        return ""


# ══════════════════════════════════════════════════════════════════════════════
# LEXICAL METRICS
# ══════════════════════════════════════════════════════════════════════════════

def lcs_with_indexes(a: List[str], b: List[str]) -> Dict:
    m, n = len(a), len(b)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(m):
        for j in range(n):
            if a[i] == b[j]:
                dp[i + 1][j + 1] = dp[i][j] + 1
            else:
                dp[i + 1][j + 1] = max(dp[i][j + 1], dp[i + 1][j])
    i, j = m, n
    idxs, tokens = [], []
    while i > 0 and j > 0:
        if a[i - 1] == b[j - 1]:
            idxs.append(i - 1)
            tokens.append(a[i - 1])
            i -= 1
            j -= 1
        elif dp[i - 1][j] > dp[i][j - 1]:
            i -= 1
        else:
            j -= 1
    idxs.reverse()
    tokens.reverse()
    return {"length": dp[m][n], "indexes": idxs, "tokens": tokens}


def calc_lcs_score(lcs_len: int, a_len: int, b_len: int) -> float:
    denom = max(a_len, b_len)
    return lcs_len / denom if denom else 0.0


def ngram_set(tokens: List[str], n: int) -> set:
    return {tuple(tokens[i:i + n]) for i in range(len(tokens) - n + 1)}


def ngram_overlap_score(a: List[str], b: List[str], n: int = 2) -> float:
    if len(a) < n or len(b) < n:
        return 0.0
    sa, sb = ngram_set(a, n), ngram_set(b, n)
    if not sa:
        return 0.0
    # Dice coefficient
    return 2 * len(sa & sb) / (len(sa) + len(sb))


def longest_contiguous(a: List[str], b: List[str]) -> int:
    if not a or not b:
        return 0
    n = len(b)
    dp = [0] * (n + 1)
    best = 0
    for ai in a:
        new_dp = [0] * (n + 1)
        for j, bj in enumerate(b):
            if ai == bj:
                new_dp[j + 1] = dp[j] + 1
                best = max(best, new_dp[j + 1])
        dp = new_dp
    return best


def tfidf_cosine(text_a: str, text_b: str) -> float:
    try:
        ta = " ".join(tokenize(text_a))
        tb = " ".join(tokenize(text_b))
        if not ta or not tb:
            return 0.0
        vect = TfidfVectorizer(analyzer="word")
        mat = vect.fit_transform([ta, tb])
        return float(cosine_similarity(mat[0], mat[1])[0][0])
    except Exception:
        return 0.0


def extract_snippet(tokens: List[str], idxs: List[int]) -> str:
    if not idxs:
        return ""
    w = CONFIG["context_window"]
    start = max(0, idxs[0] - w)
    end = min(len(tokens), idxs[-1] + w + 1)
    return "".join(tokens[start:end])


# ══════════════════════════════════════════════════════════════════════════════
# SEMANTIC METRIC  (MiniLM — embedding thật)
# ══════════════════════════════════════════════════════════════════════════════

def semantic_similarity(text_a: str, text_b: str) -> float:
    """
    Dùng sentence-transformers để tính cosine similarity.
    Cắt 512 ký tự để tránh quá max_seq_length của model.
    """
    model = get_model()
    a = clean_text(text_a)[:512]
    b = clean_text(text_b)[:512]
    if not a or not b:
        return 0.0
    emb = model.encode([a, b], convert_to_tensor=True, show_progress_bar=False)
    return float(util.cos_sim(emb[0], emb[1]).item())


# ══════════════════════════════════════════════════════════════════════════════
# SCORING
# ══════════════════════════════════════════════════════════════════════════════

def compute_final_score(
    lcs: float,
    ngram: float,
    semantic: float,
    contiguous: float,
) -> float:
    w = CONFIG
    return (
        w["w_lcs"] * lcs
        + w["w_ngram"] * ngram
        + w["w_semantic"] * semantic
        + w["w_contiguous"] * contiguous
    )


def highlight_tokens(tokens: List[str], matched_idxs: List[int]) -> str:
    matched = set(matched_idxs)
    result = []
    i = 0
    while i < len(tokens):
        if i in matched:
            span = []
            while i < len(tokens) and i in matched:
                span.append(tokens[i])
                i += 1
            result.append(f"<mark>{''.join(span)}</mark>")
        else:
            result.append(tokens[i])
            i += 1
    return "".join(result)


# ══════════════════════════════════════════════════════════════════════════════
# CORE ANALYSIS  (chạy trong background thread)
# ══════════════════════════════════════════════════════════════════════════════

def analyze_sentence(sentence: str, ddgs: DDGS) -> List[Dict]:
    """
    Phân tích một câu: search → score → trả về top candidates.
    """
    sentence_tokens = tokenize(sentence)
    if not sentence_tokens:
        return []

    queries = generate_queries(sentence_tokens)
    candidate_scores: Dict[str, float] = defaultdict(float)
    candidate_data: Dict[str, Dict] = {}

    for q in queries:
        results = search_query(q, ddgs)
        for r in results:
            url = r.get("href", "")
            title = r.get("title", "")
            body = r.get("body", "")

            # Thử tải full page nếu có URL
            full_text = ""
            if url:
                full_text = fetch_page(url)
            ref_text = full_text if len(full_text) > 200 else (title + " " + body)

            ref_tokens = tokenize(ref_text)
            if not ref_tokens:
                continue

            # ── LCS ──────────────────────────────────────────────────────────
            lcs_result = lcs_with_indexes(sentence_tokens, ref_tokens)
            lcs_score = calc_lcs_score(
                lcs_result["length"], len(sentence_tokens), len(ref_tokens)
            )

            # ── N-GRAM (Dice, n=2,3) ─────────────────────────────────────────
            ngram_score = max(
                ngram_overlap_score(sentence_tokens, ref_tokens, n=2),
                ngram_overlap_score(sentence_tokens, ref_tokens, n=3),
            )

            # ── CONTIGUOUS SUBSTRING ─────────────────────────────────────────
            cont_len = longest_contiguous(sentence_tokens, ref_tokens)
            contiguous_score = cont_len / max(len(sentence_tokens), len(ref_tokens), 1)

            # ── SEMANTIC (MiniLM) — chỉ tính nếu lexical đủ mạnh ────────────
            semantic_score = 0.0
            if lcs_score > CONFIG["lcs_threshold"] or ngram_score > 0.05:
                snippet_text = " ".join(ref_tokens[:200])
                raw_sem = semantic_similarity(sentence, snippet_text)
                semantic_score = raw_sem if raw_sem >= CONFIG["min_semantic_score"] else 0.0

            # ── FINAL ────────────────────────────────────────────────────────
            score = compute_final_score(lcs_score, ngram_score, semantic_score, contiguous_score)
            url_key = normalize_url(url)

            if score > candidate_scores[url_key]:
                candidate_scores[url_key] = score
                candidate_data[url_key] = {
                    "url": url,
                    "title": title,
                    "body": body[:300],
                    "lcs_score": lcs_score,
                    "ngram_score": ngram_score,
                    "semantic_score": semantic_score,
                    "contiguous_score": contiguous_score,
                    "final_score": score,
                    "lcs": lcs_result,
                    "snippet": extract_snippet(ref_tokens, lcs_result["indexes"]),
                }

        time.sleep(CONFIG["delay_between_requests"])

    # Top-N candidates vượt threshold
    sorted_cands = sorted(candidate_scores.items(), key=lambda x: x[1], reverse=True)
    output = []
    for url_key, total_score in sorted_cands[: CONFIG["top_candidates"]]:
        if total_score < CONFIG["min_final_score"]:
            continue
        d = candidate_data[url_key]
        highlighted = highlight_tokens(sentence_tokens, d["lcs"]["indexes"])
        output.append({
            "sentence": sentence,
            "url": d["url"],
            "title": d["title"],
            "body": d["body"],
            "highlighted": highlighted,
            "matched_tokens": d["lcs"]["tokens"],
            "snippet": d["snippet"],
            "lcs_score": round(d["lcs_score"], 4),
            "ngram_score": round(d["ngram_score"], 4),
            "semantic_score": round(d["semantic_score"], 4),
            "contiguous_score": round(d["contiguous_score"], 4),
            "final_score": round(d["final_score"], 4),
        })
    return output


def run_check(job_id: str, text: str):
    """Background worker — cập nhật JOBS[job_id] khi xong."""
    start = time.time()
    JOBS[job_id]["status"] = "running"

    text = normalize_text(text)
    sentences = split_sentences(text)

    report_items: List[Dict] = []
    total = len(sentences)

    try:
        with DDGS() as ddgs:
            for idx, sentence in enumerate(sentences, 1):
                JOBS[job_id]["progress"] = f"{idx}/{total}"
                print(f"[job {job_id[:8]}] ({idx}/{total}) {sentence[:60]}")
                results = analyze_sentence(sentence, ddgs)
                report_items.extend(results)
    except Exception as e:
        JOBS[job_id]["status"] = "failed"
        JOBS[job_id]["error"] = str(e)
        return

    runtime = round(time.time() - start, 2)

    # Tính thống kê tổng hợp
    max_score = max((i["final_score"] for i in report_items), default=0.0)
    if max_score > 0.70:
        verdict = "HIGH — Nguy cơ đạo văn cao"
    elif max_score > 0.45:
        verdict = "MEDIUM — Có dấu hiệu nghi ngờ"
    else:
        verdict = "LOW — Không phát hiện đạo văn rõ ràng"

    JOBS[job_id].update({
        "status": "done",
        "runtime": runtime,
        "sentences_checked": total,
        "matches_found": len(report_items),
        "max_score": max_score,
        "verdict": verdict,
        "report_items": report_items,
        "html_report": build_html_report(report_items, text, runtime, verdict),
        "finished_at": datetime.now().isoformat(),
    })

    _save_stats(report_items, runtime)


# ══════════════════════════════════════════════════════════════════════════════
# HTML REPORT
# ══════════════════════════════════════════════════════════════════════════════

def build_html_report(
    items: List[Dict],
    original_text: str,
    runtime: float,
    verdict: str,
) -> str:
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    max_score = max((i["final_score"] for i in items), default=0.0)
    avg_score = (sum(i["final_score"] for i in items) / len(items)) if items else 0.0

    verdict_color = {
        "H": "#e74c3c",
        "M": "#e67e22",
        "L": "#27ae60",
    }.get(verdict[0], "#555")

    rows = ""
    for idx, item in enumerate(items, 1):
        score_bar_w = int(item["final_score"] * 100)
        rows += f"""
        <div class="card" id="card-{idx}">
          <div class="card-header">
            <span class="badge">#{idx}</span>
            <span class="card-title">{item['title'][:100] or '(no title)'}</span>
          </div>
          <div class="card-meta">
            <a href="{item['url']}" target="_blank" rel="noopener">{item['url'][:90]}</a>
          </div>

          <div class="score-row">
            <div class="score-pill">LCS <strong>{item['lcs_score']:.3f}</strong></div>
            <div class="score-pill">N-gram <strong>{item['ngram_score']:.3f}</strong></div>
            <div class="score-pill">Semantic <strong>{item['semantic_score']:.3f}</strong></div>
            <div class="score-pill">Contiguous <strong>{item['contiguous_score']:.3f}</strong></div>
            <div class="score-pill final">Final <strong>{item['final_score']:.3f}</strong></div>
          </div>

          <div class="bar-wrap">
            <div class="bar-fill" style="width:{score_bar_w}%"></div>
          </div>

          <div class="section-label">📝 Câu nguồn</div>
          <div class="sentence-box">{item['sentence']}</div>

          <div class="section-label">🔆 Token trùng khớp (highlight)</div>
          <div class="highlight-box">{item['highlighted']}</div>

          <div class="section-label">🔗 Token khớp</div>
          <div class="token-box">{' · '.join(item['matched_tokens']) if item['matched_tokens'] else '—'}</div>

          <div class="section-label">📄 Snippet từ nguồn</div>
          <div class="snippet-box">{item['snippet'] or item['body'] or '—'}</div>
        </div>
        """

    if not items:
        rows = "<div class='empty'>✅ Không tìm thấy nguồn nào có nội dung tương đồng đáng kể.</div>"

    return f"""<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>C-checker v5 — Báo cáo kiểm tra đạo văn</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;700&family=IBM+Plex+Mono:wght@400;600&family=Noto+Sans+SC:wght@300;400;700&display=swap');

  *, *::before, *::after {{ box-sizing: border-box; margin: 0; padding: 0; }}

  :root {{
    --bg: #0f1117;
    --surface: #181c27;
    --surface2: #1e2436;
    --border: #2a3050;
    --accent: #5b8dee;
    --accent2: #e8a838;
    --red: #e05757;
    --green: #44c98a;
    --text: #d4daf0;
    --text-dim: #7a85a3;
    --mono: 'IBM Plex Mono', monospace;
    --serif: 'Noto Serif SC', serif;
    --sans: 'Noto Sans SC', sans-serif;
  }}

  body {{
    background: var(--bg);
    color: var(--text);
    font-family: var(--sans);
    font-weight: 300;
    line-height: 1.7;
    min-height: 100vh;
  }}

  /* ── HEADER ── */
  .hero {{
    background: linear-gradient(135deg, #0d1b3e 0%, #1a0d2e 50%, #0d2b1a 100%);
    border-bottom: 1px solid var(--border);
    padding: 48px 40px 40px;
    position: relative;
    overflow: hidden;
  }}
  .hero::before {{
    content: "";
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
      45deg,
      transparent,
      transparent 40px,
      rgba(91,141,238,.03) 40px,
      rgba(91,141,238,.03) 41px
    );
  }}
  .hero-inner {{ position: relative; max-width: 900px; margin: 0 auto; }}
  .hero-tag {{
    font-family: var(--mono);
    font-size: 11px;
    letter-spacing: .2em;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 12px;
  }}
  .hero-title {{
    font-family: var(--serif);
    font-size: clamp(28px, 4vw, 44px);
    font-weight: 700;
    color: #fff;
    line-height: 1.2;
    margin-bottom: 6px;
  }}
  .hero-sub {{
    font-size: 14px;
    color: var(--text-dim);
    margin-bottom: 32px;
  }}

  /* ── SUMMARY GRID ── */
  .summary-grid {{
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 16px;
    margin-top: 8px;
  }}
  .stat-card {{
    background: rgba(255,255,255,.05);
    border: 1px solid rgba(255,255,255,.08);
    border-radius: 12px;
    padding: 16px 20px;
  }}
  .stat-label {{
    font-family: var(--mono);
    font-size: 10px;
    letter-spacing: .15em;
    text-transform: uppercase;
    color: var(--text-dim);
    margin-bottom: 6px;
  }}
  .stat-value {{
    font-size: 22px;
    font-weight: 700;
    color: var(--accent);
  }}
  .stat-value.red {{ color: var(--red); }}
  .stat-value.green {{ color: var(--green); }}

  /* ── VERDICT BANNER ── */
  .verdict-banner {{
    max-width: 900px;
    margin: 32px auto 0;
    background: rgba(255,255,255,.04);
    border: 1px solid var(--border);
    border-left: 4px solid {verdict_color};
    border-radius: 10px;
    padding: 16px 24px;
    font-family: var(--mono);
    font-size: 15px;
    font-weight: 600;
    color: {verdict_color};
    letter-spacing: .05em;
  }}

  /* ── MAIN CONTENT ── */
  .container {{ max-width: 900px; margin: 40px auto; padding: 0 24px 60px; }}

  .section-title {{
    font-family: var(--serif);
    font-size: 20px;
    color: #fff;
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 1px solid var(--border);
  }}

  /* ── CARDS ── */
  .card {{
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 24px;
    margin-bottom: 24px;
    transition: border-color .2s;
  }}
  .card:hover {{ border-color: var(--accent); }}

  .card-header {{
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 8px;
  }}
  .badge {{
    background: var(--accent);
    color: #fff;
    font-family: var(--mono);
    font-size: 11px;
    font-weight: 600;
    padding: 3px 9px;
    border-radius: 20px;
    flex-shrink: 0;
  }}
  .card-title {{
    font-family: var(--serif);
    font-size: 15px;
    color: #fff;
    font-weight: 700;
  }}
  .card-meta {{
    font-size: 12px;
    margin-bottom: 16px;
  }}
  .card-meta a {{
    color: var(--accent);
    text-decoration: none;
  }}
  .card-meta a:hover {{ text-decoration: underline; }}

  /* ── SCORE ROW ── */
  .score-row {{
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 10px;
  }}
  .score-pill {{
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 4px 12px;
    font-family: var(--mono);
    font-size: 12px;
    color: var(--text-dim);
  }}
  .score-pill strong {{ color: var(--text); }}
  .score-pill.final {{
    border-color: var(--accent2);
    background: rgba(232,168,56,.1);
  }}
  .score-pill.final strong {{ color: var(--accent2); }}

  /* ── PROGRESS BAR ── */
  .bar-wrap {{
    height: 4px;
    background: var(--border);
    border-radius: 4px;
    margin-bottom: 20px;
    overflow: hidden;
  }}
  .bar-fill {{
    height: 100%;
    background: linear-gradient(90deg, var(--accent), var(--accent2));
    border-radius: 4px;
    transition: width .4s ease;
  }}

  /* ── SECTIONS ── */
  .section-label {{
    font-family: var(--mono);
    font-size: 11px;
    letter-spacing: .12em;
    text-transform: uppercase;
    color: var(--text-dim);
    margin: 14px 0 6px;
  }}
  .sentence-box, .highlight-box, .snippet-box, .token-box {{
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 12px 16px;
    font-size: 14px;
    line-height: 1.8;
  }}
  .highlight-box mark {{
    background: rgba(232,168,56,.35);
    color: var(--accent2);
    border-radius: 3px;
    padding: 1px 3px;
  }}
  .token-box {{
    font-family: var(--mono);
    font-size: 12px;
    color: var(--accent);
    word-break: break-all;
  }}
  .snippet-box {{
    color: var(--text-dim);
    font-size: 13px;
    border-left: 3px solid var(--accent);
  }}

  .empty {{
    text-align: center;
    padding: 60px 20px;
    color: var(--green);
    font-size: 18px;
    font-family: var(--serif);
  }}

  /* ── FOOTER ── */
  .footer {{
    text-align: center;
    font-family: var(--mono);
    font-size: 11px;
    color: var(--text-dim);
    padding: 24px;
    border-top: 1px solid var(--border);
    letter-spacing: .1em;
  }}

  @media (max-width: 600px) {{
    .hero {{ padding: 32px 20px; }}
    .container {{ padding: 0 16px 40px; }}
    .summary-grid {{ grid-template-columns: repeat(2, 1fr); }}
  }}
</style>
</head>
<body>

<div class="hero">
  <div class="hero-inner">
    <div class="hero-tag">C-checker v5 · Chinese Plagiarism Detection</div>
    <div class="hero-title">Báo cáo kiểm tra đạo văn</div>
    <div class="hero-sub">Được tạo lúc {now} · Runtime {runtime}s</div>
    <div class="summary-grid">
      <div class="stat-card">
        <div class="stat-label">Số ký tự</div>
        <div class="stat-value">{len(original_text):,}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Số câu nghi ngờ</div>
        <div class="stat-value {'red' if items else 'green'}">{len(items)}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Điểm cao nhất</div>
        <div class="stat-value {'red' if max_score > 0.6 else 'green'}">{max_score:.3f}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Điểm trung bình</div>
        <div class="stat-value">{avg_score:.3f}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Runtime</div>
        <div class="stat-value">{runtime}s</div>
      </div>
    </div>
  </div>
</div>

<div class="container">
  <div class="verdict-banner">⚖ Kết luận: {verdict}</div>

  <br>

  <div class="section-title">🔍 Chi tiết các đoạn nghi ngờ ({len(items)} kết quả)</div>
  {rows}
</div>

<div class="footer">
  C-CHECKER V5 · SENTENCE-LEVEL · MINILM SEMANTIC · DDGS SEARCH
</div>

</body>
</html>"""


# ══════════════════════════════════════════════════════════════════════════════
# STATS
# ══════════════════════════════════════════════════════════════════════════════

def _save_stats(items: List[Dict], runtime: float):
    if not items:
        return
    path = Path(CONFIG["stats_file"])
    write_header = not path.exists()
    row = [
        datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        len(items),
        round(sum(i["lcs_score"] for i in items) / len(items), 4),
        round(sum(i["semantic_score"] for i in items) / len(items), 4),
        round(sum(i["final_score"] for i in items) / len(items), 4),
        round(max(i["final_score"] for i in items), 4),
        round(runtime, 2),
    ]
    with open(path, "a", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        if write_header:
            writer.writerow([
                "timestamp", "matches", "avg_lcs", "avg_semantic",
                "avg_final", "max_final", "runtime_s",
            ])
        writer.writerow(row)


# ══════════════════════════════════════════════════════════════════════════════
# FASTAPI APP
# ══════════════════════════════════════════════════════════════════════════════

app = FastAPI(
    title="C-checker v5",
    description="Chinese Plagiarism Detection API — sentence-level, MiniLM semantic",
    version="5.0.0",
)


# ── Request / Response schemas ───────────────────────────────────────────────

class CheckRequest(BaseModel):
    text: str = Field(..., min_length=10, description="Văn bản tiếng Trung cần kiểm tra")

class JobStatus(BaseModel):
    job_id: str
    status: str                          # queued | running | done | failed
    progress: Optional[str] = None      # "3/12"
    created_at: str
    finished_at: Optional[str] = None
    error: Optional[str] = None


# ── Endpoints ────────────────────────────────────────────────────────────────

@app.get("/health")
def health():
    return {"status": "ok", "version": "5.0.0"}


@app.post("/check", response_model=dict, status_code=202)
def submit_check(req: CheckRequest, background_tasks: BackgroundTasks):
    """
    Gửi văn bản để kiểm tra. Trả về job_id ngay lập tức.
    Dùng GET /status/{job_id} để poll, GET /report/{job_id} để lấy báo cáo.
    """
    job_id = str(uuid.uuid4())
    JOBS[job_id] = {
        "status": "queued",
        "progress": "0/0",
        "created_at": datetime.now().isoformat(),
        "finished_at": None,
        "error": None,
    }
    background_tasks.add_task(run_check, job_id, req.text)
    return {
        "job_id": job_id,
        "status": "queued",
        "poll_url": f"/status/{job_id}",
        "report_url": f"/report/{job_id}",
        "result_url": f"/result/{job_id}",
    }


@app.get("/status/{job_id}", response_model=JobStatus)
def get_status(job_id: str):
    """Poll trạng thái job."""
    job = JOBS.get(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return JobStatus(
        job_id=job_id,
        status=job["status"],
        progress=job.get("progress"),
        created_at=job["created_at"],
        finished_at=job.get("finished_at"),
        error=job.get("error"),
    )


@app.get("/result/{job_id}")
def get_result(job_id: str):
    """Lấy toàn bộ kết quả JSON khi job đã done."""
    job = JOBS.get(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    if job["status"] != "done":
        return JSONResponse(
            status_code=202,
            content={"status": job["status"], "progress": job.get("progress")},
        )
    return {
        "job_id": job_id,
        "status": "done",
        "verdict": job["verdict"],
        "max_score": job["max_score"],
        "runtime": job["runtime"],
        "sentences_checked": job["sentences_checked"],
        "matches_found": job["matches_found"],
        "finished_at": job["finished_at"],
        "report_items": job["report_items"],
    }


@app.get("/report/{job_id}", response_class=HTMLResponse)
def get_report(job_id: str):
    """Trả về HTML report — mở thẳng trên trình duyệt."""
    job = JOBS.get(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    if job["status"] == "queued":
        return HTMLResponse(content=_waiting_html("⏳ Job đang xếp hàng..."), status_code=202)
    if job["status"] == "running":
        prog = job.get("progress", "?/?")
        return HTMLResponse(content=_waiting_html(f"⚙️ Đang xử lý... ({prog})"), status_code=202)
    if job["status"] == "failed":
        return HTMLResponse(content=_waiting_html(f"❌ Lỗi: {job.get('error')}"), status_code=500)
    return HTMLResponse(content=job["html_report"])


def _waiting_html(msg: str) -> str:
    return f"""<!DOCTYPE html>
<html><head><meta charset="UTF-8">
<meta http-equiv="refresh" content="3">
<style>
body{{background:#0f1117;color:#d4daf0;font-family:monospace;
     display:flex;align-items:center;justify-content:center;height:100vh;
     font-size:18px;}}
</style></head>
<body>{msg}<br><small style="color:#7a85a3">Trang tự làm mới sau 3s...</small></body>
</html>"""


# ══════════════════════════════════════════════════════════════════════════════
# CLI ENTRY (giữ lại để chạy nhanh không cần server)
# ══════════════════════════════════════════════════════════════════════════════

if __name__ == "__main__":
    import sys
    import uvicorn

    if len(sys.argv) > 1 and sys.argv[1] == "cli":
        # python c_checker_v5.py cli
        file_path = sys.argv[2] if len(sys.argv) > 2 else "input.txt"
        with open(file_path, "r", encoding="utf-8") as f:
            raw = f.read()
        fake_job = str(uuid.uuid4())
        JOBS[fake_job] = {"status": "queued", "progress": "0/0",
                          "created_at": datetime.now().isoformat()}
        run_check(fake_job, raw)
        job = JOBS[fake_job]
        print(f"\nVerdict : {job['verdict']}")
        print(f"Matches : {job['matches_found']}")
        print(f"Runtime : {job['runtime']}s")
        out = Path("c_checker_report.html")
        out.write_text(job["html_report"], encoding="utf-8")
        print(f"Report  : {out.resolve()}")
    else:
        # python c_checker_v5.py  →  start API server
        uvicorn.run("c_checker_v5:app", host="0.0.0.0", port=8000, reload=True)