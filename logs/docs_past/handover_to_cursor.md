---
id: handover_to_cursor
title: "Cursor への引き継ぎ資料 - フロントエンドテスト実装"
description: "認証機能とUIコンポーネントのテスト実装タスクの引き継ぎ"
version: "1.0"
last_updated: "2025-05-04"
owner: "nakazawatarou"
stakeholders: ["dev_team", "ai_assistant"]
---

# Cursor への引き継ぎ資料

## 0.最重要チェックリスト

作業完了するたびに、以下のリストにチェックをつけるべきか確認すること
 - skratchpad.md
 - /docs/overview/development_flow.md
 - /docs/handover_to_cursor.md

---------------------------------------------

## 1. 概要

Windsurf（フロントエンド担当）からCursor（テスト担当）への引き継ぎ資料です。バックエンド開発が完了したため、フロントエンドのテスト実装を担当していただきます。

## 2. 担当タスク

### 2.1 認証機能のテスト実装（優先度：高）

- [x] **Step 30**: RTL ユニットテスト(Auth)
  - [x] ログインフォームのテスト
  - [x] 登録フォームのテスト
  - [x] パスワードリセットフォームのテスト
  - [x] 認証ガード（middleware）のテスト
  - [x] useAuthフックのテスト

### 2.2 UIコンポーネントのテスト（優先度：中）

- [x] LoadingSpinnerコンポーネントのテスト
- [x] ErrorMessageコンポーネントのテスト
- [x] 各種フォームコンポーネントのバリデーションテスト
- [ ] ボタン、カードなどの基本UIコンポーネントのテスト

### 2.3 ダッシュボード関連のコンポーネント実装（優先度：中）

- [x] 時計コンポーネント
- [x] ミニカレンダーコンポーネント
- [x] タスク概要カードコンポーネント
- [x] AIチャットプレースホルダコンポーネント

### 2.4 プロジェクト詳細ページの修正（優先度：低）

- [x] タイムラインコンポーネントの修正
- [x] プロジェクト詳細表示の改善
- [x] 関連タスクリストの表示

## 3. テスト環境

### 3.1 テストツール

- **テストフレームワーク**: Jest
- **テストライブラリ**: React Testing Library (RTL)
- **モック**: jest.mock、MSW（Mock Service Worker）
- **カバレッジ**: jest --coverage

### 3.2 テストファイルの配置

```
apps/frontend/
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── __tests__/
│   │   │   │   ├── login-form.test.tsx
│   │   │   │   ├── register-form.test.tsx
│   │   │   │   └── password-reset-form.test.tsx
│   │   ├── ui/
│   │   │   ├── __tests__/
│   │   │   │   ├── loading-spinner.test.tsx
│   │   │   │   └── error-message.test.tsx
│   ├── contexts/
│   │   ├── __tests__/
│   │   │   └── auth-context.test.tsx
│   ├── hooks/
│   │   ├── __tests__/
│   │   │   └── useAuth.test.tsx
│   ├── middleware.ts
│   ├── __tests__/
│   │   └── middleware.test.ts
```

### 3.3 テスト実行コマンド

```bash
# すべてのテストを実行
pnpm test

# 特定のテストファイルを実行
pnpm test -- login-form.test.tsx

# カバレッジレポートを生成
pnpm test -- --coverage
```

## 4. テスト実装のポイント

### 4.1 認証機能のテスト

- **Supabaseのモック**: `@supabase/auth-helpers-nextjs`と`@supabase/supabase-js`をモック
- **フォームのテスト**: ユーザー入力をシミュレートし、バリデーションとエラーメッセージをテスト
- **非同期処理**: `act()`でラップし、非同期処理の完了を待機
- **認証状態**: ログイン成功/失敗、ログアウト、トークン更新などの状態変化をテスト

### 4.2 UIコンポーネントのテスト

- **レンダリング**: コンポーネントが正しくレンダリングされることを確認
- **プロップス**: 異なるプロップスでのレンダリングをテスト
- **イベント**: クリック、フォーカス、ホバーなどのイベントをテスト
- **アクセシビリティ**: ARIA属性やキーボードナビゲーションをテスト

## 5. 実装済みの機能

### 5.1 認証フロー

- ログイン機能（JWT Cookie保存）
- ログアウト処理
- 認証ガード（Next.js middleware）
- 登録・パスワードリセットページ
- React Hook Form + Zodバリデーション
- ローディング状態とエラーメッセージの表示

### 5.2 UIコンポーネント

- LoadingSpinnerコンポーネント
- ErrorMessageコンポーネント
- 各種フォームコンポーネント
- ボタン、カードなどの基本UIコンポーネント

## 6. 参考リソース

- [React Testing Library ドキュメント](https://testing-library.com/docs/react-testing-library/intro/)
- [Jest ドキュメント](https://jestjs.io/docs/getting-started)
- [Supabase Auth テストのベストプラクティス](https://supabase.com/docs/guides/auth/auth-helpers/nextjs#testing)
- [React Hook Form テスト](https://react-hook-form.com/advanced-usage#TestingForm)

## 7. コミュニケーション

- 質問や不明点があれば、`skratchpad.md`に記録してください
- テスト実装の進捗は`development_flow.md`に記録してください
- 重要な発見や学びは`skratchpad.md`の「学んだこと」セクションに追加してください

## 8. 次のステップ

1. テスト環境のセットアップを確認
2. 認証機能のテストから着手
3. UIコンポーネントのテストを実装
4. ダッシュボード関連のコンポーネントを実装
5. プロジェクト詳細ページの修正

---

この引き継ぎ資料が、Cursorのタスク遂行の助けになることを願っています。何か質問があれば、いつでも相談してください。

Windsurf（フロントエンド担当）より
