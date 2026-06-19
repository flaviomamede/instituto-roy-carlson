#!/usr/bin/env python3
"""Gera os BR Codes (Pix Copia e Cola) e os QR de cada plano de assinatura.

Lê site/assinatura/assinatura.config.json e escreve:
  - site/assinatura/pix.json          (payload + valor por plano)
  - site/assinatura/qr-<plano>.png    (QR de cada plano, valor embutido)

Sem dependências de rede. Requer 'qrcode[pil]'. Os campos nome/cidade do
BR Code são cosméticos (o banco mostra o titular real da chave).
"""
import json
import unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]            # .../site
ASS = ROOT / "assinatura"
CFG = ASS / "assinatura.config.json"


def ascii_upper(s: str, maxlen: int) -> str:
    """Normaliza para ASCII maiúsculo (BR Code é mais compatível assim)."""
    s = unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode("ascii")
    return s.upper().strip()[:maxlen]


def tlv(tag: str, value: str) -> str:
    return f"{tag}{len(value):02d}{value}"


def crc16(payload: str) -> str:
    crc = 0xFFFF
    for ch in payload.encode("utf-8"):
        crc ^= ch << 8
        for _ in range(8):
            crc = ((crc << 1) ^ 0x1021) & 0xFFFF if (crc & 0x8000) else (crc << 1) & 0xFFFF
    return f"{crc:04X}"


def brcode(key: str, amount: float, name: str, city: str, txid: str = "***") -> str:
    mai = tlv("00", "br.gov.bcb.pix") + tlv("01", key)
    p = tlv("00", "01") + tlv("26", mai) + tlv("52", "0000") + tlv("53", "986")
    p += tlv("54", f"{amount:.2f}") + tlv("58", "BR")
    p += tlv("59", ascii_upper(name, 25)) + tlv("60", ascii_upper(city, 15))
    p += tlv("62", tlv("05", txid)) + "6304"
    return p + crc16(p)


def main() -> None:
    cfg = json.loads(CFG.read_text(encoding="utf-8"))
    pix, plans = cfg["pix"], cfg["plans"]

    try:
        import qrcode
    except ImportError:
        raise SystemExit("Instale: pip install 'qrcode[pil]'")

    out = {}
    for pid, plan in plans.items():
        payload = brcode(pix["key"], float(plan["price"]), pix["holder"], pix["city"])
        out[pid] = {"payload": payload, "amount": float(plan["price"])}
        img = qrcode.make(payload)
        img.save(ASS / f"qr-{pid}.png")
        print(f"  {pid}: R$ {plan['price']:.2f}  →  qr-{pid}.png")

    (ASS / "pix.json").write_text(json.dumps(out, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("→ pix.json + QR gerados em site/assinatura/")


if __name__ == "__main__":
    main()
