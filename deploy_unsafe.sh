#!/bin/bash

# スクリプト名
SCRIPT_NAME="Deploy Unsafe Analysis"

# 現在のブランチを取得
CURRENT_BRANCH=$(git branch --show-current)

# ブランチ名の確認
if [[ ! "$CURRENT_BRANCH" =~ ^feat/unsafe-analysis ]]; then
  echo "⚠️ 警告: 現在のブランチ($CURRENT_BRANCH)はunsafe-analysisブランチではありません。"
  echo "続行しますか？ (y/n)"
  read CONFIRM
  if [ "$CONFIRM" != "y" ]; then
    echo "スクリプトを終了します。"
    exit 1
  fi
fi

# コミットメッセージの入力
echo "コミットメッセージを入力してください:"
read COMMIT_MESSAGE

# Git ステータスの確認
echo "Git ステータスを確認しています..."
git status

# 変更をステージング
echo "変更をステージングしています..."
git add .

# コミット
echo "コミットを実行しています..."
git commit -m "$COMMIT_MESSAGE"

# コミットログの表示
echo "直近のコミットログを表示します..."
git log -1

# リモートリポジトリにプッシュ
echo "リモートリポジトリにプッシュしています..."
git push origin $CURRENT_BRANCH

# o3の分析用URLの生成
REPO_URL=$(git config --get remote.origin.url)
REPO_NAME=$(basename -s .git "$REPO_URL")
ANALYSIS_URL="https://o3.analyze.com/analyze?repo=$REPO_NAME&branch=$CURRENT_BRANCH"

echo "✅ $SCRIPT_NAME が正常に完了しました！"
echo "📊 分析用URL: $ANALYSIS_URL"
echo "🔍 o3で分析を開始するには、上記のURLにアクセスしてください。" 