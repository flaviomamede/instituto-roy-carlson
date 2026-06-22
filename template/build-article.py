#!/usr/bin/env python3
"""Monta HTML e PDF de um artigo a partir de meta.json + artigo.md + figuras/.

Pipeline: Markdown (+ pré-processamento) → Pandoc → HTML → Chrome → PDF.
Não há etapa LaTeX intermediária.

Uso:
  python3 build-article.py artigos/001-carlson-medicao-tensoes
  python3 build-article.py --all
"""
from __future__ import annotations

import argparse
import csv
import html
import json
import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent
ASSETS = ROOT / "assets"
TEMPLATE = ROOT / "article.template.html"
STYLES = ROOT / "article.css"


def load_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def format_authors(autores: list[dict]) -> str:
    parts: list[str] = []
    for i, a in enumerate(autores):
        nome = a.get("nome", "").strip()
        papel = a.get("papel", "autor").strip().lower()
        if not nome:
            continue
        if papel == "autor":
            parts.append(nome)
        else:
            label = papel[0].upper() + papel[1:] if papel else papel
            parts.append(f"{label}: {nome}")
    if not parts:
        return ""
    # Primeiro autor sem rótulo; demais com ponto e vírgula como no Word
    first = parts[0]
    rest = parts[1:]
    if not rest:
        return first
    return first + "; " + "; ".join(rest)


def format_keywords(words: list[str]) -> str:
  return "\n".join(f"<p>{w}</p>" for w in words if w.strip())


def header_text(meta: dict) -> str:
    vol = meta.get("volume", 1)
    num = meta.get("numero", 1)
    mes_ano = meta.get("mes_ano") or str(meta.get("ano", ""))
    pag = meta.get("paginas", "")
    return f"Revista IRC, vol.{vol:02d} nº.{num:02d} ({mes_ano}) p.{pag}"


def _resolve_asset(article_dir: Path, ref: str, subdir: str) -> Path | None:
    ref = ref.lstrip("./")
    if ref.startswith(f"{subdir}/"):
        candidate = article_dir / ref
    else:
        candidate = article_dir / subdir / ref
    if candidate.exists():
        return candidate
    alt = article_dir / subdir / Path(ref).name
    if alt.exists():
        return alt
    return None


def _sniff_dialect(sample: str) -> csv.Dialect:
    try:
        return csv.Sniffer().sniff(sample, delimiters=",;\t")
    except csv.Error:
        return csv.excel


def csv_to_html_table(csv_path: Path, caption: str = "") -> str:
    raw = csv_path.read_text(encoding="utf-8-sig")
    lines = [ln for ln in raw.splitlines() if ln.strip()]
    if not lines:
        return '<p class="table-missing">Tabela vazia.</p>'
    dialect = _sniff_dialect("\n".join(lines[:5]))
    rows = list(csv.reader(lines, dialect))
    if not rows:
        return '<p class="table-missing">Tabela vazia.</p>'
    parts = ['<figure class="table-block">', "<table>"]
    for i, row in enumerate(rows):
        tag = "th" if i == 0 else "td"
        parts.append("<tr>")
        for cell in row:
            parts.append(f"<{tag}>{html.escape(cell.strip())}</{tag}>")
        parts.append("</tr>")
    parts.append("</table>")
    if caption.strip():
        parts.append(f'<figcaption class="table-caption">{html.escape(caption.strip())}</figcaption>')
    parts.append("</figure>")
    return "\n".join(parts)


def preprocess_markdown(md: str, article_dir: Path) -> str:
    """Substitui referências a CSV em tabelas/ por HTML de tabela (antes do Pandoc)."""

    def repl_table(match: re.Match[str]) -> str:
        caption, path = match.group(1), match.group(2)
        csv_path = _resolve_asset(article_dir, path, "tabelas")
        if csv_path is None:
            return (
                f'<p class="table-missing">Tabela não encontrada: '
                f"{html.escape(path)}</p>"
            )
        return csv_to_html_table(csv_path, caption)

    md = re.sub(
        r"!\[([^\]]*)\]\((tabelas/[^)\s]+\.csv)\)",
        repl_table,
        md,
        flags=re.IGNORECASE,
    )
    return md


def md_to_html(md_path: Path, article_dir: Path) -> str:
    md = preprocess_markdown(md_path.read_text(encoding="utf-8"), article_dir)
    with tempfile.NamedTemporaryFile("w", suffix=".md", encoding="utf-8", delete=False) as tmp:
        tmp.write(md)
        tmp_path = tmp.name
    try:
        html_out = subprocess.check_output(
            [
                "pandoc",
                tmp_path,
                "-f",
                "markdown+tex_math_dollars+raw_tex",
                "-t",
                "html",
                "--mathjax",
                "--wrap=none",
            ],
            text=True,
        )
    finally:
        Path(tmp_path).unlink(missing_ok=True)

    html_out = re.sub(
        r'src="(?!https?://|data:)([^"]+)"',
        lambda m: f'src="{(_resolve_media_uri(article_dir, m.group(1)))}"',
        html_out,
    )
    html_out = re.sub(r"<figure>", r'<figure class="figure-block">', html_out)
    html_out = re.sub(
        r'<figcaption([^>]*)>([^<]*)</figcaption>',
        r'<figcaption class="figure-caption"\1>\2</figcaption>',
        html_out,
    )
    return html_out


def _resolve_media_uri(article_dir: Path, ref: str) -> str:
    ref = ref.lstrip("./")
    for sub in ("figuras", "graficos"):
        if ref.startswith(f"{sub}/") or "/" not in ref:
            path = _resolve_asset(article_dir, ref, sub)
            if path is not None:
                return path.as_uri()
    candidate = article_dir / ref
    if candidate.exists():
        return candidate.as_uri()
    return (article_dir / ref).as_uri()


def fill_template(meta: dict, body_html: str, article_dir: Path, out_html: Path) -> None:
    tpl = TEMPLATE.read_text(encoding="utf-8")
    css_href = STYLES.as_uri()
    replacements = {
        "{{TITULO}}": meta["titulo"],
        "{{AUTORES_HTML}}": format_authors(meta.get("autores", [])),
        "{{RECEBIDO}}": meta.get("recebido", "—"),
        "{{APROVADO}}": meta.get("aprovado", "—"),
        "{{PUBLICADO}}": meta.get("publicado", "—"),
        "{{SUMARIO}}": meta.get("sumario", ""),
        "{{PALAVRAS_CHAVE_HTML}}": format_keywords(meta.get("palavras_chave", [])),
        "{{CORPO_HTML}}": body_html,
        "{{SITE_URL}}": meta.get("site_url", "www.institutoroycarlson.org/revista"),
        "{{RC_IMAGE}}": (ASSETS / "RC.png").as_uri(),
        "{{LOGO_IMAGE}}": (ASSETS / "Logo6.jpeg").as_uri(),
        "{{CSS_HREF}}": css_href,
        "{{HEADER_TEXTO}}": header_text(meta),
    }
    html = tpl
    for k, v in replacements.items():
        html = html.replace(k, v)
    out_html.parent.mkdir(parents=True, exist_ok=True)
    out_html.write_text(html, encoding="utf-8")


def find_chrome() -> str | None:
    for cmd in ("google-chrome", "google-chrome-stable", "chromium", "chromium-browser"):
        if shutil.which(cmd):
            return cmd
    return None


def html_to_pdf(html_path: Path, pdf_path: Path) -> None:
    chrome = find_chrome()
    if not chrome:
        raise RuntimeError("Chrome/Chromium não encontrado para gerar PDF.")
    pdf_path.parent.mkdir(parents=True, exist_ok=True)
    cmd = [
        chrome,
        "--headless=new",
        "--disable-gpu",
        "--no-pdf-header-footer",
        f"--print-to-pdf={pdf_path}",
        html_path.as_uri(),
    ]
    subprocess.run(cmd, check=True, capture_output=True)


def count_pages(pdf_path: Path) -> int:
    try:
        import fitz  # PyMuPDF
    except ImportError:
        return 0
    return fitz.open(pdf_path).page_count


def next_article_id(artigos_dir: Path) -> int:
    max_id = 0
    for p in artigos_dir.iterdir():
        if not p.is_dir():
            continue
        m = re.match(r"^(\d+)-", p.name)
        if m:
            max_id = max(max_id, int(m.group(1)))
    return max_id + 1


def build_article(article_dir: Path, update_pages: bool = True) -> Path:
    meta_path = article_dir / "meta.json"
    md_path = article_dir / "artigo.md"
    if not meta_path.exists():
        raise FileNotFoundError(f"meta.json ausente em {article_dir}")
    if not md_path.exists():
        raise FileNotFoundError(f"artigo.md ausente em {article_dir}")

    meta = load_json(meta_path)
    body_html = md_to_html(md_path, article_dir)
    out_html = article_dir / "saida" / "artigo.html"
    out_pdf = article_dir / "saida" / "artigo.pdf"

    fill_template(meta, body_html, article_dir, out_html)
    html_to_pdf(out_html, out_pdf)

    if update_pages:
        n = count_pages(out_pdf)
        if n > 0:
            meta["paginas"] = f"1–{n}"
            meta_path.write_text(json.dumps(meta, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
            # rebuild header with correct page count
            fill_template(load_json(meta_path), body_html, article_dir, out_html)
            html_to_pdf(out_html, out_pdf)

    print(f"✓ {article_dir.name}")
    print(f"  HTML → {out_html}")
    print(f"  PDF  → {out_pdf} ({count_pages(out_pdf)} páginas)")
    return out_pdf


def build_all() -> None:
    artigos = ROOT / "artigos"
    dirs = sorted(d for d in artigos.iterdir() if d.is_dir())
    if not dirs:
        print("Nenhuma pasta em artigos/")
        return
    for d in dirs:
        build_article(d)


def main() -> int:
    parser = argparse.ArgumentParser(description="Gera HTML/PDF de artigo da Revista Concreto")
    parser.add_argument("article", nargs="?", help="Pasta do artigo (ex.: artigos/001-slug)")
    parser.add_argument("--all", action="store_true", help="Processar todas as pastas em artigos/")
    args = parser.parse_args()

    if args.all:
        build_all()
        return 0

    if not args.article:
        parser.print_help()
        return 1

    article_dir = Path(args.article)
    if not article_dir.is_absolute():
        article_dir = ROOT / article_dir
    build_article(article_dir)
    return 0


if __name__ == "__main__":
    sys.exit(main())
