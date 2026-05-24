import jieba
import re

STOPWORDS = {
    "的", "了", "在", "是", "和", "也"
}

def clean_text(text):
    return re.sub(r"[^\u4e00-\u9fff]", "", text)

def c_tokenize(text):
    text = clean_text(text)

    words = jieba.lcut(text)

    return [
        w.strip()
        for w in words
        if w.strip() and w not in STOPWORDS
    ]