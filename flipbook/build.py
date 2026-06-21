#!/usr/bin/env python3
import base64, glob, json, os, re, sys

BASE = "/home/claude/build"
OUT  = "/mnt/user-data/outputs/leitor-revista-irc.html"

# 1) page images -> data URIs
imgs = sorted(glob.glob(f"{BASE}/web/p*.webp"), key=lambda p:int(re.findall(r"\d+", os.path.basename(p))[0]))
pages = []
for p in imgs:
    b = base64.b64encode(open(p,"rb").read()).decode("ascii")
    pages.append("data:image/webp;base64," + b)
assert len(pages) == 6, f"expected 6 pages, got {len(pages)}"

# 2) per-page text (collapse whitespace, keep accents)
texts = []
for i in range(1,7):
    t = open(f"{BASE}/txt{i}.txt", encoding="utf-8").read()
    t = re.sub(r"\s+", " ", t).strip()
    texts.append(t)

# 3) StPageFlip library
lib = open(f"{BASE}/package/dist/js/page-flip.browser.js", encoding="utf-8").read()
print("lib contains '</script'? ", "</script" in lib.lower())
lib_safe = re.sub(r"</(script)", r"<\\/\1", lib, flags=re.I)   # safe even if present

# 4) inject
html = open(f"{BASE}/reader.html", encoding="utf-8").read()
for marker, count_name in [("/*__STF__*/","STF"), ("__PAGES__","PAGES"), ("__PAGE_TEXT__","TEXT")]:
    assert html.count(marker)==1, f"marker {marker} appears {html.count(marker)} times"

pages_js = json.dumps(pages, ensure_ascii=False)
text_js  = json.dumps(texts, ensure_ascii=False).replace("</","<\\/")

html = html.replace("/*__STF__*/", lib_safe)
html = html.replace("__PAGES__", pages_js)
html = html.replace("__PAGE_TEXT__", text_js)

os.makedirs(os.path.dirname(OUT), exist_ok=True)
open(OUT, "w", encoding="utf-8").write(html)

# 5) dump app script for syntax check
m = re.findall(r"<script>(.*?)</script>", html, flags=re.S)
open(f"{BASE}/_app_check.js","w",encoding="utf-8").write(m[-1])

print("pages base64 total: %.2f MB" % (sum(len(p) for p in pages)/1024/1024))
print("final HTML size:    %.2f MB" % (os.path.getsize(OUT)/1024/1024))
print("written:", OUT)
