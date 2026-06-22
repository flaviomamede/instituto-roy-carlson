#!/usr/bin/env python3
"""Servidor local para receber submissões do formulário e gerar PDF.

Inicia em http://127.0.0.1:8791 e aceita POST multipart em /api/revista/submeter-artigo.

Uso (na pasta template/):
  python3 serve-submissao.py
"""
from __future__ import annotations

import cgi
import json
import re
import shutil
import subprocess
import sys
import zipfile
from http.server import BaseHTTPRequestHandler, HTTPServer
from io import BytesIO
from pathlib import Path

ROOT = Path(__file__).resolve().parent
ARTIGOS = ROOT / "artigos"
BUILD = ROOT / "build-article.py"
PORT = 8791


def slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r"[^\w\s-]", "", text, flags=re.UNICODE)
    text = re.sub(r"[\s_]+", "-", text)
    return text[:60].strip("-") or "artigo"


def next_id() -> int:
    max_id = 0
    ARTIGOS.mkdir(parents=True, exist_ok=True)
    for p in ARTIGOS.iterdir():
        m = re.match(r"^(\d+)-", p.name)
        if m:
            max_id = max(max_id, int(m.group(1)))
    return max_id + 1


def parse_keywords(raw: str) -> list[str]:
    return [k.strip() for k in re.split(r"[\n,;]+", raw or "") if k.strip()]


def parse_authors(raw: str) -> list[dict]:
    autores: list[dict] = []
    for line in (raw or "").splitlines():
        line = line.strip()
        if not line:
            continue
        if ":" in line:
            papel, nome = line.split(":", 1)
            autores.append({"nome": nome.strip(), "papel": papel.strip().lower()})
        else:
            autores.append({"nome": line, "papel": "autor"})
    return autores


def _field(form: cgi.FieldStorage, name: str) -> cgi.FieldStorage | None:
    if name not in form:
        return None
    item = form[name]
    if isinstance(item, list):
        return item[0] if item else None
    return item


def save_submission(form: cgi.FieldStorage) -> dict:
    titulo = form.getfirst("titulo", "").strip()
    if not titulo:
        raise ValueError("Título obrigatório.")

    slug = slugify(form.getfirst("slug", "") or titulo)
    num = next_id()
    article_dir = ARTIGOS / f"{num:03d}-{slug}"
    figuras_dir = article_dir / "figuras"
    article_dir.mkdir(parents=True)
    figuras_dir.mkdir()

    md_field = _field(form, "markdown")
    if md_field is None or not getattr(md_field, "file", None):
        raise ValueError("Arquivo artigo.md obrigatório.")
    md_name = getattr(md_field, "filename", "") or "artigo.md"
    if not md_name.lower().endswith(".md"):
        raise ValueError("O corpo do artigo deve ser um arquivo .md")
    (article_dir / "artigo.md").write_bytes(md_field.file.read())

    zip_field = _field(form, "figuras_zip")
    if zip_field is not None and getattr(zip_field, "file", None):
        zname = getattr(zip_field, "filename", "") or ""
        if zname.lower().endswith(".zip"):
            data = zip_field.file.read()
            with zipfile.ZipFile(BytesIO(data)) as zf:
                for info in zf.infolist():
                    if info.is_dir():
                        continue
                    name = Path(info.filename).name
                    if name.startswith(".") or "/" in name or "\\" in name:
                        # ignora subpastas por segurança
                        if "/" in info.filename or "\\" in info.filename:
                            name = Path(info.filename).name
                    if not re.match(r"^[A-Za-z0-9][A-Za-z0-9._\-]*\.(png|jpe?g|gif|webp|svg)$", name, re.I):
                        continue
                    (figuras_dir / name).write_bytes(zf.read(info))

    meta = {
        "id": num,
        "slug": slug,
        "titulo": titulo,
        "autores": parse_authors(form.getfirst("autores", "")),
        "recebido": form.getfirst("recebido", "").strip(),
        "aprovado": form.getfirst("aprovado", "").strip(),
        "publicado": form.getfirst("publicado", "").strip(),
        "palavras_chave": parse_keywords(form.getfirst("palavras_chave", "")),
        "sumario": form.getfirst("sumario", "").strip(),
        "volume": int(form.getfirst("volume", "1") or 1),
        "numero": int(form.getfirst("numero", "1") or 1),
        "ano": int(form.getfirst("ano", "2026") or 2026),
        "mes_ano": form.getfirst("mes_ano", "").strip() or form.getfirst("ano", "2026").strip(),
        "paginas": "1–?",
        "site_url": form.getfirst("site_url", "www.institutoroycarlson.org/revista").strip(),
    }
    (article_dir / "meta.json").write_text(
        json.dumps(meta, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )

    subprocess.run([sys.executable, str(BUILD), str(article_dir.relative_to(ROOT))], check=True, cwd=ROOT)

    return {
        "ok": True,
        "id": num,
        "slug": slug,
        "pasta": str(article_dir.relative_to(ROOT)),
        "pdf": str((article_dir / "saida" / "artigo.pdf").relative_to(ROOT)),
        "html": str((article_dir / "saida" / "artigo.html").relative_to(ROOT)),
        "abs_pdf": str((article_dir / "saida" / "artigo.pdf").resolve()),
        "abs_html": str((article_dir / "saida" / "artigo.html").resolve()),
    }


class Handler(BaseHTTPRequestHandler):
    def _cors(self) -> None:
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")

    def do_OPTIONS(self) -> None:
        self.send_response(204)
        self._cors()
        self.end_headers()

    def do_GET(self) -> None:
        if self.path.rstrip("/") == "/api/revista/status":
            body = json.dumps({"ok": True, "service": "submissao", "port": PORT}, ensure_ascii=False).encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self._cors()
            self.end_headers()
            self.wfile.write(body)
            return
        self.send_error(404)

    def do_POST(self) -> None:
        if self.path.rstrip("/") != "/api/revista/submeter-artigo":
            self.send_error(404)
            return
        try:
            form = cgi.FieldStorage(
                fp=self.rfile,
                headers=self.headers,
                environ={
                    "REQUEST_METHOD": "POST",
                    "CONTENT_TYPE": self.headers.get("Content-Type", ""),
                },
            )
            result = save_submission(form)
            body = json.dumps(result, ensure_ascii=False).encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self._cors()
            self.end_headers()
            self.wfile.write(body)
        except Exception as exc:
            body = json.dumps({"ok": False, "error": str(exc)}, ensure_ascii=False).encode("utf-8")
            self.send_response(400)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self._cors()
            self.end_headers()
            self.wfile.write(body)

    def log_message(self, fmt: str, *args) -> None:
        print(f"[submissão] {args[0]}")


def main() -> None:
    server = HTTPServer(("127.0.0.1", PORT), Handler)
    print(f"Servidor de submissão em http://127.0.0.1:{PORT}")
    print("POST → /api/revista/submeter-artigo")
    server.serve_forever()


if __name__ == "__main__":
    main()
