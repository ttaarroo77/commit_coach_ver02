#!/bin/bash
# ./deploy.sh

# Integrated deploy script combining deploy_safe.sh and deploy_unsafe.sh

# スクリプト名
SCRIPT_NAME="統合デプロイスクリプト"

# エラー処理用の関数
handle_error() {
  echo "❌ エラーが発生しました: $1"
  exit 1
}

# インターネット接続確認
echo "インターネット接続を確認しています..."
if ! curl --silent --head --fail https://github.com &>/dev/null; then
  handle_error "GitHubに接続できません。インターネット接続を確認してください。"
fi

# 現在のブランチを取得
CURRENT_BRANCH=$(git branch --show-current)
echo "現在のブランチ: $CURRENT_BRANCH"

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
git commit -m "$COMMIT_MESSAGE" || handle_error "コミットに失敗しました。"

# コミットログの表示
echo "直近のコミットログを表示します..."
git log -1

# リモートリポジトリにプッシュ
echo "リモートリポジトリにプッシュしています..."
if ! git push origin $CURRENT_BRANCH; then
  echo "⚠️ GitHubへのプッシュに失敗しました。以下の点を確認してください："
  echo "1. GitHubの認証情報が正しいか"
  echo "2. リモートリポジトリのURLが正しいか"
  echo "3. インターネット接続が安定しているか"
  echo "4. リモートリポジトリへのアクセス権限があるか"
  exit 1
fi

# デプロイ先の選択
echo "デプロイ先を選択してください:"
echo "1) unsafe-analysis (o3分析)"
echo "2) Heroku"
echo "3) 他の環境"
echo "0) デプロイしない"
read DEPLOY_TARGET

if [ "$DEPLOY_TARGET" = "1" ]; then
  # o3の分析用URLの生成
  REPO_URL=$(git config --get remote.origin.url)
  REPO_NAME=$(basename -s .git "$REPO_URL")
  ANALYSIS_URL="https://o3.analyze.com/analyze?repo=$REPO_NAME&branch=$CURRENT_BRANCH"

  echo "📊 分析用URL: $ANALYSIS_URL"
  echo "🔍 o3で分析を開始するには、上記のURLにアクセスしてください。"

elif [ "$DEPLOY_TARGET" = "2" ]; then
  echo "Herokuへのデプロイは現在無効化されています。"
  # echo "Heroku にデプロイしています..."

  # # Herokuリモートの確認
  # HEROKU_REMOTE=$(git remote -v | grep heroku | head -n 1 | awk '{print $1}')

  # # Herokuリモートが存在しない場合
  # if [ -z "$HEROKU_REMOTE" ]; then
  #   echo "Herokuリモートが設定されていません。アプリ名を入力してください："
  #   read HEROKU_APP_NAME
  #   heroku git:remote -a $HEROKU_APP_NAME
  # fi

  # if [ "$CURRENT_BRANCH" = "main" ]; then
  #   git push heroku main
  # else
  #   echo "現在のブランチ($CURRENT_BRANCH)をHerokuのmainブランチにプッシュします。"
  #   echo "続行しますか？ (y/n)"
  #   read CONFIRM
  #   if [ "$CONFIRM" = "y" ]; then
  #     git push heroku $CURRENT_BRANCH:main -f
  #   else
  #     echo "Herokuへのデプロイをキャンセルしました。"
  #   fi
  # fi

  # # Herokuアプリを再起動
  # echo "Herokuアプリを再起動しています..."
  # heroku restart

  # # マイグレーションの実行確認
  # echo "データベースマイグレーションを実行しますか？ (y/n)"
  # read RUN_MIGRATION
  # if [ "$RUN_MIGRATION" = "y" ]; then
  #   heroku run rails db:migrate
  # fi

elif [ "$DEPLOY_TARGET" = "3" ]; then
  echo "他の環境へのデプロイ方法を入力してください："
  read OTHER_DEPLOY_COMMAND
  eval $OTHER_DEPLOY_COMMAND
else
  echo "デプロイをスキップします。"
fi

# 完了メッセージ
echo "✅ $SCRIPT_NAME が正常に完了しました！"
