#!/usr/bin/env python3
"""Deterministic QA scan for ISM / TTB email deliverables.

Usage: python3 qa_scan.py FILE [FILE ...] [--route esp|paste]

Checks .html and .txt files for standing-rule violations (em dashes, emojis,
hidden characters), signature and contact canon, retired contact details,
unfilled tokens, alt text, and route-specific build rules. Prints each
finding as FAIL or WARN and ends with PASS or FAIL. Exit code 1 on any FAIL.
"""
import argparse
import re
import sys

HIDDEN = re.compile("[\u00ad\u034f\u180e\u200b-\u200f\u2007\u202a-\u202e\u2060-\u2064\ufeff]")
HIDDEN_ENT = re.compile(r"&#(8203|8204|8205|8206|8207|8199|847|65279|173|8288);|&(zwj|zwnj|shy|lrm|rlm);", re.I)
EMDASH = re.compile("\u2014|&mdash;|&#8212;|&#x2014;", re.I)
EMOJI = re.compile("[\U0001F300-\U0001FAFF\U00002600-\U000027BF\U0001F000-\U0001F2FF\U0001F900-\U0001F9FF\uFE0F]")
RETIRED = [r"833-65", r"800-65", r"biblebus@ttb\.org", r"god bless you"]
TOKEN = re.compile(r"\{[A-Z][A-Z0-9_]*\}")
MERGE = re.compile(r"\{FirstName\|Friend\}")


def scan(path, route):
    fails, warns = [], []
    raw = open(path, encoding="utf-8").read()
    is_html = path.lower().endswith((".html", ".htm"))
    low = raw.lower()

    for pat, label in ((EMDASH, "em dash"), (EMOJI, "emoji"), (HIDDEN, "hidden character"), (HIDDEN_ENT, "hidden-character entity")):
        hits = pat.findall(raw)
        if hits:
            fails.append(f"{label} found x{len(hits)}")
    for r in RETIRED:
        if re.search(r, low):
            fails.append(f"retired or banned text: {r}")

    text = re.sub(r"<[^>]+>", " ", raw) if is_html else raw
    text = re.sub(r"&rsquo;|&#8217;|\u2019", "'", text)
    flat = re.sub(r"\s+", " ", text)
    if not re.search(r"'til all have heard", flat, re.I):
        warns.append("closing 'til all have heard not found (fine only for translated or non-Troy emails)")
    elif not re.search(r"'til all have heard,? Troy Carl President", flat, re.I):
        fails.append("signature is not the three-line canon: 'til all have heard, / Troy Carl / President")
    phone = flat.count("1-833-60-BIBLE (24253)")
    if phone == 0:
        fails.append("footer phone 1-833-60-BIBLE (24253) missing")
    elif phone > 1:
        fails.append(f"footer phone listed {phone} times; list once")
    if "contact@ism.bible" not in low:
        fails.append("contact@ism.bible missing")

    tokens = sorted(set(TOKEN.findall(raw)))
    if tokens:
        warns.append("unfilled placeholders: " + ", ".join(tokens))

    if is_html:
        for tag in re.findall(r"<img\b[^>]*>", raw, re.I):
            if not re.search(r'\balt="[^"]+"', tag):
                fails.append("image without alt text")
        if not re.search(r"display:\s*none[^>]*>[^<]{20,}", raw, re.I):
            fails.append("preheader missing or under 20 characters")
        m = re.search(r"<title>(.*?)</title>", raw, re.I | re.S)
        if m and len(m.group(1).strip()) > 45 and not TOKEN.search(m.group(1)):
            warns.append(f"title/subject is {len(m.group(1).strip())} chars; keep subject under 45")
        for m in re.finditer(r"<(p|div|span|td)[^>]*style=\"[^\"]*color:\s*#046de3[^\"]*\"[^>]*>\s*(hi |'til|&#39;til)", raw, re.I):
            fails.append("greeting or sign-off colored blue")
        blue = set(re.findall(r'<a[^>]+href="([^"]+)"[^>]*background(?:-color)?:\s*#046de3', raw, re.I))
        blue |= set(re.findall(r'bgcolor="#046de3"[^>]*>\s*<a[^>]+href="([^"]+)"', raw, re.I))
        if len(blue) > 2:
            warns.append(f"{len(blue)} blue buttons with different URLs; one primary CTA per email")
        size_kb = len(raw.encode("utf-8")) / 1024
        if route == "paste":
            if re.search(r"<style\b", raw, re.I):
                fails.append("<style> block present (Gmail paste deletes it)")
            if re.search(r"@media", raw, re.I):
                fails.append("media query present (Gmail paste deletes it)")
            if re.search(r"\bclass=\"", raw, re.I):
                fails.append("class attributes present (Gmail paste renames them)")
            if re.search(r"<audio\b|<video\b", raw, re.I):
                fails.append("HTML5 audio/video player present; use tappable Play links")
            if not re.search(r"max-width:\s*420px", raw, re.I):
                fails.append("root table not locked to max-width:420px")
            body = re.search(r"<body[^>]*style=\"([^\"]*)\"", raw, re.I)
            if body and re.search(r"background(-color)?:\s*#(?!fff)", body.group(1), re.I):
                fails.append("body background is not white (grey outer shell)")
            ov = len(re.findall(r"overflow:\s*hidden", raw, re.I)) - len(re.findall(r"display:\s*none[^\"]*overflow:\s*hidden|overflow:\s*hidden[^\"]*display:\s*none", raw, re.I))
            if ov > 0:
                fails.append("overflow:hidden wrapper outside the preheader (sanitizers strip it)")
            if re.search(r'<img[^>]+src="(?!data:|https?:|\{)', raw, re.I):
                fails.append("local image not embedded; run scripts/embed_images.py")
            if re.search(r'<img[^>]+src="https?:', raw, re.I):
                warns.append("remote image URL on paste route; confirm it is public, not a signed preview URL")
            if size_kb > 100:
                fails.append(f"HTML is {size_kb:.0f} KB; Gmail clips near 102 KB")
            elif size_kb > 90:
                warns.append(f"HTML is {size_kb:.0f} KB; close to the Gmail clip limit")
        else:
            if re.search(r'<img[^>]+src="data:', raw, re.I):
                fails.append("base64 image on ESP route; host images on HTTPS")
            if "unsubscribe" not in low:
                fails.append("unsubscribe link missing (ESP route)")
        print(f"  size: {size_kb:.1f} KB")
    return fails, warns


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("files", nargs="+")
    ap.add_argument("--route", choices=["esp", "paste"], default="esp")
    a = ap.parse_args()
    total_fail = 0
    for f in a.files:
        print(f"== {f} ({a.route})")
        fails, warns = scan(f, a.route)
        for x in fails:
            print(f"  FAIL {x}")
        for x in warns:
            print(f"  WARN {x}")
        total_fail += len(fails)
    print("PASS" if total_fail == 0 else f"FAIL ({total_fail} issue(s))")
    sys.exit(1 if total_fail else 0)


if __name__ == "__main__":
    main()
