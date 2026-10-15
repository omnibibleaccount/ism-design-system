#!/usr/bin/env python3
"""Instantiate static Inter and Lora weights from the variable fonts for native apps.
React Native, iOS (when bundling) and Android handle variable fonts unevenly, so apps ship static files.
Output: packages/web/assets/fonts-static/ (committed; Git LFS candidate). Needs: pip install fonttools
Usage: python3 scripts/build-static-fonts.py
"""
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

root = Path(__file__).resolve().parent.parent
src = root / 'packages/web/assets/fonts'
out = root / 'packages/web/assets/fonts-static'
out.mkdir(parents=True, exist_ok=True)

JOBS = [
    ('Inter-VariableFont.ttf', 'Inter', {'opsz': 14}, [(400, 'Regular'), (500, 'Medium'), (600, 'SemiBold'), (700, 'Bold')]),
    ('Lora-VariableFont.ttf', 'Lora', {}, [(400, 'Regular'), (600, 'SemiBold'), (700, 'Bold')]),
    ('Lora-Italic-VariableFont.ttf', 'Lora', {}, [(400, 'Italic'), (600, 'SemiBoldItalic'), (700, 'BoldItalic')]),
]
for fname, family, fixed, weights in JOBS:
    for wght, style in weights:
        font = TTFont(src / fname)
        inst = instantiateVariableFont(font, {**fixed, 'wght': wght}, inplace=False)
        name = f'{family}-{style}'
        for rec in inst['name'].names:
            if rec.nameID in (1, 16): rec.string = family if rec.nameID == 16 else (family if style in ('Regular', 'Italic', 'Bold', 'BoldItalic') else f'{family} {style.replace("Italic", "").strip() or ""}'.strip())
            elif rec.nameID in (2, 17): rec.string = style if rec.nameID == 17 else ('Regular' if 'Italic' not in style else 'Italic')
            elif rec.nameID == 4: rec.string = f'{family} {style}'
            elif rec.nameID == 6: rec.string = name
        inst.save(out / f'{name}.ttf')
        print('wrote', name)
