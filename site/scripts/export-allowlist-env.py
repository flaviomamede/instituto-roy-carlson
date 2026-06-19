#!/usr/bin/env python3
"""Imprime IRC_ALLOWLIST_JSON para colar na Vercel (sem expor no site)."""
import json
import sys
from pathlib import Path

src = Path(__file__).resolve().parents[2] / "biblioteca-adapters" / "irc" / "allowlist.json"
data = json.loads(src.read_text(encoding="utf-8"))
compact = json.dumps({"users": data.get("users", [])}, ensure_ascii=False)
print("IRC_ALLOWLIST_JSON=" + compact)
