#!/usr/bin/env bash
set -euo pipefail

# 1) Đưa mọi <Tabs>/<TabItem> và thẻ đóng về cột 1 (bỏ thụt lề)
find docs -type f -name '*.mdx' -print0 | while IFS= read -r -d '' f; do
  perl -0777 -i -pe 's/^\h+(<(?:Tabs|TabItem)\b)/$1/mg' "$f"
  perl -0777 -i -pe 's/^\h+(<\/(?:Tabs|TabItem)>)/$1/mg' "$f"

  # 2) Đảm bảo có 1 dòng trống *trước* khi mở <Tabs> hoặc <TabItem> (để thoát khỏi list/blockquote)
  perl -0777 -i -pe 's/([^\n])\n<(Tabs|TabItem)\b/$1\n\n<$2/mg' "$f"

  # 3) Đảm bảo có 1 dòng trống *sau* </Tabs> (tránh dính vào list phía sau)
  perl -0777 -i -pe 's#</Tabs>\n(?!\n)#</Tabs>\n\n#mg' "$f"
done

echo "Done: de-indent + blank lines around <Tabs> blocks."
