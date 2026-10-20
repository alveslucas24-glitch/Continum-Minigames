#!/usr/bin/env python3
"""Executa a cópia local do Continum em http://127.0.0.1:8000."""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import os
import webbrowser

ROOT = Path(__file__).resolve().parent
PORT = int(os.environ.get("PORT", "8000"))

class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

if __name__ == "__main__":
    url = f"http://127.0.0.1:{PORT}/"
    print(f"Continum local disponível em {url}\nPara encerrar, pressione Ctrl+C neste terminal.")
    try:
        webbrowser.open(url)
    except Exception:
        pass
    ThreadingHTTPServer(("127.0.0.1", PORT), Handler).serve_forever()
