"""Utilitários compartilhados entre serve-submissao.py e build-article.py."""
from __future__ import annotations

import re
import zipfile
from io import BytesIO
from pathlib import Path

FIGURE_RE = re.compile(r"^[A-Za-z0-9][A-Za-z0-9._\-]*\.(png|jpe?g|gif|webp|svg)$", re.I)
TABLE_RE = re.compile(r"^[A-Za-z0-9][A-Za-z0-9._\-]*\.csv$", re.I)
GRAPHIC_RE = re.compile(
    r"^[A-Za-z0-9][A-Za-z0-9._\-]*\.(csv|png|jpe?g|gif|webp|svg)$", re.I
)


def extract_zip(data: bytes, dest: Path, name_pattern: re.Pattern) -> list[str]:
    """Extrai do zip apenas arquivos com nome seguro na raiz (ignora subpastas)."""
    dest.mkdir(parents=True, exist_ok=True)
    saved: list[str] = []
    with zipfile.ZipFile(BytesIO(data)) as zf:
        for info in zf.infolist():
            if info.is_dir():
                continue
            name = Path(info.filename).name
            if not name or name.startswith("."):
                continue
            if not name_pattern.match(name):
                continue
            (dest / name).write_bytes(zf.read(info))
            saved.append(name)
    return saved
