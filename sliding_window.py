from tokenize import tokenize

def get_sliding_windows(text, window_size=7, step=3):
    tokens = tokenize(text)
    windows = []
    
    for i in range(0, len(tokens) - window_size + 1, step):
        window_segment = tokens[i : i + window_size]
        query_string = "".join(window_segment)
        windows.append(query_string)
        
    if not windows and tokens:
        windows.append("".join(tokens))
        
    return windows

# Test
# text_input = "持续学习提升技能在职场中非常重要，无论职位高低，只要敬业，就能获得成就感。"

# search_queries = get_sliding_windows(text_input, window_size=5, step=2)

# print(f"Số lượng câu query tạo ra: {len(search_queries)}")
# for chuyên_mục in search_queries:
#     print(f"Query: \"{chuyên_mục}\"")