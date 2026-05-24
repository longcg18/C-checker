import re
import time
import jieba
import jieba.analyse
import numpy as np
from collections import defaultdict

from ddgs import DDGS
from sentence_transformers import SentenceTransformer

# =========================
# CONFIG
# =========================
WINDOW_SIZE = 5
STEP = 2
TOP_K_WINDOWS = 3

CACHE = {}

model = SentenceTransformer("BAAI/bge-m3")
#

# =========================
# TEXT PREPROCESSING
# =========================
def clean_text(text):
    return re.sub(r"[^\u4e00-\u9fff]", "", text)


def tokenize(text):
    text = clean_text(text)
    words = jieba.lcut(text)

    stopwords = {"的", "了", "在", "是", "和", "也"}

    return [w for w in words if w.strip() and w not in stopwords]


# =========================
# QUERY GENERATION
# =========================
def get_sliding_windows(sentence, window_size=5, step=2):
    tokens = tokenize(sentence)

    windows = []
    for i in range(0, len(tokens) - window_size + 1, step):
        windows.append(" ".join(tokens[i:i + window_size]))

    return windows[:TOP_K_WINDOWS]


def keyword_query(sentence):
    words = jieba.analyse.extract_tags(sentence, topK=5)
    return " ".join(words)


# =========================
# SIMILARITY
# =========================
def jaccard_similarity(a, b):
    set_a = set(tokenize(a))
    set_b = set(tokenize(b))

    if not set_a or not set_b:
        return 0

    return len(set_a & set_b) / len(set_a | set_b)


def semantic_similarity(a, b):
    # return 0.0
    ea = model.encode(a)
    eb = model.encode(b)

    return float(np.dot(ea, eb) / (np.linalg.norm(ea) * np.linalg.norm(eb)))


def final_score(a, b):
    j = jaccard_similarity(a, b)
    s = semantic_similarity(a, b)

    return j * 0.5 + s * 0.5


# =========================
# SEARCH (WITH CACHE)
# =========================
def search_ddg(query, ddgs):
    if query in CACHE:
        return CACHE[query]

    try:
        results = ddgs.text(query, max_results=5)
    except:
        results = []

    CACHE[query] = results
    return results


# =========================
# MAIN
# =========================
def main():
    with open("input.txt", "r", encoding="utf-8") as f:
        text = f.read()

    sentences = re.split(r'[。！？;]', text)
    sentences = [s.strip() for s in sentences if s.strip()]

    potential_urls = defaultdict(float)
    sentence_reports = []

    with DDGS() as ddgs:

        for sentence in sentences:

            # =========================
            # QUERY GENERATION
            # =========================
            windows = get_sliding_windows(sentence)

            queries = windows[:]

            # add keyword query
            queries.append(keyword_query(sentence))

            # add short full sentence query
            queries.append(" ".join(tokenize(sentence)[:6]))

            seen_urls = set()
            sentence_score_sum = 0
            sentence_count = 0

            # =========================
            # SEARCH LOOP
            # =========================
            for q in queries:

                results = search_ddg(q, ddgs)

                if not results:
                    continue

                for r in results:
                    url = r.get("href")
                    title = r.get("title", "")
                    body = r.get("body", "")

                    if not url or url in seen_urls:
                        continue

                    seen_urls.add(url)

                    text_to_compare = title + " " + body

                    score = final_score(sentence, text_to_compare)

                    weight = score

                    potential_urls[url] += weight

                    sentence_score_sum += score
                    sentence_count += 1

                time.sleep(0.3)

            avg_sentence_score = (
                sentence_score_sum / sentence_count
                if sentence_count > 0 else 0
            )

            sentence_reports.append({
                "sentence": sentence,
                "score": avg_sentence_score
            })

    # =========================
    # OUTPUT RESULTS
    # =========================
    print("\n============================")
    print("TOP SUSPECT SOURCES")
    print("============================")

    sorted_sources = sorted(
        potential_urls.items(),
        key=lambda x: x[1],
        reverse=True
    )

    for url, score in sorted_sources[:10]:
        print(f"{url} | weight={score:.2f}")

    print("\n============================")
    print("SENTENCE REPORT")
    print("============================")

    total_score = 0

    for r in sentence_reports:
        print(f"{r['score']:.2f} | {r['sentence']}")
        total_score += r['score']

    if sentence_reports:
        print("\n============================")
        print(f"FINAL SCORE: {total_score / len(sentence_reports):.2f}")


if __name__ == "__main__":
    main()