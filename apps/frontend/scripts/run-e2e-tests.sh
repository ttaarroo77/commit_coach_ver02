#!/bin/bash

# 開発サーバーを起動
npm run dev &
DEV_SERVER_PID=$!

# サーバーの起動を待機
echo "開発サーバーの起動を待機中..."
sleep 10

# Cypressテストを実行
echo "E2Eテストを実行中..."
npx cypress run

# 終了コードを保存
EXIT_CODE=$?

# 開発サーバーを停止
kill $DEV_SERVER_PID

# テストの結果を返す
exit $EXIT_CODE