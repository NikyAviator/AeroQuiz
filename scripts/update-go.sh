#!/usr/bin/env bash
# Update Go module dependencies in backend/ (patch-level by default)

set -euo pipefail
IFS=$'\n\t'

ROOT="$(cd -- "$(dirname -- "$0")/.." && pwd)"
BACKEND="$ROOT/backend"

if [[ ! -f "$BACKEND/go.mod" ]]; then
  echo "No go.mod in $BACKEND — is your Go backend at repo/backend?"
  exit 1
fi

echo "Updating Go deps (patch) in: $BACKEND"
(
  cd "$BACKEND"
  # Patch-level upgrades for all modules used by this module
  go get -u=patch ./...
  # Clean up go.mod/go.sum and prune unused deps
  go mod tidy
  # (Optional) quick compile check
  go build ./...
)

echo "Go deps updated."