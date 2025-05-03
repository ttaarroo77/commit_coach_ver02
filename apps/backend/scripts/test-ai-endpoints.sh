#!/bin/bash

# AI APIエンドポイントテストスクリプト
# このスクリプトはCommit CoachバックエンドのすべてのAIエンドポイントをテストします
# 使用方法: ./test-ai-endpoints.sh [JWT_TOKEN]

# 色の定義
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# サーバーURL
SERVER_URL="http://localhost:3002/api/ai"

# JWTトークン（引数から取得またはデフォルト値を使用）
JWT_TOKEN=${1:-"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InRlc3QtdXNlci1pZCIsImVtYWlsIjoidGVzdEBleGFtcGxlLmNvbSIsImlhdCI6MTYyMDAwMDAwMCwiZXhwIjoxNjIwMDAwMDAwfQ.8HKCFhkUMDpCVGJ9RdTvjX9JYR9jFGZ9QKkIXWSXxPI"}

# ヘッダー設定
AUTH_HEADER="Authorization: Bearer ${JWT_TOKEN}"
CONTENT_HEADER="Content-Type: application/json"

# 結果カウンター
SUCCESS_COUNT=0
TOTAL_COUNT=0

# テスト関数
run_test() {
  local method=$1
  local endpoint=$2
  local payload=$3
  local description=$4
  
  TOTAL_COUNT=$((TOTAL_COUNT+1))
  
  echo -e "${BLUE}テスト ${TOTAL_COUNT}: ${description}${NC}"
  echo -e "${YELLOW}${method} ${SERVER_URL}${endpoint}${NC}"
  
  if [ -n "$payload" ]; then
    echo -e "${YELLOW}ペイロード: ${payload}${NC}"
    RESPONSE=$(curl -s -X ${method} \
      -H "${AUTH_HEADER}" \
      -H "${CONTENT_HEADER}" \
      -d "${payload}" \
      ${SERVER_URL}${endpoint})
  else
    RESPONSE=$(curl -s -X ${method} \
      -H "${AUTH_HEADER}" \
      ${SERVER_URL}${endpoint})
  fi
  
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X ${method} \
    -H "${AUTH_HEADER}" \
    -H "${CONTENT_HEADER}" \
    ${SERVER_URL}${endpoint} ${payload:+-d "$payload"})
  
  if [ "$HTTP_CODE" -ge 200 ] && [ "$HTTP_CODE" -lt 300 ]; then
    echo -e "${GREEN}成功 (${HTTP_CODE})${NC}"
    SUCCESS_COUNT=$((SUCCESS_COUNT+1))
  else
    echo -e "${RED}失敗 (${HTTP_CODE})${NC}"
  fi
  
  echo "レスポンス: ${RESPONSE}"
  echo "-----------------------------------"
}

echo "====================================="
echo "Commit Coach AI APIエンドポイントテスト"
echo "====================================="

# 1. AI設定を取得
run_test "GET" "/config" "" "AI設定の取得"

# 2. AI設定を更新
run_test "PUT" "/config" '{"model":"gpt-4","temperature":0.7,"maxTokens":1000}' "AI設定の更新"

# 3. AIメッセージ履歴を取得
run_test "GET" "/messages?limit=5" "" "AIメッセージ履歴の取得"

# 4. タスク分解
run_test "POST" "/breakdown" '{"taskId":"00000000-0000-0000-0000-000000000001"}' "タスク分解"

# 5. タスク分析
run_test "POST" "/analyze" '{"taskId":"00000000-0000-0000-0000-000000000001"}' "タスク分析"

# 6. プロジェクト分析
run_test "POST" "/analyze-project" '{"projectId":"00000000-0000-0000-0000-000000000001"}' "プロジェクト分析"

# 結果サマリー
echo "====================================="
echo "テスト結果サマリー"
echo "成功: ${SUCCESS_COUNT}/${TOTAL_COUNT}"
echo "失敗: $((TOTAL_COUNT-SUCCESS_COUNT))/${TOTAL_COUNT}"
echo "====================================="

if [ $SUCCESS_COUNT -eq $TOTAL_COUNT ]; then
  echo -e "${GREEN}すべてのテストが成功しました！${NC}"
  exit 0
else
  echo -e "${RED}一部のテストが失敗しました。${NC}"
  exit 1
fi
