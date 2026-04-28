#!/usr/bin/env bash
# Run both npm and Go updates

set -euo pipefail
IFS=$'\n\t'

SCRIPT_DIR="$(cd -- "$(dirname -- "$0")" && pwd)"

bash "$SCRIPT_DIR/update-npm.sh"
bash "$SCRIPT_DIR/update-go.sh"

echo "All dependencies updated."
