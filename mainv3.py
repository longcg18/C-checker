import re
import time
from collections import defaultdict

from ddgs import DDGS
from c_tokenize import c_tokenize


# =========================================================
# CONFIG
# =========================================================

WINDOW_SIZE = 4
STEP = 1
MAX_RESULTS_PER_QUERY = 3
TOP_CANDIDATES = 3

STOPWORDS = {
    "的", "了", "在", "是", "和", "也"
}

SEARCH_CACHE = {}


# =========================================================
# TOKENIZE
# =========================================================

def tokenize(text):

    tokens = c_tokenize(text)

    return [
        t.strip()
        for t in tokens
        if t.strip() and t not in STOPWORDS
    ]


# =========================================================
# SLIDING WINDOW
# =========================================================

def sliding_window_tokens(
    tokens,
    window_size=4,
    step=1
):

    windows = []

    if len(tokens) <= window_size:
        return [tokens]

    for i in range(
        0,
        len(tokens) - window_size + 1,
        step
    ):

        windows.append(
            tokens[i:i+window_size]
        )

    return windows


# =========================================================
# SEARCH
# =========================================================

def search_query(query, ddgs):

    if query in SEARCH_CACHE:
        return SEARCH_CACHE[query]

    try:

        results = list(
            ddgs.text(
                query,
                max_results=MAX_RESULTS_PER_QUERY,
                region="cn-zh",
                safesearch="off"
            )
        )

        if not results:

            results = list(
                ddgs.text(
                    query,
                    max_results=MAX_RESULTS_PER_QUERY
                )
            )

    except Exception as e:

        print(f"Search error: {e}")
        results = []

    SEARCH_CACHE[query] = results

    return results


# =========================================================
# LCS
# =========================================================

def lcs_with_indexes(a_tokens, b_tokens):

    m = len(a_tokens)
    n = len(b_tokens)

    dp = [
        [0] * (n + 1)
        for _ in range(m + 1)
    ]

    # build dp
    for i in range(m):

        for j in range(n):

            if a_tokens[i] == b_tokens[j]:

                dp[i+1][j+1] = dp[i][j] + 1

            else:

                dp[i+1][j+1] = max(
                    dp[i][j+1],
                    dp[i+1][j]
                )

    # backtrack
    i = m
    j = n

    matched_indexes = []
    matched_tokens = []

    while i > 0 and j > 0:

        if a_tokens[i-1] == b_tokens[j-1]:

            matched_indexes.append(i-1)
            matched_tokens.append(a_tokens[i-1])

            i -= 1
            j -= 1

        elif dp[i-1][j] > dp[i][j-1]:

            i -= 1

        else:

            j -= 1

    matched_indexes.reverse()
    matched_tokens.reverse()

    return {
        "length": dp[m][n],
        "indexes": matched_indexes,
        "tokens": matched_tokens
    }


# =========================================================
# SCORE
# =========================================================

def calc_score(lcs_len, a_len, b_len):

    if max(a_len, b_len) == 0:
        return 0

    return lcs_len / max(a_len, b_len)


# =========================================================
# HIGHLIGHT HTML
# =========================================================

def highlight_tokens(tokens, matched_indexes):

    result = []

    matched_set = set(matched_indexes)

    i = 0

    while i < len(tokens):

        # matched span
        if i in matched_set:

            span = []

            while (
                i < len(tokens)
                and i in matched_set
            ):

                span.append(tokens[i])
                i += 1

            result.append(
                f"<span class='match'>{''.join(span)}</span>"
            )

        else:

            result.append(tokens[i])
            i += 1

    return "".join(result)


# =========================================================
# MARKDOWN REPORT
# =========================================================

def write_markdown_report(report_items):

    with open(
        "report.md",
        "w",
        encoding="utf-8"
    ) as f:

        f.write("# Plagiarism Report\n\n")

        f.write("""
<style>

body {
    font-family: Arial;
    line-height: 1.6;
}

.match {
    background-color: yellow;
    padding: 2px;
    border-radius: 3px;
}

.block {
    border: 1px solid #ccc;
    padding: 12px;
    margin-bottom: 20px;
    border-radius: 8px;
}

.url {
    color: blue;
}

.score {
    font-weight: bold;
    color: red;
}

.source {
    background-color: #f5f5f5;
    padding: 10px;
    border-radius: 6px;
}

</style>

""")

        for item in report_items:

            f.write("<div class='block'>\n")

            f.write(
                f"<h2>Original Sentence</h2>\n"
            )

            f.write(
                f"<p>{item['sentence']}</p>\n"
            )

            f.write(
                f"<p class='score'>"
                f"Score: {item['score']:.2f}"
                f"</p>\n"
            )

            f.write(
                f"<p>"
                f"<a class='url' href='{item['url']}'>"
                f"{item['url']}"
                f"</a>"
                f"</p>\n"
            )

            f.write("<h3>Highlighted</h3>\n")

            f.write(
                f"<p>{item['highlighted']}</p>\n"
            )

            f.write("<h3>Matched Tokens</h3>\n")

            f.write(
                f"<p>{', '.join(item['tokens'])}</p>\n"
            )

            f.write("<h3>Source</h3>\n")

            f.write(
                f"<div class='source'>"
                f"<b>{item['title']}</b><br><br>"
                f"{item['body']}"
                f"</div>\n"
            )

            f.write("</div>\n")


# =========================================================
# MAIN
# =========================================================

def main():

    with open(
        "input.txt",
        "r",
        encoding="utf-8"
    ) as f:

        text = f.read()

    # split sentences
    sentences = re.split(
        r'[。！？；;]',
        text
    )

    sentences = [
        s.strip()
        for s in sentences
        if s.strip()
    ]

    report_items = []

    with DDGS() as ddgs:

        # =================================================
        # PROCESS EACH SENTENCE
        # =================================================

        for sentence in sentences:

            print(f"\nProcessing: {sentence}")

            # tokenize full sentence
            sentence_tokens = tokenize(sentence)

            # sliding windows
            windows = sliding_window_tokens(
                sentence_tokens,
                window_size=WINDOW_SIZE,
                step=STEP
            )

            # queries
            queries = [
                " ".join(w)
                for w in windows
            ]

            # aggregate candidate urls
            candidate_scores = defaultdict(float)
            candidate_data = {}

            # =============================================
            # SEARCH
            # =============================================

            for q in queries:

                results = search_query(
                    q,
                    ddgs
                )

                for r in results:

                    url = r.get("href", "")
                    title = r.get("title", "")
                    body = r.get("body", "")

                    compare_text = (
                        title + " " + body
                    )

                    body_tokens = tokenize(
                        compare_text
                    )

                    # LCS
                    lcs_result = lcs_with_indexes(
                        sentence_tokens,
                        body_tokens
                    )

                    score = calc_score(
                        lcs_result["length"],
                        len(sentence_tokens),
                        len(body_tokens)
                    )

                    candidate_scores[url] += score

                    # keep best
                    if (
                        url not in candidate_data
                        or score > candidate_data[url]["score"]
                    ):

                        candidate_data[url] = {
                            "title": title,
                            "body": body,
                            "score": score,
                            "lcs": lcs_result
                        }

                time.sleep(0.2)

            # =============================================
            # TOP RESULTS
            # =============================================

            sorted_candidates = sorted(
                candidate_scores.items(),
                key=lambda x: x[1],
                reverse=True
            )

            for url, total_score in sorted_candidates[:TOP_CANDIDATES]:

                data = candidate_data[url]

                highlighted = highlight_tokens(
                    sentence_tokens,
                    data["lcs"]["indexes"]
                )

                report_items.append({

                    "sentence": sentence,

                    "url": url,

                    "score": total_score,

                    "highlighted": highlighted,

                    "tokens": data["lcs"]["tokens"],

                    "title": data["title"],

                    "body": data["body"]
                })

    # =====================================================
    # EXPORT REPORT
    # =====================================================

    write_markdown_report(report_items)

    print("\nDone!")
    print("Report saved to report.md")


# =========================================================
# ENTRY
# =========================================================

if __name__ == "__main__":
    main()