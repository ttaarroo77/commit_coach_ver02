---

id: backend_fix_plan_2025Q2  
title: バックエンド型／テスト整合性 改修計画  
owner: backend_team (wind​surf)  
stakeholders: [frontend_team, ai_assistant (cursor), PM, QA]  
tasks_note: 完了したタスクには **[x]** を付け、随時スクラッチパッドへ進捗・知見を追記すること  

---  

# 📋 プロジェクト概要  

## 🎯 目的
- `tsc --noEmit` と `npm run dev` が通らない原因を段階的に解消し、 **型安全 + テスト緑** を実現する
- ドメインモデル（`models/`）と DTO（`types/`）を一本化し **`position` / enum 値の齟齬** を排除
- CI で **type-check + test** が成功するラインまで担保  
- 影響範囲を最小化しつつ **「動く状態」→「リファクタ」→「テスト追加」** の順で進める

## 🔍 現状まとめ
- **型エラー 57 件**：  
  - `TaskStatus / TaskPriority` の enum 値不一致 (`todo` vs `TODO`)  
  - `order` フィールド残存（tests & RPC）  
  - 旧 `auth.routes` import など残骸  
  - `prompt` 変数未定義（`ai.service.ts`）  
  - E2E テストで NestJSコードを参照しているが Nest プロジェクトは無い …etc.  
- **テスト失敗**： モック型の古いプロパティ多数  
- **lint**： OpenAI SDK 型不一致（content 型）  

---

# 🎯 現在のタスク

| 優先 | カテゴリ | タスク | 担当 | 期限 | 進捗 |
|------|----------|--------|------|------|------|
| P0 | 型整合 | ドメイン enum 値を **`UpperCase → lower_snake`** へ統一（`TaskStatus`, `TaskPriority`）| wind​surf | D+1 | [ ] |
| P0 | 型整合 | DTO (`types/task.types.ts`) と tests の `order` → `position` 置換 | wind​surf | D+1 | [ ] |
| P0 | ルーティング | `auth.routes` 依存を全削除 (`src/app.ts`, tests) | wind​surf | D+0.5 | [ ] |
| P1 | AIService | `prompt` 未定義バグ修正 & OpenAI SDK content 型修正 | cursor | D+2 | [ ] |
| P1 | テスト | 古い Mock / Fixture を新 enum & `position` に更新 | cursor | D+2 | [ ] |
| P1 | テスト | `uuid` devDependency 追加 & import 修正 | cursor | D+2 | [ ] |
| P2 | DB / RPC | `update_task_order` ストアド名変更 or ラッパー作成 (`position` へ) | wind​surf | D+3 | [ ] |
| P2 | CI | GitHub Actions の type-check / jest ジョブ修正・復活 | wind​surf | D+4 | [ ] |
| P3 | リファクタ | E2E テスト（NestJS依存）削除・置換 or v2計画へ移管 | PM | - | [ ] |

※ D+N = 今日を D0 とした営業日での目安  

---

## ✅ 完了定義 (Definition of Done)

1. `pnpm --filter apps/backend typecheck` エラー 0  
2. `pnpm --filter apps/backend test` PASS 0 → 0  
3. `npm run dev` 起動 & `/api/health` 200 OK  
4. CI で **type-check + test + lint** 緑  
5. ドキュメント更新（`o3_backend_error_report.md` に追記）  

---

## 🗂️ 重要ファイル & コミットガード

- `models/task.model.ts` … ドメイン基準 enum / position
- `types/task.types.ts` … DTO は上記を import して再利用（重複禁止）
- `services/task.service.ts` … DB カラム `position`
- `services/ai.service.ts` … OpenAI 呼び出し修正 (`prompt` → `userPrompt` など)
- **Git Hooks**: `husky pre-commit` で `pnpm lint && pnpm typecheck` を必須化

---

# 📝 メモ

### 型統一方針
| 項目 | 正式キー | 旧キー | メモ |
|------|----------|--------|------|
| Task 順序 | `position` | `order` | DB & API 一貫 |
| Status 値 | `todo`, `in_progress`, `done` | `TODO`, `IN_PROGRESS`, `DONE` | lower_snake + enum |
| Priority | `low`, `medium`, `high`, `urgent` | `LOW`, `MEDIUM`, `HIGH` | 同上 |

### テスト更新コツ
- `fixtures/*.json` 一括変換: `order → position`
- `jest.fn()` モックの戻り値も同様
- 型ガードに `as unknown as Task` で暫定逃がし → 後で削除

### OpenAI SDK 型エラー
- v4 SDK は `messages: ChatCompletionMessageParam[]`
- content は `string` or `ChatCompletionContentPart[]`
- `prompt` はローカル変数に rename する

---

## 🚀 次アクション
1. **P0 タスク**を wind​surf が実装 → PR (unsafeブランチ)  
2. cursor が **P1 テスト修正** をペアレビュー付きで実装  
3. CI 緑化→ PM 承認 → main マージ  

---

> 以上が修正ロードマップ案です。  
> タスク粒度・優先度・担当者は適宜調整してください。
