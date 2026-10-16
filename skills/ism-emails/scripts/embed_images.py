#!/usr/bin/env python3
"""Inline local <img> files as compressed base64 for the Gmail paste route.

Usage: python3 embed_images.py email.html [-o out.html] [--max-display 380]

For each <img src="..."> that is a local file (not http, https, or data:),
resize to 2x its display width (from the width attribute, capped by
--max-display), flatten transparency onto white, compress, and replace src
with a data URI. Files not found next to the HTML are looked up by filename
in this skill's assets/logos/. Prints per-image and total sizes.
"""
import argparse
import base64
import io
import os
import re
import sys

from PIL import Image

SKILL_LOGOS = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "assets", "logos")
IMG_RE = re.compile(r"<img\b[^>]*>", re.I)
SRC_RE = re.compile(r'\bsrc="([^"]+)"', re.I)
WIDTH_RE = re.compile(r'\bwidth="(\d+)"', re.I)


def resolve(src, html_dir):
    for cand in (os.path.join(html_dir, src), os.path.join(SKILL_LOGOS, os.path.basename(src))):
        if os.path.isfile(cand):
            return cand
    return None


def encode(path, display_w):
    im = Image.open(path)
    target = min(im.width, display_w * 2)
    if im.width > target:
        im = im.resize((target, round(im.height * target / im.width)), Image.LANCZOS)
    if im.mode in ("RGBA", "LA", "P"):
        im = im.convert("RGBA")
        bg = Image.new("RGB", im.size, (255, 255, 255))
        bg.paste(im, mask=im.split()[3])
        im = bg
    else:
        im = im.convert("RGB")
    png = io.BytesIO()
    im.quantize(colors=128).save(png, format="PNG", optimize=True)
    jpg = io.BytesIO()
    im.save(jpg, format="JPEG", quality=82, optimize=True, progressive=True)
    if png.tell() <= jpg.tell():
        return "image/png", png.getvalue()
    return "image/jpeg", jpg.getvalue()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("html")
    ap.add_argument("-o", "--out")
    ap.add_argument("--max-display", type=int, default=380)
    a = ap.parse_args()
    html_dir = os.path.dirname(os.path.abspath(a.html))
    s = open(a.html, encoding="utf-8").read()
    missing = []

    def repl(m):
        tag = m.group(0)
        sm = SRC_RE.search(tag)
        if not sm:
            return tag
        src = sm.group(1)
        if src.startswith(("http://", "https://", "data:", "cid:")) or src.startswith("{"):
            return tag
        path = resolve(src, html_dir)
        if not path:
            missing.append(src)
            return tag
        wm = WIDTH_RE.search(tag)
        disp = min(int(wm.group(1)) if wm else a.max_display, a.max_display)
        mime, data = encode(path, disp)
        print(f"embedded {src}: {len(data) / 1024:.1f} KB")
        uri = f"data:{mime};base64,{base64.b64encode(data).decode()}"
        return tag.replace(sm.group(0), f'src="{uri}"')

    out = IMG_RE.sub(repl, s)
    dest = a.out or a.html
    open(dest, "w", encoding="utf-8").write(out)
    print(f"total HTML size: {len(out.encode('utf-8')) / 1024:.1f} KB -> {dest}")
    if missing:
        print("NOT FOUND: " + ", ".join(missing), file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
