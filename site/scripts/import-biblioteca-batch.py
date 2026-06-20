#!/usr/bin/env python3
"""Importa lotes de PDFs para o catálogo da Biblioteca IRC.

- Livros "Marcelo Protz": PDFs na raiz de biblioteca/ modificados após 22h de
  2026-06-19 → coleção "Marcelo Protz", tipo "Livro", acesso member.
- "Papers do Dr. Carlson": PDFs em biblioteca/Carlson/ → coleção "Papers do
  Dr. Carlson", tipo "papers", acesso member, exceto 3 abertos (public).

Saídas (idempotente — não duplica slug):
  - biblioteca-adapters/irc/catalog.json     (novas entradas anexadas)
  - biblioteca-adapters/irc/extra-files.tsv  (manifesto folder<TAB>origem<TAB>destino)
"""
import json
import os
import re
import unicodedata
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
BIB = ROOT / "biblioteca"
CATALOG = ROOT / "biblioteca-adapters" / "irc" / "catalog.json"
MANIFEST = ROOT / "biblioteca-adapters" / "irc" / "extra-files.tsv"

CUTOFF = datetime(2026, 6, 19, 22, 0, 0)  # "após as 22h"
CARLSON_PUBLIC = {
    "causes control cracking.pdf",
    "consid optimum cem mass conc.pdf",
    "carlson - lista publicações.pdf",
}


def strip_accents(s):
    return "".join(c for c in unicodedata.normalize("NFKD", s) if not unicodedata.combining(c))


def slugify(s):
    s = strip_accents(s).lower()
    s = re.sub(r"[^a-z0-9]+", "-", s).strip("-")
    s = re.sub(r"-{2,}", "-", s)
    return s or "doc"


def has_accent(s):
    return any(unicodedata.combining(c) for c in unicodedata.normalize("NFKD", s))


def parse_name(filename):
    """Deriva (titulo, autor_ou_None, ano_ou_None) do nome do arquivo."""
    name = re.sub(r"\.pdf$", "", filename, flags=re.I)
    name = name.replace("_", " ").strip()
    name = re.sub(r"\.+$", "", name).strip()  # remove ".." finais
    author = None
    m = re.search(r"\(([^()]+)\)\s*$", name)  # último parêntese = autores
    if m:
        author = re.sub(r"\s+", " ", m.group(1)).strip(" .,")
        name = name[: m.start()].strip()
    year = None
    ym = re.search(r"\b(19|20)\d{2}\b", name)
    if ym:
        year = int(ym.group(0))
    title = re.sub(r"\s+", " ", name).strip(" -.,")
    return title, author, year


def make_entry(filename, collection, doc_type, min_level, default_author, used_slugs):
    title, author, year = parse_name(filename)
    base = slugify(title)
    slug = base
    i = 2
    while slug in used_slugs:
        slug = f"{base}-{i}"
        i += 1
    used_slugs.add(slug)

    authors = [author] if author else ([default_author] if default_author else [])
    entry = {
        "id": slug,
        "slug": slug,
        "title": title or filename,
        "authors": authors,
        "language": "pt" if has_accent(filename) else "en",
        "type": doc_type,
        "collection": collection,
        "tags": (["Roy Carlson", "concreto massa"] if doc_type == "papers"
                 else ["livro", "concreto"]),
        "access": {"minLevel": min_level},
        "public": {"summary": (
            f"Artigo técnico de {default_author} — acervo do Instituto Roy Carlson."
            if doc_type == "papers"
            else "Livro técnico do acervo da Biblioteca IRC."
        )},
        "assets": {"pdf": slug + ".pdf"},
    }
    if year:
        entry["year"] = year
    return entry


def main():
    catalog = json.loads(CATALOG.read_text(encoding="utf-8"))
    docs = catalog.setdefault("documents", [])
    existing_slugs = {d["slug"] for d in docs}
    used_slugs = set(existing_slugs)

    new_docs = []
    manifest = []  # (folder, source_rel, dest)

    # 1) Livros "Marcelo Protz" — raiz de biblioteca/, modificados após 22h
    protz = []
    for p in sorted(BIB.glob("*.pdf")):
        mt = datetime.fromtimestamp(p.stat().st_mtime)
        if mt >= CUTOFF:
            protz.append(p)
    for p in protz:
        entry = make_entry(p.name, "Marcelo Protz", "livro", "member", None, used_slugs)
        if entry["slug"] in existing_slugs:
            continue
        new_docs.append(entry)
        manifest.append(("private", p.name, entry["assets"]["pdf"]))

    # 2) Papers do Dr. Carlson — biblioteca/Carlson/
    carlson_dir = BIB / "Carlson"
    for p in sorted(carlson_dir.glob("*.PDF")) + sorted(carlson_dir.glob("*.pdf")):
        is_public = p.name.lower() in CARLSON_PUBLIC
        level = "public" if is_public else "member"
        entry = make_entry(p.name, "Papers do Dr. Carlson", "papers", level,
                           "Roy W. Carlson", used_slugs)
        if entry["slug"] in existing_slugs:
            continue
        new_docs.append(entry)
        manifest.append(("public" if is_public else "private",
                         "Carlson/" + p.name, entry["assets"]["pdf"]))

    docs.extend(new_docs)
    CATALOG.write_text(json.dumps(catalog, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    lines = ["# folder\tsource (rel. a biblioteca/)\tdest"]
    for folder, src, dest in manifest:
        lines.append(f"{folder}\t{src}\t{dest}")
    MANIFEST.write_text("\n".join(lines) + "\n", encoding="utf-8")

    n_books = len([m for m in manifest if not m[1].startswith("Carlson/")])
    n_papers = len([m for m in manifest if m[1].startswith("Carlson/")])
    n_public = len([m for m in manifest if m[0] == "public"])
    print(f"Novos documentos: {len(new_docs)}  (livros Marcelo Protz: {n_books}, "
          f"papers Carlson: {n_papers})")
    print(f"Acesso: público {n_public}, member {len(manifest) - n_public}")
    print("Total no catálogo agora:", len(docs))
    print("\nAmostra (Marcelo Protz):")
    for d in new_docs[:3]:
        print(f"  - {d['slug']}  | {d['title'][:55]}  | {d['collection']} | {d['access']['minLevel']}")
    print("Amostra (Carlson, incl. públicos):")
    for d in new_docs:
        if d["collection"] == "Papers do Dr. Carlson" and d["access"]["minLevel"] == "public":
            print(f"  - PUBLIC {d['slug']}  | {d['title'][:50]}")


if __name__ == "__main__":
    main()
