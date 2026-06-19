#!/usr/bin/env python3
"""Baixa as 5 melhores fotos (maior resolução) por usina do acervo Memória da Eletricidade."""

from __future__ import annotations

import io
import json
import re
import sys
import time
import urllib.error
import urllib.request
from dataclasses import dataclass
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    print("Instale Pillow: pip install Pillow", file=sys.stderr)
    sys.exit(1)

BASE = "https://memoriadaeletricidade.com.br"
OUT_DIR = Path(__file__).resolve().parents[1] / "imagens" / "banner-barragens"
META_PATH = OUT_DIR / "sources.json"
MANIFEST_PATH = OUT_DIR / "manifest.json"
MIN_PIXELS = 400_000  # prefer >= ~800x500
TARGET = 5
UA = "InstitutoRoyCarlson-BannerBot/1.0"

DAM_LABELS = {
    "furnas": "Furnas",
    "jupia": "Jupiá",
    "ilha-solteira": "Ilha Solteira",
    "marimbondo": "Marimbondo",
    "sobradinho": "Sobradinho",
    "sao-simao": "São Simão",
    "foz-do-areia": "Foz do Areia",
    "tucurui": "Tucuruí",
    "itaipu": "Itaipu",
}

DAMS: dict[str, list[str]] = {
    "furnas": [
        "/acervo/144235/vistas-aereas-do-local-de-construcao-da-usina-hidreletrica-de-furnas",
        "/acervo/127627/album-fotografico-da-inauguracao-da-usina-de-furnas",
        "/acervo/498/usina-hidreletrica-furnas",
        "/acervo/1787/aspectos-diversos-dos-tuneis-subterraneos-da-usina-hidreletrica-de-furnas",
    ],
    "jupia": [
        "/acervo/1251/aspectos-da-construcao-da-usina-hidreletrica-jupia",
        "/acervo/1703/usina-hidreletrica-jupia",
    ],
    "ilha-solteira": [
        "/acervo/144827/aspectos-da-construcao-da-usina-hidreletrica-ilha-solteira",
        "/acervo/356/usina-hidreletrica-ilha-solteira",
    ],
    "marimbondo": [
        "/acervo/1958/construcao-da-usina-hidreletrica-marimbondo",
    ],
    "sobradinho": [
        "/acervo/1291/construcao-da-usina-hidreletrica-sobradinho",
    ],
    "sao-simao": [
        "/acervo/143500/vista-do-vertedouro-da-usina-hidreletrica-sao-simao",
        "/acervo/143501/vista-do-vertedouro-da-usina-hidreletrica-sao-simao",
    ],
    "foz-do-areia": [
        "/acervo/143552/obras-de-construcao-da-usina-hidreletrica-de-foz-do-areia",
        "/acervo/126319/obras-de-construcao-da-usina-hidreletrica-de-foz-do-areia",
        "/acervo/9450/usina-hidreletrica-de-foz-do-areia",
    ],
    "tucurui": [
        "/acervo/145265/aspectos-da-construcao-da-usina-hidreletrica-tucurui",
        "/acervo/144453/obras-de-expansao-da-usina-hidreletrica-tucurui-maio-2002",
        "/acervo/144483/obras-de-expansao-da-usina-hidreletrica-tucurui-agosto-2001",
        "/acervo/4420/usina-hidreletrica-tucurui",
    ],
    "itaipu": [
        "/acervo/124600/obras-de-construcao-e-montagem-na-usina-de-itaipu",
        "/acervo/141343/construcao-da-represa-de-iguacu",
        "/acervo/124491/comportas-e-ensecadeiras-de-itaipu",
        "/acervo/42712/presidentes-do-brasil-e-paraguai-em-cerimonia-de-abertura-do-vertedouro-da-usina-de-itaipu",
    ],
}

# São Simão tem acervo fotográfico escasso no portal
SAO_SIMAO_EXTRA: list[str] = []

LINK_RE = re.compile(
    r'href="(https://memoriadaeletricidade\.com\.br/acervo/\d+/[^"#?]+)"'
)
BLOB_RE = re.compile(
    r"https://repositoriomemoriashiro\.blob\.core\.windows\.net/repositoriomemoriashiro/[a-f0-9]+\.(?:jpe?g|png|webp|tif)",
    re.I,
)
TITLE_RE = re.compile(r"<title>([^<|]+)", re.I)


@dataclass
class Candidate:
    slug: str
    page_url: str
    blob_url: str
    width: int
    height: int
    pixels: int
    title: str

    @property
    def min_side(self) -> int:
        return min(self.width, self.height)


def fetch(url: str) -> str:
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept-Encoding": "gzip"})
    with urllib.request.urlopen(req, timeout=60) as resp:
        raw = resp.read()
        if raw[:2] == b"\x1f\x8b":
            import gzip

            raw = gzip.decompress(raw)
        return raw.decode("utf-8", errors="replace")


def fetch_bytes(url: str) -> bytes:
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept-Encoding": "gzip"})
    with urllib.request.urlopen(req, timeout=90) as resp:
        raw = resp.read()
        if raw[:2] == b"\x1f\x8b":
            import gzip

            raw = gzip.decompress(raw)
        return raw


def child_links(html: str, parent_path: str) -> list[str]:
    parent_id = re.search(r"/acervo/(\d+)/", parent_path)
    parent_num = parent_id.group(1) if parent_id else ""
    seen: set[str] = set()
    out: list[str] = []
    for m in LINK_RE.finditer(html):
        url = m.group(1).split("?")[0]
        if url in seen:
            continue
        seen.add(url)
        if "/acervo/" not in url:
            continue
        child_id = re.search(r"/acervo/(\d+)/", url)
        if not child_id:
            continue
        if child_id.group(1) == parent_num:
            continue
        out.append(url)
    return out


def page_title(html: str) -> str:
    m = TITLE_RE.search(html)
    return m.group(1).strip() if m else ""


def inspect_page(page_url: str) -> Candidate | None:
    try:
        html = fetch(page_url)
    except urllib.error.HTTPError:
        return None
    blobs = list(dict.fromkeys(BLOB_RE.findall(html)))
    if not blobs:
        return None
    best: Candidate | None = None
    title = page_title(html)
    slug = page_url.rstrip("/").rsplit("/", 1)[-1]
    for blob in blobs:
        try:
            data = fetch_bytes(blob)
            img = Image.open(io.BytesIO(data))
            w, h = img.size
        except Exception:
            continue
        if w < 320 or h < 180:
            continue
        cand = Candidate(
            slug=slug,
            page_url=page_url,
            blob_url=blob,
            width=w,
            height=h,
            pixels=w * h,
            title=title,
        )
        if best is None or cand.pixels > best.pixels:
            best = cand
    return best


def collect_candidates(seed_paths: list[str], max_pages: int = 80) -> list[Candidate]:
    queue: list[str] = [BASE + p for p in seed_paths]
    visited_pages: set[str] = set()
    seen_blobs: set[str] = set()
    candidates: list[Candidate] = []

    while queue and len(visited_pages) < max_pages:
        page_url = queue.pop(0)
        if page_url in visited_pages:
            continue
        visited_pages.add(page_url)
        try:
            html = fetch(page_url)
        except Exception as exc:
            print(f"  skip {page_url}: {exc}")
            continue

        cand = inspect_page(page_url)
        if cand and cand.blob_url not in seen_blobs:
            seen_blobs.add(cand.blob_url)
            candidates.append(cand)
            print(f"  + {cand.width}x{cand.height} {cand.page_url}")

        for link in child_links(html, page_url.replace(BASE, "")):
            if link not in visited_pages and link not in queue:
                queue.append(link)

        time.sleep(0.15)

    return candidates


def pick_best(candidates: list[Candidate], n: int = TARGET) -> list[Candidate]:
    def score(c: Candidate) -> float:
        s = float(c.pixels)
        if c.width >= c.height * 1.12:
            s += 200_000
        title = c.title.lower()
        for kw in (
            "vista aérea",
            "vista aerea",
            "barragem",
            "vertedouro",
            "represa",
            "panorâm",
            "panoram",
            "usina hidrelétrica",
        ):
            if kw in title:
                s += 120_000
                break
        return s

    hi = [c for c in candidates if c.pixels >= MIN_PIXELS]
    pool = hi if len(hi) >= n else candidates
    pool = sorted(pool, key=score, reverse=True)
    chosen: list[Candidate] = []
    used_blobs: set[str] = set()
    for c in pool:
        if c.blob_url in used_blobs:
            continue
        chosen.append(c)
        used_blobs.add(c.blob_url)
        if len(chosen) >= n:
            break
    return chosen


def save_jpeg(blob_url: str, dest: Path) -> None:
    data = fetch_bytes(blob_url)
    img = Image.open(io.BytesIO(data)).convert("RGB")
    dest.parent.mkdir(parents=True, exist_ok=True)
    img.save(dest, "JPEG", quality=88, optimize=True)


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    meta: dict[str, list[dict]] = {}
    slides: list[dict] = []

    for old in OUT_DIR.glob("*.jpg"):
        old.unlink()

    for dam, seeds in DAMS.items():
        print(f"\n== {dam} ==")
        if dam == "sao-simao":
            seeds = seeds + SAO_SIMAO_EXTRA
        candidates = collect_candidates(seeds, max_pages=120 if dam == "marimbondo" else 70)
        best = pick_best(candidates)
        if len(best) < TARGET:
            print(f"  AVISO: só {len(best)} imagens adequadas")
        label = DAM_LABELS.get(dam, dam)
        meta[dam] = []
        for i, cand in enumerate(best[:TARGET], start=1):
            dest = OUT_DIR / f"{dam}-{i}.jpg"
            print(f"  -> {dest.name} ({cand.width}x{cand.height})")
            save_jpeg(cand.blob_url, dest)
            entry = {
                "file": dest.name,
                "dam": label,
                "damSlug": dam,
                "width": cand.width,
                "height": cand.height,
                "page": cand.page_url,
                "title": cand.title,
            }
            meta[dam].append(entry)
            slides.append(
                {
                    **entry,
                    "alt": cand.title.split("|")[0].strip() or f"Usina Hidrelétrica {label}",
                }
            )
            time.sleep(0.2)

    META_PATH.write_text(json.dumps(meta, ensure_ascii=False, indent=2), encoding="utf-8")
    MANIFEST_PATH.write_text(
        json.dumps({"slides": slides}, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    print(f"\nMetadados: {META_PATH}")
    print(f"Manifesto: {MANIFEST_PATH} ({len(slides)} slides)")


if __name__ == "__main__":
    main()
