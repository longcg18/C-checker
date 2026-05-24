import re
import jieba
import time

from serpapi import GoogleSearch
from googlesearch import search
from sliding_window import get_sliding_windows
from ddgs import DDGS

def calculate_lcs_ratio(text1, text2):
    m = len(text1)
    n = len(text2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if text1[i-1] == text2[j-1]:
                dp[i][j] = dp[i-1][j-1] + 1
            else:
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])
    
    lcs_length = dp[m][n]
    
    ratio = (lcs_length / m) * 100 if m > 0 else 0
    
    return lcs_length, ratio

def check_plagiarism(input_text, result_text):
    words_input = set(jieba.lcut(input_text))
    words_searched = set(jieba.lcut(result_text))
    
    intersection = words_input.intersection(words_searched)
    union = words_input.union(words_searched)
    
    if(len(union) == 0):
        return 0.0

    similarity_score = len(intersection) / len(union)
    

    return similarity_score 

with open("input.txt", "r", encoding="utf-8") as f:
    text = f.read()

sentences = re.split(r'[。！？;]', text)
sentences = [s.strip() for s in sentences if s.strip()]

potential_urls = {}
all_results_data = [] 

with DDGS() as ddgs:
    for sentence in sentences:
        windows = get_sliding_windows(sentence, window_size=5, step=2)
        
        windows = windows[:3] 

        for q in windows:
            try:
                results = ddgs.text(
                    q, 
                    max_results=3,
                    region="cn-zh",
                    safesearch="off"
                )
                
                if not results:
                    results = ddgs.text(q, max_results=3)

                if results:
                    for r in results:
                        url = r["href"]
                        body = r["body"]
                        
                        potential_urls[url] = potential_urls.get(url, 0) + 1
                        
                        score = check_plagiarism(q, body)
                        
                        all_results_data.append({
                            "sentence": sentence,
                            "query": q,
                            "url": url,
                            "score": score
                        })
                time.sleep(0.5) 
                
            except Exception as e:
                print(f"Lỗi khi search cụm '{q}': {e}")
                time.sleep(5) 


print("\n--- CÁC NGUỒN NGHI NGỜ NHẤT ---")
sorted_sources = sorted(potential_urls.items(), key=lambda x: x[1], reverse=True)
for url, freq in sorted_sources[:5]:
    print(f"Nguồn: {url} (Xuất hiện {freq} lần)")

if all_results_data:
    avg_total = sum(item['score'] for item in all_results_data) / len(all_results_data)
    print(f"\n=> Tỷ lệ trùng lặp sơ bộ toàn bài: {avg_total:.2f}%")