#!/usr/bin/env bash
# Local launcher: starts the FastAPI backend and serves the static frontend.
# Production frontend deploys are handled by .github/workflows/deploy.yml (GitHub Pages).
#
# Usage:
#   ./deploy.sh              # start both
#   ./deploy.sh --backend    # backend only
#   ./deploy.sh --frontend   # frontend only
#   BACKEND_PORT=9000 FRONTEND_PORT=5500 ./deploy.sh
#
# Ctrl-C stops both processes.

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$ROOT/backend"
FRONTEND_DIR="$ROOT/frontend"
BACKEND_PORT="${BACKEND_PORT:-8000}"
FRONTEND_PORT="${FRONTEND_PORT:-5173}"

START_BACKEND=1
START_FRONTEND=1
case "${1:-}" in
  --backend)  START_FRONTEND=0 ;;
  --frontend) START_BACKEND=0 ;;
  -h|--help)
    sed -n '2,12p' "$0"; exit 0 ;;
  "") ;;
  *) echo "Unknown arg: $1" >&2; exit 2 ;;
esac

PIDS=()
cleanup() {
  echo
  echo "[deploy] stopping..."
  for pid in "${PIDS[@]:-}"; do
    [[ -n "$pid" ]] && kill "$pid" 2>/dev/null || true
  done
  wait 2>/dev/null || true
}
trap cleanup INT TERM EXIT

start_backend() {
  cd "$BACKEND_DIR"
  if [[ ! -d .venv ]]; then
    echo "[backend] creating venv..."
    python3 -m venv .venv
  fi
  # shellcheck disable=SC1091
  source .venv/bin/activate
  echo "[backend] installing requirements..."
  pip install -q -r requirements.txt
  echo "[backend] starting uvicorn on :$BACKEND_PORT (logs: backend/.log)"
  ( .venv/bin/uvicorn app.main:app --host 0.0.0.0 --port "$BACKEND_PORT" --reload > "$BACKEND_DIR/.log" 2>&1 ) &
  PIDS+=("$!")
  cd - >/dev/null
}

start_frontend() {
  if ! command -v python3 >/dev/null; then
    echo "[frontend] python3 not found" >&2; exit 1
  fi
  echo "[frontend] serving $FRONTEND_DIR on :$FRONTEND_PORT (logs: frontend/.log)"
  ( cd "$FRONTEND_DIR" && python3 -m http.server "$FRONTEND_PORT" > "$FRONTEND_DIR/.log" 2>&1 ) &
  PIDS+=("$!")
}

(( START_BACKEND ))  && start_backend
(( START_FRONTEND )) && start_frontend

sleep 1
echo
(( START_BACKEND ))  && echo "  backend   http://localhost:$BACKEND_PORT  (docs: /docs)"
(( START_FRONTEND )) && echo "  frontend  http://localhost:$FRONTEND_PORT"
echo
echo "Ctrl-C to stop."
wait
