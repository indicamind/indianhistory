"""Extract Hultzsch's public-domain transcription and translation from saved UiO pages.

Research helper: pass downloaded Bibliotheca Polyglotta fulltext HTML files as
arguments. This does not call a translation service. Editorial review is still
required before the extracted text is published.
"""

from html import unescape
from pathlib import Path
import json
import re
import sys


def plain(fragment):
    fragment = re.sub(r"<script.*?</script>", "", fragment, flags=re.S)
    return re.sub(r"\s+", " ", unescape(re.sub(r"<[^>]+>", " ", fragment))).strip()


def extract(path):
    page = Path(path).read_text()
    blocks = re.findall(
        r"<div class='BolkContainer'>(.*?)<div class='clear'></div></div><div class='clear'></div>",
        page,
        re.S,
    )
    result = []
    for block in blocks:
        original = re.search(r"<div class='(?:Magadhī|Māghadhī)'>(.*?)</div></div>", block, re.S)
        english = re.search(r"<div class='English'>(.*?)</div></div>", block, re.S)
        if not original or not english:
            continue
        image = re.search(r'filsti = "(public/media/img_to_txt/[^"]+)"', original.group(1))
        result.append({
            "original": plain(original.group(1)),
            "english": plain(english.group(1)),
            "image": f"https://www2.hf.uio.no/polyglotta/{image.group(1)}" if image else None,
        })
    return result


if __name__ == "__main__":
    print(json.dumps({Path(name).stem: extract(name) for name in sys.argv[1:]}, ensure_ascii=False, indent=2))
