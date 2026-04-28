#!/bin/bash
# Run `npm update` in root, backend, and frontend

# Run shellcheck on it in POSIX mode (-s sh): 
# Shellcheck -s sh bad_script.sh

# Unofficial Bash Strict Mode
set -euo pipefail
IFS=$'\n\t'


# Fix path
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

for dir in "$ROOT" "$ROOT/frontend"; do
    if [[ -f "$dir/package.json" ]]; then
        echo "Updating npm packages in $dir"
       ( cd "$dir" && npm update )
    else
        echo "No package.json found in $dir, skipping..."
    fi
done

echo "npm packages updated in all two directories."