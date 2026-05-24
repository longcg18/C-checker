# 
"""
Chinese Plagiarism Checker C-checker 
═══════════════════════════════════════════════════════
Cải tiến:
  - Lexical: n‑gram Jaccard + Dice + TF‑IDF cosine + LCS highlight
  - Semantic: sentence‑level similarity với model paraphrase-multilingual-MiniLM-L12-v2
  - TF‑IDF 
  - Báo cáo HTML
Requires: pip install jieba scikit-learn sentence-transformers ddgs trafilatura beautifulsoup4 colorama
"""

import re
import time
import json
import os
import unicodedata
from typing import List, Dict, Tuple, Optional
from collections import defaultdict
from datetime import datetime
from concurrent.futures import ThreadPoolExecutor, as_completed

import jieba
import requests
from bs4 import BeautifulSoup
from colorama import Fore, Style, init
from ddgs import DDGS
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sentence_transformers import SentenceTransformer, util
import trafilatura

init(autoreset=True)

# ─── CONFIG ────────────────────────────────────────────────────────────────
CONFIG = {
    "max_search_results": 8,            # Số kết quả tối đa mỗi query 
    "max_queries": 5,                   # Số query gửi lên DDGS
    "sentence_chunk_size": 50,          # Ký tự tối đa 1 chunk để tạo query
    "lexical_threshold": 0.35,
    "semantic_threshold": 0.75,
    "ngram_sizes": [2, 3, 4],
    "model_name": "paraphrase-multilingual-MiniLM-L12-v2",
    "fetch_timeout": 10,
    "delay_between_requests": 1.5,
    "max_page_length": 5000,            # Ký tự tối đa lấy từ trang web
    "top_candidates": 5,                # Số kết quả nghi ngờ nhất in ra
    "report_file": "plagiarism_report.html",
}

# ─── STOPWORDS TIẾNG TRUNG (các từ ngắt câu, đoạn) ───────────────────────────────────────────────────
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

def clean_text(text: str) -> str:
    """Chuẩn hóa văn bản: unicode, bỏ khoảng trắng thừa"""
    text = unicodedata.normalize("NFKC", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text

def tokenize(text: str, for_search: bool = False) -> List[str]:
    """Tách từ tiếng Trung, bỏ stopwords và ký tự không phải chữ Hán"""
    # Chỉ giữ chữ Hán và khoảng trắng
    text = re.sub(r"[^\u4e00-\u9fff\s]", "", text)
    if for_search:
        words = jieba.cut_for_search(text)
    else:
        words = jieba.cut(text)
    return [w.strip() for w in words if w.strip() and w not in STOPWORDS_ZH]

def split_sentences(text: str, max_len: int = 100) -> List[str]:
    """Tách văn bản thành các câu/chunk"""
    # Tách theo dấu câu tiếng Trung
    parts = re.split(r'[。！？；\n]', text)
    sentences = []
    for part in parts:
        part = part.strip()
        if len(part) >= 10:
            for i in range(0, len(part), max_len):
                chunk = part[i:i+max_len].strip()
                if len(chunk) >= 10:
                    sentences.append(chunk)
    return sentences

# ─── LEXICAL SIMILARITY ─────────────────────────────────────────────────────
def ngram_set(tokens: List[str], n: int) -> set:
    return {"_".join(tokens[i:i+n]) for i in range(len(tokens)-n+1)}

def jaccard_similarity(set_a: set, set_b: set) -> float:
    if not set_a or not set_b:
        return 0.0
    return len(set_a & set_b) / len(set_a | set_b)

def dice_similarity(set_a: set, set_b: set) -> float:
    if not set_a or not set_b:
        return 0.0
    return 2 * len(set_a & set_b) / (len(set_a) + len(set_b))

def ngram_lexical_score(tokens_src: List[str], tokens_ref: List[str]) -> float:
    """Kết hợp Jaccard và Dice trên nhiều kích cỡ n-gram"""
    scores = []
    for n in CONFIG["ngram_sizes"]:
        s_src = ngram_set(tokens_src, n)
        s_ref = ngram_set(tokens_ref, n)
        jac = jaccard_similarity(s_src, s_ref)
        dice = dice_similarity(s_src, s_ref)
        scores.append((jac + dice) / 2)
    return sum(scores) / len(scores) if scores else 0.0

def tfidf_cosine(text_src: str, text_ref: str) -> float:
    """TF‑IDF cosine similarity, tokenize bằng jieba"""
    try:
        # Dùng jieba để tách từ, sau đó nối lại thành chuỗi cho TfidfVectorizer
        src_tokens = tokenize(text_src)
        ref_tokens = tokenize(text_ref)
        if not src_tokens or not ref_tokens:
            return 0.0
        # Vectorizer nhận string, ta nối token bằng dấu cách
        vectorizer = TfidfVectorizer(analyzer="word")
        tfidf_matrix = vectorizer.fit_transform([" ".join(src_tokens), " ".join(ref_tokens)])
        return float(cosine_similarity(tfidf_matrix[0], tfidf_matrix[1])[0][0])
    except:
        return 0.0

def lcs_with_indexes(a: List[str], b: List[str]) -> Tuple[int, List[int], List[str]]:
    """Trả về độ dài LCS, vị trí khớp trong a, và danh sách token khớp"""
    m, n = len(a), len(b)
    dp = [[0]*(n+1) for _ in range(m+1)]
    for i in range(m):
        for j in range(n):
            if a[i] == b[j]:
                dp[i+1][j+1] = dp[i][j] + 1
            else:
                dp[i+1][j+1] = max(dp[i][j+1], dp[i+1][j])

    # Backtrack
    i, j = m, n
    idxs = []
    tokens = []
    while i > 0 and j > 0:
        if a[i-1] == b[j-1]:
            idxs.append(i-1)
            tokens.append(a[i-1])
            i -= 1
            j -= 1
        elif dp[i-1][j] > dp[i][j-1]:
            i -= 1
        else:
            j -= 1
    idxs.reverse()
    tokens.reverse()
    return dp[m][n], idxs, tokens

# ─── SEMANTIC SIMILARITY ─────────────────────────────────────────────────────
_model = None
def get_semantic_model():
    global _model
    if _model is None:
        print(Fore.YELLOW + f"  [*] Đang tải model semantic ({CONFIG['model_name']})...")
        _model = SentenceTransformer(CONFIG['model_name'])
        print(Fore.GREEN + "  [✓] Model sẵn sàng.")
    return _model

def semantic_sentence_similarity(src_sentences: List[str], ref_text: str) -> float:
    """
    So sánh từng câu của nguồn với văn bản tham chiếu.
    Trả về điểm cao nhất trung bình (top-k sentence matches).
    """
    model = get_semantic_model()
    if not src_sentences:
        return 0.0
    # Mã hóa tất cả câu nguồn và đoạn tham chiếu (cắt 1000 ký tự)
    ref_text_clean = clean_text(ref_text)[:1000]
    emb_src = model.encode(src_sentences, convert_to_tensor=True, show_progress_bar=False)
    emb_ref = model.encode([ref_text_clean], convert_to_tensor=True, show_progress_bar=False)
    # Tính ma trận cosine
    sims = util.cos_sim(emb_src, emb_ref).squeeze(1)
    # Lấy top 3 câu giống nhất, tính trung bình
    top_sims, _ = torch.topk(sims, min(3, len(sims)))
    return float(top_sims.mean())

def semantic_similarity_global(src: str, ref: str) -> float:
    """So sánh toàn bộ văn bản (cắt 1000 ký tự)"""
    model = get_semantic_model()
    emb_src = model.encode([clean_text(src)[:1000]], convert_to_tensor=True)
    emb_ref = model.encode([clean_text(ref)[:1000]], convert_to_tensor=True)
    return float(util.cos_sim(emb_src, emb_ref)[0][0])

import torch  

def select_queries_tfidf(text: str, n: int = 5) -> List[str]:
    """Chọn các câu có tổng trọng số TF‑IDF cao nhất, phủ đều văn bản"""
    sentences = split_sentences(text, max_len=CONFIG["sentence_chunk_size"])
    if len(sentences) <= n:
        return sentences[:n]

    tokenized = [" ".join(tokenize(s, for_search=True)) for s in sentences]
    try:
        vect = TfidfVectorizer(analyzer="word")
        tfidf = vect.fit_transform(tokenized)
        scores = tfidf.mean(axis=1).A1  # mảng 1D
    except:
        scores = [len(s) for s in sentences]  # fallback: ưu tiên câu dài

    step = max(1, len(sentences) // n)
    selected = []
    for i in range(0, len(sentences), step):
        window = sentences[i:i+step]
        window_scores = scores[i:i+step]
        if window:
            best_idx = max(range(len(window_scores)), key=lambda x: window_scores[x])
            selected.append(window[best_idx])
        if len(selected) >= n:
            break
    return selected[:n]

def search_web(query: str) -> List[Dict]:
    """Tìm kiếm bằng DDGS, trả về danh sách kết quả"""
    results = []
    try:
        with DDGS() as ddgs:
            # Thử tìm với region Trung Quốc trước, sau đó không giới hạn
            for r in ddgs.text(query, max_results=CONFIG["max_search_results"], region="cn-zh", safesearch="off"):
                results.append({"title": r.get("title", ""), "url": r.get("href", ""), "snippet": r.get("body", "")})
            if not results:
                for r in ddgs.text(query, max_results=CONFIG["max_search_results"]):
                    results.append({"title": r.get("title", ""), "url": r.get("href", ""), "snippet": r.get("body", "")})
    except Exception as e:
        print(Fore.YELLOW + f"  [!] Lỗi tìm kiếm: {e}")
    return results

def fetch_page_clean(url: str) -> str:
    """Tải trang và trích xuất nội dung chính bằng trafilatura + BeautifulSoup fallback"""
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                      "AppleWebKit/537.36 (KHTML, like Gecko) "
                      "Chrome/122.0.0.0 Safari/537.36"
    }
    try:
        resp = requests.get(url, headers=headers, timeout=CONFIG["fetch_timeout"])
        resp.encoding = resp.apparent_encoding
        # Dùng trafilatura để lấy nội dung chính
        downloaded = resp.text
        main_text = trafilatura.extract(downloaded, include_comments=False, include_tables=False)
        if main_text and len(main_text) > 200:
            return clean_text(main_text)[:CONFIG["max_page_length"]]
        else:
            # Fallback: dùng BeautifulSoup loại bỏ thẻ script, style, header, footer
            soup = BeautifulSoup(downloaded, "html.parser")
            for tag in soup(["script", "style", "nav", "footer", "header"]):
                tag.decompose()
            text = soup.get_text(separator=" ")
            return clean_text(text)[:CONFIG["max_page_length"]]
    except Exception:
        return ""

# ─── HIGHLIGHT ───────────────────────────────────────────────────────────────
def highlight_lcs(tokens: List[str], matched_indices: List[int]) -> str:
    """Tạo HTML highlight các token trùng khớp"""
    result = []
    matched_set = set(matched_indices)
    i = 0
    while i < len(tokens):
        if i in matched_set:
            span = []
            while i < len(tokens) and i in matched_set:
                span.append(tokens[i])
                i += 1
            result.append(f"<mark>{' '.join(span)}</mark>")
        else:
            result.append(tokens[i])
            i += 1
    return " ".join(result)

# ─── *** MAIN CHECK *** ─────────────────────────────────────────────────────────────
def check_plagiarism(text: str) -> List[Dict]:

    start_time = time.time()
    print(Fore.CYAN + "  [*] Token hóa văn bản nguồn...")
    src_tokens = tokenize(text)
    src_sentences = split_sentences(text)

    # Createqueries
    queries = select_queries_tfidf(text, CONFIG["max_queries"])
    print(Fore.CYAN + f"  [→] Tạo {len(queries)} query tìm kiếm (TF‑IDF chọn câu):")
    for i, q in enumerate(queries, 1):
        print(f"      {i}. {q[:80]}...")

    # Kết quả tìm kiếm
    seen_urls = set()
    all_web_results = []
    for q in queries:
        print(Fore.CYAN + f"  [🔍] Đang tìm: {q[:60]}...")
        results = search_web(q)
        for r in results:
            if r["url"] not in seen_urls:
                seen_urls.add(r["url"])
                all_web_results.append(r)
        time.sleep(CONFIG["delay_between_requests"])

    print(Fore.CYAN + f"  [→] Tổng cộng {len(all_web_results)} trang web duy nhất.")

    # Lưu trang lại
    detailed_matches = []

    def analyze_page(res: Dict) -> Optional[Dict]:
        url = res["url"]
        title = res["title"]
        snippet = res["snippet"]

        # Text loading
        full_text = fetch_page_clean(url)
        # Dùng full_text nếu có, nếu không thì fallback về snippet
        ref_text = full_text if full_text and len(full_text) > 100 else snippet
        if not ref_text:
            return None

        ref_tokens = tokenize(ref_text)
        # 1. Lexical: n‑gram Jaccard/Dice
        ngram_score = ngram_lexical_score(src_tokens, ref_tokens)
        # 2. TF‑IDF cosine
        tfidf_score = tfidf_cosine(text, ref_text)
        # 3. Semantic 
        sem_global = semantic_similarity_global(text, ref_text)
        # 4. Semantic sentence
        sem_local = semantic_sentence_similarity(src_sentences, ref_text)
        sem_combined = (sem_global + sem_local) / 2

        # 5. LCS highlight (dùng cho báo cáo)
        lcs_len, lcs_idx, lcs_tokens = lcs_with_indexes(src_tokens, ref_tokens)
        lcs_ratio = lcs_len / max(1, len(src_tokens))
        highlighted = highlight_lcs(src_tokens, lcs_idx) if lcs_len > 0 else " ".join(src_tokens)

        return {
            "url": url,
            "title": title,
            "snippet": snippet[:200],
            "ref_text": ref_text[:500],  
            "ngram_jaccard_dice": ngram_score,
            "tfidf_cosine": tfidf_score,
            "semantic_combined": sem_combined,
            "lcs_ratio": lcs_ratio,
            "lcs_tokens": lcs_tokens,
            "highlighted": highlighted,
            "final_score": 0.4 * tfidf_score + 0.4 * sem_combined + 0.2 * ngram_score,  ### FINAL SCORE
        }

    # DùngThreadPoolExecutor tải trang song song 
    with ThreadPoolExecutor(max_workers=4) as executor:
        future_to_url = {executor.submit(analyze_page, r): r for r in all_web_results}
        for future in as_completed(future_to_url):
            result = future.result()
            if result:
                detailed_matches.append(result)
            time.sleep(0.2)  # Giãn cách nhẹ

    # Sắp xếp theo final_score giảm dần
    detailed_matches.sort(key=lambda x: x["final_score"], reverse=True)

    elapsed = time.time() - start_time
    print(Fore.GREEN + f"  [✓] Phân tích hoàn tất trong {elapsed:.1f}s")
    return detailed_matches

# ─── BÁO CÁO HTML ────────────────────────────────────────────────────────────
def generate_html_report(matches: List[Dict], original_text: str, filename: str):
    # Đánh giá chung
    max_lex = max((m["tfidf_cosine"] for m in matches), default=0)
    max_sem = max((m["semantic_combined"] for m in matches), default=0)
    max_final = max((m["final_score"] for m in matches), default=0)

    if max_final > 0.7:
        verdict = "Nguy cơ đạo văn CAO"
    elif max_final > 0.4:
        verdict = "Có dấu hiệu nghi ngờ"
    else:
        verdict = "Không phát hiện đạo văn rõ ràng"

    html = f"""
<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<title>Báo cáo kiểm tra đạo văn</title>
<style>
body {{ font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }}
h1, h2, h3 {{ color: #2c3e50; }}
.match-block {{ border: 1px solid #ddd; border-radius: 8px; padding: 15px; margin-bottom: 25px; background: #fafafa; }}
.score {{ color: #c0392b; font-weight: bold; }}
mark {{ background-color: #ffff00; padding: 0 2px; }}
.preview {{ background: #fff; border-left: 4px solid #3498db; padding: 10px; margin: 10px 0; }}
.url {{ word-break: break-all; color: #2980b9; }}
.summary {{ background: #ecf0f1; padding: 15px; border-radius: 8px; margin-bottom: 30px; }}
</style>
</head>
<body>
<h1>📊 Báo cáo kiểm tra đạo văn</h1>
<div class="summary">
  <p><strong>Thời gian:</strong> {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}</p>
  <p><strong>Số ký tự văn bản:</strong> {len(original_text)}</p>
  <p><strong>Số nguồn đã kiểm tra:</strong> {len(matches)}</p>
  <p><strong>Lexical cao nhất (TF‑IDF):</strong> {max_lex:.3f}</p>
  <p><strong>Semantic cao nhất:</strong> {max_sem:.3f}</p>
  <p><strong>Kết luận:</strong> <span style="font-size: 1.3em;">{verdict}</span></p>
</div>
"""
    if not matches:
        html += "<p>Không tìm thấy nguồn nào có nội dung tương đồng đáng kể.</p>"
    else:
        html += "<h2>🔍 Các nguồn nghi ngờ (xếp theo mức độ)</h2>"
        for i, m in enumerate(matches[:10], 1):
            html += f"""
<div class="match-block">
  <h3>#{i}: {m['title'][:100]}</h3>
  <p class="url"><a href="{m['url']}" target="_blank">{m['url']}</a></p>
  <p>
    <span class="score">TF‑IDF: {m['tfidf_cosine']:.3f}</span> |
    <span class="score">n‑gram: {m['ngram_jaccard_dice']:.3f}</span> |
    <span class="score">Semantic: {m['semantic_combined']:.3f}</span> |
    <span class="score">LCS: {m['lcs_ratio']:.3f}</span> |
    <span class="score">Tổng: {m['final_score']:.3f}</span>
  </p>
  <h4>🔎 Đoạn văn bản của bạn với từ trùng khớp được tô vàng:</h4>
  <p class="preview">{m['highlighted']}</p>
  <h4>📄 Trích nguồn:</h4>
  <p class="preview">{m['snippet'][:300]}...</p>
</div>
"""
    html += "</body></html>"

    with open(filename, "w", encoding="utf-8") as f:
        f.write(html)
    print(Fore.GREEN + f"  [✓] Báo cáo đã lưu tại: {filename}")

# ─── CHẠY CHƯƠNG TRÌNH ─────────────────────────────────────────────────────
def main():
    print(Fore.CYAN + Style.BRIGHT + """
╔══════════════════════════════════════════════════════════╗
║    🔍 Chinese Plagiarism Checker  (Nâng cấp)            ║
║    Lexical + Semantic + Web Search (DDGS)               ║
╚══════════════════════════════════════════════════════════╝
""")

    # Đường dẫn file cần kiểm tra
    FILE_PATH = r"test.txt"  # <-- SỬA ĐƯỜNG DẪN FILE CỦA BẠN
    try:
        with open(FILE_PATH, "r", encoding="utf-8") as f:
            text = f.read()
        print(Fore.GREEN + f"  [✓] Đã đọc file: {FILE_PATH}")
    except FileNotFoundError:
        print(Fore.RED + f"  [!] Không tìm thấy file: {FILE_PATH}")
        return
    except Exception as e:
        print(Fore.RED + f"  [!] Lỗi: {e}")
        return

    text = clean_text(text)
    if len(text) < 20:
        print(Fore.RED + "  [!] Văn bản quá ngắn.")
        return

    print(Fore.WHITE + f"  Văn bản ({len(text)} ký tự): {text[:200]}...\n")

    matches = check_plagiarism(text)
    generate_html_report(matches, text, CONFIG["report_file"])

    # In nhanh top 5 ra console
    print(Fore.CYAN + "\n  📌 Top 5 nguồn nghi ngờ:")
    for i, m in enumerate(matches[:5], 1):
        print(Fore.YELLOW + f"\n  [{i}] {m['title'][:80]}")
        print(f"       TF‑IDF: {m['tfidf_cosine']:.3f} | n‑gram: {m['ngram_jaccard_dice']:.3f} | Semantic: {m['semantic_combined']:.3f} | LCS: {m['lcs_ratio']:.3f}")
        print(f"       URL: {m['url']}")

if __name__ == "__main__":
    main()