#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SKILL_FILE="$ROOT_DIR/SKILL.md"
EXIT_CODE=0

echo "[self-audit] target: $ROOT_DIR"

LINE_COUNT="$(wc -l < "$SKILL_FILE" | tr -d ' ')"
echo "[check] SKILL.md lines: $LINE_COUNT"
if [ "$LINE_COUNT" -le 120 ]; then
  echo "  PASS: line count <= 120"
else
  echo "  FAIL: line count exceeds 120"
  EXIT_CODE=1
fi

echo "[check] referenced paths"
while IFS= read -r rel; do
  if [ -f "$ROOT_DIR/$rel" ]; then
    echo "  PASS: $rel"
  else
    echo "  FAIL: missing $rel"
    EXIT_CODE=1
  fi
done < <(
  rg -o 'references/[a-z0-9-]+\.(md|json)|examples/[a-z0-9-]+\.md|scripts/[a-z0-9-]+\.sh|logs/[a-z0-9-]+\.md' "$SKILL_FILE" | sort -u
)

echo "[check] required directories"
for d in references examples scripts logs; do
  if [ -d "$ROOT_DIR/$d" ]; then
    echo "  PASS: $d/"
  else
    echo "  FAIL: missing $d/"
    EXIT_CODE=1
  fi
done

if [ "$EXIT_CODE" -eq 0 ]; then
  echo "[result] PASS"
else
  echo "[result] FAIL"
fi

exit "$EXIT_CODE"
