#!/usr/bin/env bash
set -euo pipefail

# Yêu cầu: perl, ripgrep (rg). Nếu chưa có rg thì dùng brew install ripgrep

changed=0
while IFS= read -r -d '' f; do
  # Vá 1: Nếu dòng hiện tại là 1 bullet rồi dòng sau mở <Tabs|<TabItem> → bỏ nguyên dòng bullet
  perl -0777 -i -pe '
    s/^\s*(?:[-*+]|\d+\.)[^\n]*\n\s*(<(?:Tabs|TabItem)\b)/\n\n$1/mg;
  ' "$f"

  # Vá 2: Nếu bullet và <Tabs|TabItem> nằm cùng dòng (ví dụ "- <Tabs ...>") → bỏ bullet
  perl -0777 -i -pe '
    s/\n\s*(?:[-*+]|\d+\.)\s+(<(?:Tabs|TabItem)\b)/\n\n$1/g;
  ' "$f"

  # Vá 3: Nếu ai đó quote block trước <Tabs> ("> <Tabs ...>") → bỏ quote để Tabs không bị lồng
  perl -0777 -i -pe '
    s/\n\s*>\s+(<(?:Tabs|TabItem)\b)/\n\n$1/g;
  ' "$f"

  # Vá 4: Đảm bảo luôn có 1 dòng trống trước <Tabs> để ngắt khỏi context trước đó
  perl -0777 -i -pe '
    s/([^\n])\n(<Tabs\b)/$1\n\n$2/g;
  ' "$f"

  changed=$((changed+1))
done < <(find docs -type f -name '*.mdx' -print0)

echo "Patched $changed files (đã xử lý mọi .mdx trong ./docs)."
