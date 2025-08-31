#!/usr/bin/env bash
set -euo pipefail
PORT="${PORT:-3000}"
BASE="http://localhost:${PORT}"

pp(){ command -v jq >/dev/null 2>&1 && jq . || { command -v python3 >/dev/null 2>&1 && python3 -m json.tool || cat; }; }
green(){ printf "\033[32m%s\033[0m\n" "$*"; }
blue(){  printf "\033[36m%s\033[0m\n" "$*"; }
REQ(){ curl -sS -f "$@"; }

echo "== node-upload-server smoke test =="
blue "[1] /health"; REQ "${BASE}/health" | pp
blue "[2] /api/files (optional)"; REQ "${BASE}/api/files" >/dev/null || true

TMP="$(mktemp /tmp/node-upload-server.XXXXXX.txt)"
echo "hello $(date -u +%FT%TZ)" > "$TMP"
NAME="$(basename "$TMP")"

blue "[3] upload"; REQ -F "file=@${TMP}" "${BASE}/api/upload" | pp
blue "[4] list"; REQ "${BASE}/api/files" | pp
blue "[5] download"; OUT="/tmp/dl.${NAME}"; REQ -L -o "$OUT" "${BASE}/api/files/${NAME}"; ls -l "$OUT"

if command -v sha256sum >/dev/null 2>&1; then
  A="$(sha256sum "$TMP" | awk '{print $1}')"; B="$(sha256sum "$OUT" | awk '{print $1}')"
else
  A="$(shasum -a 256 "$TMP" | awk '{print $1}')"; B="$(shasum -a 256 "$OUT" | awk '{print $1}')"
fi
[[ "$A" == "$B" ]] && green "OK checksum" || { echo "checksum mismatch"; exit 1; }
green "All good."