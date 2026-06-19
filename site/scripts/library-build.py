#!/usr/bin/env python3
"""Gera catálogo público (sem assets privados) e catálogo completo para o servidor."""
import copy
import json
import sys


def main():
    src_path, public_path, full_path = sys.argv[1:4]
    with open(src_path, encoding="utf-8") as f:
        catalog = json.load(f)

    full = copy.deepcopy(catalog)
    public = copy.deepcopy(catalog)

    for doc in public.get("documents", []):
        min_level = (doc.get("access") or {}).get("minLevel", "public")
        if min_level != "public":
            doc.pop("assets", None)

    with open(full_path, "w", encoding="utf-8") as f:
        json.dump(full, f, ensure_ascii=False, indent=2)
        f.write("\n")

    with open(public_path, "w", encoding="utf-8") as f:
        json.dump(public, f, ensure_ascii=False, indent=2)
        f.write("\n")


if __name__ == "__main__":
    main()
