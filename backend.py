"""
Chinese Plagiarism Checker — C-checker v5 (Web Server with CORS)
══════════════════════════════════════════════════════════════════
Run:
  uvicorn backend:app --reload --port 8000

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
import json
import jwt
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from database import (
    User,
    get_user_by_id,
    get_user_by_google_id,
    create_user,
    create_job,
    get_job_by_job_id,
    get_jobs_by_user_id,
    complete_job,
    fail_job,
    get_report_items
)

# ─── THIRD-PARTY ───────────────────────────────────────────────────────────
import jieba
import torch
import requests
from bs4 import BeautifulSoup
from ddgs import DDGS
from fastapi import FastAPI, BackgroundTasks, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, JSONResponse, StreamingResponse
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, Field
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sentence_transformers import SentenceTransformer, util

# ─── CONFIG ────────────────────────────────────────────────────────────────
CONFIG = {
    # Search
    "max_results_per_query": 4,
    "search_window_sizes": [5],
    "step": 1,
    "delay_between_requests": 0.3,
    "fetch_timeout": 10,
    "max_page_length": 2000,

    # Scoring thresholds
    "lcs_threshold": 0.12,
    "min_final_score": 0.35,
    "min_semantic_score": 0.12,
    "top_candidates": 3,

    # Weights for final score
    "w_lcs": 0.35,
    "w_ngram": 0.20,
    "w_semantic": 0.35,
    "w_contiguous": 0.10,

    # NLP
    "model_name": "paraphrase-multilingual-MiniLM-L12-v2",
    "context_window": 10,
    "max_sentence_len": 120,

    # Report
    "stats_file": "run_statistics.csv",
}

JWT_SECRET = "c-checker-super-secret-key"
GOOGLE_CLIENT_ID = "988401071814-56kve7lfi1sg4vqckqju6v0p25hk5o8o.apps.googleusercontent.com"

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
# SEMANTIC METRIC
# ══════════════════════════════════════════════════════════════════════════════

def semantic_similarity(text_a: str, text_b: str) -> float:
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

def compute_final_score(lcs: float, ngram: float, semantic: float, contiguous: float) -> float:
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

def highlight_original_text(original: str, matched_tokens: List[str]) -> str:
    """highlight base on original text"""
    if not matched_tokens:
        return original
    
    result = original
    for token in sorted(set(matched_tokens), key=len, reverse=True):  # dài trước để tránh overlap
        if token and len(token) > 1:  # bỏ qua token 1 ký tự
            result = result.replace(token, f"<mark>{token}</mark>")
    return result

# ══════════════════════════════════════════════════════════════════════════════
# CORE ANALYSIS
# ══════════════════════════════════════════════════════════════════════════════
"""


def analyze_sentence(sentence: str, ddgs: DDGS) -> List[Dict]:
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

            full_text = ""
            if url:
                full_text = fetch_page(url)
            ref_text = full_text if len(full_text) > 200 else (title + " " + body)

            ref_tokens = tokenize(ref_text)
            if not ref_tokens:
                continue

            lcs_result = lcs_with_indexes(sentence_tokens, ref_tokens)
            lcs_score = calc_lcs_score(
                lcs_result["length"], len(sentence_tokens), len(ref_tokens)
            )

            ngram_score = max(
                ngram_overlap_score(sentence_tokens, ref_tokens, n=2),
                ngram_overlap_score(sentence_tokens, ref_tokens, n=3),
            )

            cont_len = longest_contiguous(sentence_tokens, ref_tokens)
            contiguous_score = cont_len / max(len(sentence_tokens), len(ref_tokens), 1)

            semantic_score = 0.0
            if lcs_score > CONFIG["lcs_threshold"] or ngram_score > 0.05:
                snippet_text = " ".join(ref_tokens[:200])
                raw_sem = semantic_similarity(sentence, snippet_text)
                semantic_score = raw_sem if raw_sem >= CONFIG["min_semantic_score"] else 0.0

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

"""
from concurrent.futures import ThreadPoolExecutor, as_completed

def analyze_sentence(sentence: str, ddgs: DDGS) -> List[Dict]:
    sentence_tokens = tokenize(sentence)
    if not sentence_tokens:
        return []

    queries = generate_queries(sentence_tokens)
    
    # Thu thập tất cả search results trước
    all_results: Dict[str, Dict] = {}  # url_key → result
    for q in queries:
        for r in search_query(q, ddgs):
            url = normalize_url(r.get("href", ""))
            if url and url not in all_results:
                all_results[url] = r

    # Fetch song song
    def fetch_and_score(url_key, r):
        url = r.get("href", "")
        full_text = fetch_page(url)
        title = r.get("title", "")
        body = r.get("body", "")
        ref_text = full_text if len(full_text) > 200 else (title + " " + body)
        ref_tokens = tokenize(ref_text)
        if not ref_tokens:
            return None
        
        lcs_result = lcs_with_indexes(sentence_tokens, ref_tokens)
        lcs_score = calc_lcs_score(lcs_result["length"], len(sentence_tokens), len(ref_tokens))
        ngram_score = max(
            ngram_overlap_score(sentence_tokens, ref_tokens, n=2),
            ngram_overlap_score(sentence_tokens, ref_tokens, n=3),
        )
        cont_len = longest_contiguous(sentence_tokens, ref_tokens)
        contiguous_score = cont_len / max(len(sentence_tokens), len(ref_tokens), 1)
        semantic_score = 0.0
        if lcs_score > CONFIG["lcs_threshold"] or ngram_score > 0.05:
            snippet_text = " ".join(ref_tokens[:200])
            raw_sem = semantic_similarity(sentence, snippet_text)
            semantic_score = raw_sem if raw_sem >= CONFIG["min_semantic_score"] else 0.0

        score = compute_final_score(lcs_score, ngram_score, semantic_score, contiguous_score)
        return (url_key, score, {
            "url": url, "title": title, "body": body[:300],
            "lcs_score": lcs_score, "ngram_score": ngram_score,
            "semantic_score": semantic_score, "contiguous_score": contiguous_score,
            "final_score": score, "lcs": lcs_result,
            "snippet": extract_snippet(ref_tokens, lcs_result["indexes"]),
        })

    candidate_scores: Dict[str, float] = defaultdict(float)
    candidate_data: Dict[str, Dict] = {}

    with ThreadPoolExecutor(max_workers=6) as executor:
        futures = {executor.submit(fetch_and_score, k, v): k for k, v in all_results.items()}
        for future in as_completed(futures):
            result = future.result()
            if result is None:
                continue
            url_key, score, data = result
            if score > candidate_scores[url_key]:
                candidate_scores[url_key] = score
                candidate_data[url_key] = data

    # Phần sort và output giữ nguyên
    sorted_cands = sorted(candidate_scores.items(), key=lambda x: x[1], reverse=True)
    output = []
    for url_key, total_score in sorted_cands[:CONFIG["top_candidates"]]:
        if total_score < CONFIG["min_final_score"]:
            continue
        d = candidate_data[url_key]
        highlighted = highlight_original_text(sentence, d["lcs"]["tokens"])
        #highlighted = highlight_tokens(sentence_tokens, d["lcs"]["indexes"])
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
                JOBS[job_id]["current_sentence"] = sentence[:80]
                try:
                    print(f"[job {job_id[:8]}] ({idx}/{total}) {sentence[:60]}")
                except UnicodeEncodeError:
                    print(f"[job {job_id[:8]}] ({idx}/{total}) [Chinese Text]")
                results = analyze_sentence(sentence, ddgs)
                report_items.extend(results)
    except Exception as e:
        JOBS[job_id]["status"] = "failed"
        JOBS[job_id]["error"] = str(e)
        fail_job(job_id, str(e))
        return

    runtime = round(time.time() - start, 2)

    max_score = max((i["final_score"] for i in report_items), default=0.0)
    if max_score > 0.70:
        verdict = "HIGH"
        verdict_text = "HIGH — Nguy cơ đạo văn cao"
    elif max_score > 0.45:
        verdict = "MEDIUM"
        verdict_text = "MEDIUM — Có dấu hiệu nghi ngờ"
    else:
        verdict = "LOW"
        verdict_text = "LOW — Không phát hiện đạo văn rõ ràng"

    JOBS[job_id].update({
        "status": "done",
        "runtime": runtime,
        "sentences_checked": total,
        "matches_found": len(report_items),
        "max_score": max_score,
        "verdict": verdict,
        "verdict_text": verdict_text,
        "text_length": len(text),
        "report_items": report_items,
        "html_report": build_html_report(report_items, len(text), runtime, verdict_text),
        "finished_at": datetime.now().isoformat(),
    })

    _save_stats(report_items, runtime)

    status = JOBS[job_id]["status"]
    if status == "done":
        res_json = {
            k: v for k, v in JOBS[job_id].items()
            if k not in ("html_report", "report_items")
        }
        complete_job(
            job_id=job_id,
            status="done",
            verdict=JOBS[job_id]["verdict"],
            max_score=JOBS[job_id]["max_score"],
            runtime=JOBS[job_id]["runtime"],
            result_json=res_json,
            report_items=report_items
        )


# ══════════════════════════════════════════════════════════════════════════════
# HTML REPORT
# ══════════════════════════════════════════════════════════════════════════════

def build_html_report(items, text_length: int, runtime, verdict):
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    max_score = max((i.get("final_score", 0.0) for i in items), default=0.0)
    avg_score = (sum(i.get("final_score", 0.0) for i in items) / len(items)) if items else 0.0

    verdict_color = {
        "H": "#e74c3c",
        "M": "#e67e22",
        "L": "#27ae60",
    }.get(verdict[0], "#555")

    rows = ""
    for idx, item in enumerate(items, 1):
        final_score = item.get("final_score") or 0.0
        lcs_score = item.get("lcs_score") or 0.0
        ngram_score = item.get("ngram_score") or 0.0
        semantic_score = item.get("semantic_score") or 0.0
        contiguous_score = item.get("contiguous_score") or 0.0
        score_bar_w = int(final_score * 100)
        
        highlighted = item.get("highlighted")
        if not highlighted:
            highlighted = highlight_original_text(item.get("sentence", ""), item.get("matched_tokens", []))
            
        snippet = item.get("snippet") or item.get("body") or "—"
        matched_tokens = item.get("matched_tokens") or []
        title = item.get("title") or "(no title)"
        url = item.get("url") or ""
        sentence = item.get("sentence") or ""

        rows += f"""
        <div class="card" id="card-{idx}">
          <div class="card-header">
            <span class="badge">#{idx}</span>
            <span class="card-title">{title[:100]}</span>
          </div>
          <div class="card-meta">
            <a href="{url}" target="_blank" rel="noopener">{url[:90]}</a>
          </div>
          <div class="score-row">
            <div class="score-pill">LCS <strong>{lcs_score:.3f}</strong></div>
            <div class="score-pill">N-gram <strong>{ngram_score:.3f}</strong></div>
            <div class="score-pill">Semantic <strong>{semantic_score:.3f}</strong></div>
            <div class="score-pill">Contiguous <strong>{contiguous_score:.3f}</strong></div>
            <div class="score-pill final">Final <strong>{final_score:.3f}</strong></div>
          </div>
          <div class="bar-wrap">
            <div class="bar-fill" style="width:{score_bar_w}%"></div>
          </div>
          <div class="section-label">📝 Câu nguồn</div>
          <div class="sentence-box">{sentence}</div>
          <div class="section-label">🔆 Token trùng khớp (highlight)</div>
          <div class="highlight-box">{highlighted}</div>
          <div class="section-label">🔗 Token khớp</div>
          <div class="token-box">{' · '.join(matched_tokens) if matched_tokens else '—'}</div>
          <div class="section-label">📄 Snippet từ nguồn</div>
          <div class="snippet-box">{snippet}</div>
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
    --bg: #0f1117; --surface: #181c27; --surface2: #1e2436;
    --border: #2a3050; --accent: #5b8dee; --accent2: #e8a838;
    --red: #e05757; --green: #44c98a; --text: #d4daf0; --text-dim: #7a85a3;
    --mono: 'IBM Plex Mono', monospace; --serif: 'Noto Serif SC', serif; --sans: 'Noto Sans SC', sans-serif;
  }}
  body {{ background: var(--bg); color: var(--text); font-family: var(--sans); font-weight: 300; line-height: 1.7; }}
  .hero {{ background: linear-gradient(135deg, #0d1b3e 0%, #1a0d2e 50%, #0d2b1a 100%); border-bottom: 1px solid var(--border); padding: 48px 40px 40px; }}
  .hero-inner {{ max-width: 900px; margin: 0 auto; }}
  .hero-tag {{ font-family: var(--mono); font-size: 11px; letter-spacing: .2em; text-transform: uppercase; color: var(--accent); margin-bottom: 12px; }}
  .hero-title {{ font-family: var(--serif); font-size: clamp(28px, 4vw, 44px); font-weight: 700; color: #fff; margin-bottom: 6px; }}
  .hero-sub {{ font-size: 14px; color: var(--text-dim); margin-bottom: 32px; }}
  .summary-grid {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 16px; }}
  .stat-card {{ background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.08); border-radius: 12px; padding: 16px 20px; }}
  .stat-label {{ font-family: var(--mono); font-size: 10px; letter-spacing: .15em; text-transform: uppercase; color: var(--text-dim); margin-bottom: 6px; }}
  .stat-value {{ font-size: 22px; font-weight: 700; color: var(--accent); }}
  .stat-value.red {{ color: var(--red); }} .stat-value.green {{ color: var(--green); }}
  .verdict-banner {{ max-width: 900px; margin: 32px auto 0; background: rgba(255,255,255,.04); border: 1px solid var(--border); border-left: 4px solid {verdict_color}; border-radius: 10px; padding: 16px 24px; font-family: var(--mono); font-size: 15px; font-weight: 600; color: {verdict_color}; }}
  .container {{ max-width: 900px; margin: 40px auto; padding: 0 24px 60px; }}
  .section-title {{ font-family: var(--serif); font-size: 20px; color: #fff; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 1px solid var(--border); }}
  .card {{ background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 24px; margin-bottom: 24px; }}
  .card-header {{ display: flex; align-items: center; gap: 12px; margin-bottom: 8px; }}
  .badge {{ background: var(--accent); color: #fff; font-family: var(--mono); font-size: 11px; font-weight: 600; padding: 3px 9px; border-radius: 20px; }}
  .card-title {{ font-family: var(--serif); font-size: 15px; color: #fff; font-weight: 700; }}
  .card-meta {{ font-size: 12px; margin-bottom: 16px; }}
  .card-meta a {{ color: var(--accent); text-decoration: none; }}
  .score-row {{ display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 10px; }}
  .score-pill {{ background: var(--surface2); border: 1px solid var(--border); border-radius: 6px; padding: 4px 12px; font-family: var(--mono); font-size: 12px; color: var(--text-dim); }}
  .score-pill strong {{ color: var(--text); }}
  .score-pill.final {{ border-color: var(--accent2); background: rgba(232,168,56,.1); }}
  .score-pill.final strong {{ color: var(--accent2); }}
  .bar-wrap {{ height: 4px; background: var(--border); border-radius: 4px; margin-bottom: 20px; overflow: hidden; }}
  .bar-fill {{ height: 100%; background: linear-gradient(90deg, var(--accent), var(--accent2)); border-radius: 4px; }}
  .section-label {{ font-family: var(--mono); font-size: 11px; letter-spacing: .12em; text-transform: uppercase; color: var(--text-dim); margin: 14px 0 6px; }}
  .sentence-box, .highlight-box, .snippet-box, .token-box {{ background: var(--surface2); border: 1px solid var(--border); border-radius: 8px; padding: 12px 16px; font-size: 14px; line-height: 1.8; }}
  .highlight-box mark {{ background: rgba(232,168,56,.35); color: var(--accent2); border-radius: 3px; padding: 1px 3px; }}
  .token-box {{ font-family: var(--mono); font-size: 12px; color: var(--accent); word-break: break-all; }}
  .snippet-box {{ color: var(--text-dim); font-size: 13px; border-left: 3px solid var(--accent); }}
  .empty {{ text-align: center; padding: 60px 20px; color: var(--green); font-size: 18px; font-family: var(--serif); }}
  .footer {{ text-align: center; font-family: var(--mono); font-size: 11px; color: var(--text-dim); padding: 24px; border-top: 1px solid var(--border); }}

  .print-btn-wrap {{ max-width: 900px; margin: 24px auto -12px; display: flex; justify-content: flex-end; padding: 0 24px; }}
  .print-btn {{ background: var(--accent2); color: #000; font-family: var(--sans); font-size: 13px; font-weight: 600; padding: 8px 16px; border: none; border-radius: 8px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 12px rgba(232, 168, 56, 0.2); transition: all 0.2s; }}
  .print-btn:hover {{ transform: translateY(-1px); box-shadow: 0 6px 16px rgba(232, 168, 56, 0.3); }}
  .print-btn svg {{ width: 14px; height: 14px; fill: none; stroke: currentColor; stroke-width: 2; }}

  @media print {{
    body {{ background: #fff !important; color: #000 !important; }}
    .hero {{ background: #f0f2f5 !important; color: #000 !important; border-bottom: 1px solid #ccc !important; padding: 24px 20px !important; }}
    .hero-title, .hero-sub, .hero-tag, .stat-value {{ color: #000 !important; }}
    .stat-card {{ background: #fff !important; border: 1px solid #ccc !important; color: #000 !important; }}
    .verdict-banner {{ background: #fff !important; border: 1px solid #ccc !important; border-left: 4px solid {verdict_color} !important; color: #000 !important; }}
    .card {{ background: #fff !important; border: 1px solid #ccc !important; color: #000 !important; page-break-inside: avoid; }}
    .card-title {{ color: #000 !important; }}
    .sentence-box, .highlight-box, .snippet-box, .token-box {{ background: #f9f9f9 !important; border: 1px solid #ddd !important; color: #000 !important; }}
    .print-btn-wrap {{ display: none !important; }}
    .footer {{ color: #555 !important; border-top: 1px solid #ccc !important; }}
    mark {{ background: rgba(232, 168, 56, 0.35) !important; color: #000 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }}
  }}
</style>
</head>
<body>
<div class="print-btn-wrap">
  <button class="print-btn" onclick="window.print()">
    <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="6 9 6 2 18 2 18 9"></polyline>
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
      <rect x="6" y="14" width="12" height="8"></rect>
    </svg>
    In báo cáo / Lưu PDF
  </button>
</div>
<div class="hero">
  <div class="hero-inner">
    <div class="hero-tag">C-checker v5 · Chinese Plagiarism Detection</div>
    <div class="hero-title">Báo cáo kiểm tra đạo văn</div>
    <div class="hero-sub">Được tạo lúc {now} · Runtime {runtime}s</div>
    <div class="summary-grid">
      <div class="stat-card"><div class="stat-label">Số ký tự</div><div class="stat-value">{text_length:,}</div></div>
      <div class="stat-card"><div class="stat-label">Số câu nghi ngờ</div><div class="stat-value {'red' if items else 'green'}">{len(items)}</div></div>
      <div class="stat-card"><div class="stat-label">Điểm cao nhất</div><div class="stat-value {'red' if max_score > 0.6 else 'green'}">{max_score:.3f}</div></div>
      <div class="stat-card"><div class="stat-label">Điểm trung bình</div><div class="stat-value">{avg_score:.3f}</div></div>
      <div class="stat-card"><div class="stat-label">Runtime</div><div class="stat-value">{runtime}s</div></div>
    </div>
  </div>
</div>
<div class="container">
  <div class="verdict-banner">⚖ Kết luận: {verdict}</div>
  <br>
  <div class="section-title">🔍 Chi tiết các đoạn nghi ngờ ({len(items)} kết quả)</div>
  {rows}
</div>
<div class="footer">C-CHECKER V5 · SENTENCE-LEVEL · MINILM SEMANTIC · DDGS SEARCH</div>
<script>
  if (new URLSearchParams(window.location.search).get('print') === 'true') {{
    window.addEventListener('load', function() {{
      setTimeout(function() {{
        window.print();
      }}, 800);
    }});
  }}
</script>
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
            writer.writerow(["timestamp", "matches", "avg_lcs", "avg_semantic", "avg_final", "max_final", "runtime_s"])
        writer.writerow(row)


# ══════════════════════════════════════════════════════════════════════════════
# FASTAPI APP
# ══════════════════════════════════════════════════════════════════════════════

app = FastAPI(
    title="C-checker v5",
    description="Chinese Plagiarism Detection API — sentence-level, MiniLM semantic",
    version="5.0.0",
)

# ── CORS ─────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://c-checker.onrender.com",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Request / Response schemas ───────────────────────────────────────────────

class CheckRequest(BaseModel):
    text: str = Field(..., min_length=10, description="Văn bản tiếng Trung cần kiểm tra")
    file_name: Optional[str] = "Manual Input"

class LoginRequest(BaseModel):
    token: str

class JobStatus(BaseModel):
    job_id: str
    status: str
    progress: Optional[str] = None
    current_sentence: Optional[str] = None
    created_at: str
    finished_at: Optional[str] = None
    error: Optional[str] = None


# ── Endpoints ────────────────────────────────────────────────────────────────

@app.get("/health")
def health():
    return {"status": "ok", "version": "5.0.0"}

security = HTTPBearer(auto_error=False)

def get_current_user(request: Request, credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = request.query_params.get("token")
    if not token and credentials:
        token = credentials.credentials
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        user = get_user_by_id(user_id)
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except Exception:
        raise HTTPException(status_code=401, detail="Could not validate credentials")

@app.post("/login")
def login(req: LoginRequest):
    try:
        idinfo = id_token.verify_oauth2_token(req.token, google_requests.Request(), GOOGLE_CLIENT_ID)
        google_id = idinfo['sub']
        email = idinfo.get('email')
        name = idinfo.get('name')
        picture = idinfo.get('picture')

        user = get_user_by_google_id(google_id)
        if not user:
            user = create_user(google_id=google_id, email=email, name=name, picture=picture)

        access_token = jwt.encode({"sub": user.id, "email": user.email}, JWT_SECRET, algorithm="HS256")
        return {
            "access_token": access_token, 
            "user": {"id": user.id, "name": user.name, "email": user.email, "picture": user.picture}
        }
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid Google token: {e}")

@app.get("/history")
def get_history(current_user: User = Depends(get_current_user)):
    jobs = get_jobs_by_user_id(current_user.id)
    history = []
    for j in jobs:
        # Check if there is an in-memory job with updated status
        status = j.status
        if j.job_id in JOBS:
            status = JOBS[j.job_id]["status"]
            
        job_data = {
            "job_id": j.job_id,
            "fileName": j.file_name or "Manual Input",
            "timestamp": j.created_at if isinstance(j.created_at, str) else j.created_at.isoformat(),
            "status": status,
        }
        
        if status == "done":
            try:
                res = None
                if j.result_json:
                    res = dict(j.result_json) if isinstance(j.result_json, dict) else json.loads(j.result_json)
                elif j.job_id in JOBS and JOBS[j.job_id]["status"] == "done":
                    # Construct result from memory job if not saved to db yet
                    mem_job = JOBS[j.job_id]
                    res = {
                        "job_id": j.job_id,
                        "status": "done",
                        "verdict": mem_job.get("verdict", "LOW"),
                        "verdict_text": mem_job.get("verdict_text", ""),
                        "max_score": mem_job.get("max_score", 0.0),
                        "runtime": mem_job.get("runtime", 0.0),
                        "sentences_checked": mem_job.get("sentences_checked", 0),
                        "matches_found": mem_job.get("matches_found", 0),
                        "finished_at": mem_job.get("finished_at"),
                    }
                
                if res:
                    res["job_id"] = j.job_id
                    if "report_items" not in res:
                        # Load from database report_items table
                        items = get_report_items(j.id)
                        res["report_items"] = items
                    
                    job_data.update({
                        "verdict": res.get("verdict", "LOW"),
                        "verdict_text": res.get("verdict_text", ""),
                        "max_score": res.get("max_score", 0.0),
                        "matches_found": res.get("matches_found", 0),
                        "result": res
                    })
                else:
                    job_data.update({
                        "verdict": "LOW",
                        "verdict_text": "Không có kết quả",
                        "max_score": 0.0,
                        "matches_found": 0,
                        "result": None
                    })
            except Exception as e:
                print(f"Error loading history job {j.job_id}: {e}")
                job_data.update({
                    "verdict": "LOW",
                    "verdict_text": "Lỗi tải dữ liệu",
                    "max_score": 0.0,
                    "matches_found": 0,
                    "result": None
                })
        elif status == "failed":
            error_msg = "Xử lý thất bại"
            if j.job_id in JOBS:
                error_msg = JOBS[j.job_id].get("error", "Xử lý thất bại")
            elif j.result_json:
                try:
                    res_err = dict(j.result_json) if isinstance(j.result_json, dict) else json.loads(j.result_json)
                    error_msg = res_err.get("error", "Xử lý thất bại")
                except Exception:
                    pass
            job_data.update({
                "verdict": "LOW",
                "verdict_text": "Thất bại",
                "max_score": 0.0,
                "matches_found": 0,
                "error": error_msg,
                "result": {"status": "failed", "error": error_msg}
            })
        else: # queued, running
            progress = "0/0"
            current_sentence = ""
            if j.job_id in JOBS:
                progress = JOBS[j.job_id].get("progress", "0/0")
                current_sentence = JOBS[j.job_id].get("current_sentence", "")
            
            job_data.update({
                "verdict": "LOW",
                "verdict_text": "Đang xử lý..." if status == "running" else "Đang chờ...",
                "max_score": 0.0,
                "matches_found": 0,
                "progress": progress,
                "current_sentence": current_sentence,
                "result": {"status": status, "progress": progress, "current_sentence": current_sentence}
            })
        history.append(job_data)
    return history

@app.post("/check", response_model=dict, status_code=202)
def submit_check(req: CheckRequest, background_tasks: BackgroundTasks, current_user: User = Depends(get_current_user)):
    job_id = str(uuid.uuid4())
    JOBS[job_id] = {
        "status": "queued",
        "progress": "0/0",
        "current_sentence": None,
        "created_at": datetime.now().isoformat(),
    }

    create_job(job_id=job_id, user_id=current_user.id, file_name=req.file_name)
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
    job = JOBS.get(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return JobStatus(
        job_id=job_id,
        status=job["status"],
        progress=job.get("progress"),
        current_sentence=job.get("current_sentence"),
        created_at=job["created_at"],
        finished_at=job.get("finished_at"),
        error=job.get("error"),
    )


@app.get("/result/{job_id}")
def get_result(job_id: str):
    job = JOBS.get(job_id)
    if not job:
        db_job = get_job_by_job_id(job_id)
        if db_job and db_job.status == "done" and db_job.result_json:
            data = dict(db_job.result_json) if isinstance(db_job.result_json, dict) else json.loads(db_job.result_json)
            data["job_id"] = job_id
            data["report_items"] = get_report_items(db_job.id)
            return data
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
        "verdict_text": job["verdict_text"],
        "max_score": job["max_score"],
        "runtime": job["runtime"],
        "sentences_checked": job["sentences_checked"],
        "matches_found": job["matches_found"],
        "finished_at": job["finished_at"],
        "report_items": job["report_items"],
    }

@app.get("/stream/{job_id}")
async def stream_status(job_id: str, current_user: User = Depends(get_current_user)):
    async def event_generator():
        last_sent = None
        idle_count = 0
        
        while True:
            job = JOBS.get(job_id)
            if not job:
                db_job = get_job_by_job_id(job_id)
                if db_job and db_job.status == "done" and db_job.result_json:
                    res = dict(db_job.result_json) if isinstance(db_job.result_json, dict) else json.loads(db_job.result_json)
                    yield f"data: {json.dumps({'status': res['status'], 'progress': res.get('progress'), 'current_sentence': res.get('current_sentence'), 'error': res.get('error')})}\n\n"
                    break
                else:
                    yield "data: {\"status\": \"not_found\"}\n\n"
                    break

            current = {
                'status': job['status'],
                'progress': job.get('progress'),
                'current_sentence': job.get('current_sentence'),
                'error': job.get('error')
            }

            # Chỉ gửi data thật khi có thay đổi
            if current != last_sent:
                yield f"data: {json.dumps(current)}\n\n"
                last_sent = current
                idle_count = 0
            else:
                idle_count += 1

            if job["status"] in ("done", "failed"):
                break

            # Gửi heartbeat comment mỗi giây để giữ connection sống
            yield ": heartbeat\n\n"
            await asyncio.sleep(1.0)

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",  # quan trọng — tắt buffering ở nginx/proxy
            "Connection": "keep-alive",
        }
    )


@app.get("/report/{job_id}", response_class=HTMLResponse)
def get_report(job_id: str):
    job = JOBS.get(job_id)

    if not job:
        db_job = get_job_by_job_id(job_id)
        if not db_job:
            raise HTTPException(status_code=404, detail="Job not found")
        
        if db_job.status == "done" and db_job.result_json:
            data = dict(db_job.result_json) if isinstance(db_job.result_json, dict) else json.loads(db_job.result_json)
            report_items = get_report_items(db_job.id)
            html = build_html_report(
                report_items,
                data.get("text_length", 0),
                data["runtime"],
                data["verdict_text"],
            )
            return HTMLResponse(content=html)
        
        raise HTTPException(status_code=404, detail="Job not ready")
    
    if job["status"] == "queued":
        return HTMLResponse(content=_waiting_html("⏳ Chờ xử lý..."), status_code=202)
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
     font-size:18px;flex-direction:column;gap:12px;}}
</style></head>
<body>{msg}<small style="color:#7a85a3">Trang tự làm mới sau 3s...</small></body>
</html>"""


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend:app", host="0.0.0.0", port=8000, reload=True)
