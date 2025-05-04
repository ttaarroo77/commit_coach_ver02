# ./open_docs.sh "code -r"


#!/usr/bin/env bash
# --- Back-End ドキュメント一括ビューア ---
# 主要 Markdown を一撃で開く。
# デフォルトは bat+less。VSCode を使いたい場合は viewer を変更するか
# ./open_docs.sh code と渡す。

files=(
  docs/overview/development_flow.md
  docs/overview/architecture.spec.md
  docs/overview/roles_and_roadmap.md
  o3_backend_error_report.md
  skratchpad.md
)

# デフォルトビューワ
viewer="bat --paging=always --pager='less -R'"

# 引数がある場合、ビューワを上書き
if [[ -n "$1" ]]; then
  viewer="$1"
fi

# 実行
$viewer "${files[@]}" 