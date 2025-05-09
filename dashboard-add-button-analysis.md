# Dashboard Add Button Implementation Analysis

## github のURL
https://github.com/ttaarroo77/commit_coach_ver02/tree/feature/dashboard-add-button-fix

## Current Issues
1. ダッシュボードに追加ボタンが機能していない
2. ボタンのUIは表示されているが、クリックイベントが動作しない
3. 関連するAPIエンドポイントの実装が不完全


## Code to Check
### 0. 要件定義書の概要
以下のドキュメントを確認することで、現在の状況および以下の点が明確になります：
- ボタンの期待される動作
- 必要なデータ構造
- 実装すべきAPIエンドポイント
- 全体的なアーキテクチャの理解

1. `docs/overview/ui.spec.md`
2. `docs/overview/data.spec.md`
3. `docs/overview/api.spec.md`


### 1. フロントエンド実装
```bash
cat apps/frontend/src/components/dashboard/AddToDashboardButton.tsx
cat apps/frontend/src/app/projects/project-template.tsx
cat apps/frontend/src/app/dashboard/page.tsx
```

### 2. バックエンド実装
```bash
cat apps/frontend/src/app/api/dashboard/add/route.ts
cat apps/frontend/src/lib/dashboard-api.ts
```

### 3. 型定義
```bash
cat apps/frontend/src/types/dashboard.ts
cat apps/frontend/src/types/task.ts
```

## Potential Causes and Solutions

### 1. APIエンドポイントの未実装
- **症状**: ボタンクリック時にAPIエンドポイントが404エラーを返す
- **確認方法**: ブラウザの開発者ツールでNetworkタブを確認
- **解決策**: 
  - `/api/dashboard/add`エンドポイントの実装
  - 適切なリクエスト/レスポンスハンドリングの追加

### 2. イベントハンドラの未実装
- **症状**: ボタンクリック時に何も起こらない
- **確認方法**: `project-template.tsx`の`addTaskGroupToSchedule`関数の実装を確認
- **解決策**:
  - イベントハンドラの実装
  - 適切なエラーハンドリングの追加

### 3. 状態管理の問題
- **症状**: ボタンクリック後にUIが更新されない
- **確認方法**: `useDashboardTasks`フックの実装を確認
- **解決策**:
  - 状態更新ロジックの修正
  - 適切な再レンダリングのトリガー

### 4. 型の不一致
- **症状**: TypeScriptのコンパイルエラー
- **確認方法**: `dashboard.ts`と`task.ts`の型定義を確認
- **解決策**:
  - 型定義の修正
  - インターフェースの整合性確保

## Next Steps
1. APIエンドポイントの実装状況を確認
2. イベントハンドラの実装を確認
3. 状態管理の実装を確認
4. 型定義の整合性を確認
5. 必要に応じて各コンポーネントの修正を実施 





## ダッシュボードUI アスキーアート (1枚目)

+----------------------------------------------------------------------------------------------------------------------+
| 左ナビゲーション                               | 中央メインコンテンツ                                                     | 右サイドバー (AIコミットコーチ)             |
+------------------------------------------------+--------------------------------------------------------------------------+-------------------------------------------+
| [C] コミットコーチ                             | ダッシュボード                                現在時刻                   | AIコミットコーチ                          |
|                                                | 2023年9月18日 月曜日                                         02:28 | タスク管理や優先順位付けのアドバイスを提供します |
| > [□] ダッシュボード                         |                                                                          |                                           |
|   [P] プロジェクト一覧                       | ## 今日のタスク                                                          |   .--.                                    |
|   [M] マイページ                             |                                                                          |  /    \  何かお手伝いできることはありますか？ |
|   [S] 設定                                   |   [>] [x] 朝のミーティング                         [チーム定例] 09:00-10:00 |  |  AI  |  タスクの分解や優先順位付けの     |
|                                                |   [>] [ ] ログイン機能の実装                     [ウェブアプリ開発] 10:00-13:00 |  \    /  お手伝いができます。             |
|                                                |   [>] [x] ランチミーティング                       [チーム定例] 13:00-14:00 |   `--`   02:28                             |
|                                                |   [>] [ ] APIエンドポイントの実装                  [ウェブアプリ開発] 14:00-16:00 |                                           |
| (スペース)                                     |   [>] [ ] ダッシュボード画面のデザイン               [デザインプロジェクト] 16:00-18:00 |                                           |
|                                                |                                                                          |                                           |
|                                                | ## 未定のタスク                                                          |                                           |
|                                                |                                                                          |                                           |
| [N] ログアウト                               |   [>] [ ] レスポンシブデザインの実装               [ウェブアプリ開発]          |                                           |
|                                                |   [>] [ ] ユーザー設定画面の作成                 [ウェブアプリ開発]          |                                           |
|                                                |   [>] [ ] テスト計画書の作成                     [QA]                      |                                           |
|                                                |                                                                          |                                           |
|                                                |                                                                          | [ メッセージを入力...                ] [送信] |
+------------------------------------------------+--------------------------------------------------------------------------+-------------------------------------------+

---

## ダッシュボードUI アスキーアート (2枚目 - プロジェクト一覧 > ウェブアプリ開発)

+----------------------------------------------------------------------------------------------------------------------+
| 左ナビゲーション                               | 中央メインコンテンツ                                                     | 右サイドバー (AIコミットコーチ)             |
+------------------------------------------------+--------------------------------------------------------------------------+-------------------------------------------+
| [C] コミットコーチ                             | # ウェブアプリ開発                                                         | AIコミットコーチ                          |
|                                                |                                                                          | タスク管理や優先順位付けのアドバイスを提供します |
|   [□] ダッシュボード                         |                                                                          |                                           |
| > [P] プロジェクト一覧                       |                                                                          |   .--.                                    |
|   [M] マイページ                             |   [v] ## 案件定義・設計                     [<] [>] [o] [...] [🗑️] [-/-/-] [🗓️] |  /    \  何かお手伝いできることはありますか？ |
|   [S] 設定                                   |       [v] ### プロジェクト準備              [<] [>] [o] [...] [🗑️] [-/-/-] [🗓️] |  |  AI  |  タスクの分解や優先順位付けの     |
|                                                |           [x] プロジェクトの目的と範囲の定義                                 |  \    /  お手伝いができます。             |
|                                                |           [x] 主要なステークホルダーの特定                                   |   `--`   02:28                             |
| (スペース)                                     |           [ ] プロジェクト計画書の作成                                     |                                           |
|                                                |                                                                          |                                           |
|                                                |       [v] ### 要件収集・分析                [<] [>] [o] [...] [🗑️] [-/-/-] [🗓️] |                                           |
| [N] ログアウト                               |           [x] ユーザーインタビューの実施                                   |                                           |
|                                                |           [x] 競合分析                                                     |                                           |
|                                                |           [ ] 機能要件の整理                                               |                                           |
|                                                |           [ ] 非機能要件の整理                                             |                                           |
|                                                |                                                                          |                                           |
|                                                |   [>] ## フロントエンド開発                 [<] [>] [o] [...] [🗑️] [-/-/-] [🗓️] |                                           |
|                                                |                                                                          |                                           |
|                                                |   [>] ## バックエンド連携・API実装          [<] [>] [o] [...] [🗑️] [-/-/-] [🗓️] |                                           |
|                                                |                                                                          |                                           |
|                                                |                                         [ + 新しいタスクグループを追加 ] |                                           |
|                                                |                                                                          | [ メッセージを入力...                ] [送信] |
+------------------------------------------------+--------------------------------------------------------------------------+-------------------------------------------+



# 以下、ChatGPT o3 のアンサー

## ダッシュボード「追加」ボタン – 調査＆修正プレイブック

> **目的** – “Add to Dashboard” ボタンの不具合を調査・修正する際の単一情報源。
>
> **読者** – この問題に初めて着手する開発者、または Cursor AI エージェント。
>
> **最終更新日**: 2025‑05‑09

---

## 1 プロジェクトと機能の位置付け

| レイヤ         | 技術スタック                                                 | この機能での役割                                               |
| ----------- | ------------------------------------------------------ | ------------------------------------------------------ |
| **フロントエンド** | Next.js 15 (App Router) + React 18 + Tailwind CSS      | *AddToDashboardButton* を描画し `/api/dashboard/add` を呼び出す |
| **バックエンド**  | Express + TypeScript (将来 NestJS へ移行予定)                 | `/api/dashboard/add` 経由でタスクグループを永続化                    |
| **データ**     | Supabase (PostgreSQL)  → Prisma ORM<br>*MongoDB はレガシー* | `dashboard_tasks` と `projects` を保存                     |
| **テスト**     | Vitest (フロント)・Jest + Supertest (バックエンド)                | リグレッションを防止                                             |

アプリは **AI 支援 Todo／プロジェクト分解ツール**。ユーザは **/dashboard** で今日のタスクを確認し、浮動 “＋” ボタンで任意のタスクグループを「今日の予定」に取り込む。

---

## 2 期待結果と現状の差異

|            | **期待される挙動**                                   | **現状**                           |
| ---------- | --------------------------------------------- | -------------------------------- |
| **UI**     | ボタンクリックでプロジェクトモーダルが閉じ、新しいタスクグループが「今日のタスク」に表示  | UI が静的で反応しない                     |
| **ネットワーク** | `POST /api/dashboard/add` → *201 Created* を返却 | ネットワーク呼び出しなし、または *404 Not Found* |
| **状態**     | `useDashboardTasks` がアイテムを追加し再レンダリング          | React ステートが変化しない                 |

---

## 3 再現手順 (ローカル)

1. `pnpm i && turbo dev` で *frontend* ([http://localhost:3000](http://localhost:3000)) と *backend* ([http://localhost:4000](http://localhost:4000)) を起動
2. シードユーザでログイン (`demo@commit.coach / password`)
3. **Projects ▸ 任意プロジェクト** → タスクグループにカーソル → `[＋ ダッシュボードに追加]` をクリック
4. DevTools ▸ Network を開きリクエスト有無を確認

---

## 4 関連ファイルとホットスポット

### 4‑1 フロントエンド

| パス                                                                | 役割                               |
| ----------------------------------------------------------------- | -------------------------------- |
| `apps/frontend/src/components/dashboard/AddToDashboardButton.tsx` | ボタン描画と `onClick`                 |
| `apps/frontend/src/app/projects/[id]/project-template.tsx`        | `addTaskGroupToSchedule` ハンドラを提供 |
| `apps/frontend/src/app/dashboard/page.tsx`                        | 日次スケジュール画面                       |
| `apps/frontend/src/lib/dashboard-api.ts`                          | バックエンド REST クライアント               |
| `apps/frontend/src/app/api/dashboard/add/route.ts`                | Next.js *edge* プロキシ              |
| `apps/frontend/src/hooks/useDashboardTasks.ts`                    | ダッシュボード用状態フック                    |

### 4‑2 バックエンド

| パス                                                     | 役割                            |
| ------------------------------------------------------ | ----------------------------- |
| `apps/backend/src/routes/dashboard.ts` *(未実装?)*        | `POST /api/dashboard/add` ルート |
| `apps/backend/src/controllers/dashboard.controller.ts` | Prisma 経由でレコード作成              |
| `apps/backend/src/validators/dashboard.validator.ts`   | ペイロードバリデーション                  |
| `apps/backend/prisma/schema.prisma`                    | `model DashboardTask` 定義      |

---

## 5 原因仮説 & チェックリスト

> チェックが終わったら ✓ をつける

| # | 仮説                     | チェック方法                                                            | 修正案                           |
| - | ---------------------- | ----------------------------------------------------------------- | ----------------------------- |
| 1 | **バックエンドにルートがない**      | `pnpm --filter @commit-coach/backend dev` 実行→ “Cannot POST …” を確認 | ルート・コントローラ追加                  |
| 2 | **Next.js プロキシが誤っている** | `NEXT_PUBLIC_BACKEND_URL` を確認・`route.ts` を読む                      | URL 修正／先頭スラッシュ削除              |
| 3 | **イベントハンドラ未バインド**      | `addTaskGroupToSchedule` 内で `console.log`                         | `project-template.tsx` で正しく渡す |
| 4 | **状態キャッシュ未更新**         | `useDashboardTasks` の SWR キーを確認                                   | 成功後 `mutate` で再検証             |
| 5 | **型の不一致でランタイム例外**      | `DashboardTask` と API レスポンス比較                                     | 型統一・Zod スキーマ追加                |

---

## 6 最小修正パッチ手順

1. **バックエンド** – `POST /api/dashboard/add` 追加

   ```ts
   // apps/backend/src/routes/dashboard.ts
   router.post('/add', validate(createDashboardTaskSchema), dashboardCtrl.create);
   ```
2. **Prisma** – モデル追加後 `pnpm db:migrate`
3. **Next.js ルートハンドラ** – `<BACKEND_URL>/api/dashboard/add` に転送し JSON を返す
4. **フロントハンドラ** – `addTaskGroupToSchedule` にて

   ```ts
   const created = await dashboardApi.add(taskGroupId, scheduledAt);
   mutateDashboardTasks(old => [...old, created]);
   ```
5. **UX** – 成功・失敗で `sonner` トースト表示
6. **テスト**

   * **Vitest** – `fetch` をモックし状態変化を検証
   * **Supertest** – 正常系とバリデーションエラーを追加
7. **ドキュメント** – `api.spec.md` に例を追記

---

## 7 受け入れ基準

* [ ] “＋” クリックで *201 Created* が確認できる
* [ ] リフレッシュ不要でタスクが即表示
* [ ] バックエンド失敗時にエラートースト表示
* [ ] 全てのユニット・E2E テストがパス
* [ ] PR の CI がグリーン

---

## 8 デバッグツール

* **React DevTools** – ホバーで再レンダリング確認
* **`DEBUG=request:*`** – バックエンド受信ログ
* **`Vitest --ui`** – テストランナー UI
* **Prisma Studio** – DB 行を視覚確認

---

## 9 未解決の質問

1. レガシー MongoDB のダッシュボードは自動アップサートする？
2. 楽観적 UI が必要か、SWR 再検証で十分か？
3. `express-rate-limit` をこのルートに適用すべきか？

---

## 10 参考資料

* UI スペック → `docs/overview/ui.spec.md#dashboard-add-button`
* データモデル → `docs/overview/data.spec.md#dashboardtask`
* API スペック → `docs/overview/api.spec.md#post-dashboard-add`
* 本プレイブック → `dashboard-add-button-analysis.md`

---

# ステップ別チェックリスト

 - あなたは任意でチェックリスト [ ]を増減しても良い。
 - 終わったタスクにはチェック[x]を付けてください。

 # ダッシュボード「追加」ボタン修正 – 超詳細タスクブレイクダウン (約 180 ステップ)

> **構造**: フェーズ ▸ カテゴリ ▸ サブカテゴリ ▸ チェックリスト `[ ]`。
> **目的**: 1 クリックで実行できるレベルまで細分化。
> **ブランチ**: `feature/dashboard-add-button-fix`
> **最終更新**: 2025‑05‑09

---

## フェーズ 1: バックエンド API 実装

### 1‑A ルート & コントローラ設定

* **B01 ルーティングファイル作成**

  * [ ] **B01‑1** `src/routes` ディレクトリが存在するか確認
  * [ ] **B01‑2** 空ファイル `dashboard.routes.ts` を作成
  * [ ] **B01‑3** `import { Router } from 'express'` を追加
  * [ ] **B01‑4** `const router = Router();` を宣言
  * [ ] **B01‑5** `export default router;` を追加
  * [ ] **B01‑6** ESLint で自動フォーマット (`pnpm lint:fix`)
  * [ ] **B01‑7** Git でステージング & 部分コミット (WIP)
* **B02 POST ルート定義**

  * [ ] **B02‑1** `router.post('/add', controller.createDashboardTask);` を追加
  * [ ] **B02‑2** import 文で `controller` を参照
  * [ ] **B02‑3** 末尾で `export { router as dashboardRouter };` へ変更（名前付き）
  * [ ] **B02‑4** Postman で `POST /api/dashboard/add` を叩き 404 を確認 (期待)
  * [ ] **B02‑5** Swagger ドキュメント用 JSDoc コメントを追加
* **B03 ルートマウント**

  * [ ] **B03‑1** `app.ts` を開き `import { dashboardRouter } from './routes/dashboard.routes'`
  * [ ] **B03‑2** `app.use('/api/dashboard', dashboardRouter);` を追加
  * [ ] **B03‑3** `npm run dev` でコンパイル通過を確認
  * [ ] **B03‑4** VSCode 上で赤線が無いか確認
* **B04‑B06 コントローラ骨格**

  * [ ] **B04‑1** `src/controllers/dashboard.controller.ts` 新規作成
  * [ ] **B04‑2** `import { Request, Response, NextFunction }` を追加
  * [ ] **B05‑1** `export const createDashboardTask = async (...) => {}` を宣言
  * [ ] **B05‑2** シグネチャ `(req: Request, res: Response, next: NextFunction)` を設定
  * [ ] **B06‑1** `dashboardService.create(...)` を呼び出すプレースホルダを記述
  * [ ] **B06‑2** 依存注入のために service を import
  * [ ] **B06‑3** サービスが未実装なら TODO コメント
* **B07 エラーハンドリング**

  * [ ] **B07‑1** `try { ... } catch (err) { next(err); }` を実装
  * [ ] **B07‑2** エラー型を `unknown` から `any` にせずキャスト
* **B08 正常レスポンス**

  * [ ] **B08‑1** 成功時 `res.status(201).json({ data: newTask });` を返却
  * [ ] **B08‑2** 型 `DashboardTask` をインポート
* **B09 ESLint & フォーマット**

  * [ ] **B09‑1** `pnpm lint` 実行し警告ゼロ確認
  * [ ] **B09‑2** Prettier で保存時フォーマット
* **B10 コントローラテスト**

  * [ ] **B10‑1** `tests/controllers/dashboard.controller.spec.ts` を作成
  * [ ] **B10‑2** jest.mock で service をスタブ
  * [ ] **B10‑3** 成功パス (201) を検証
  * [ ] **B10‑4** 例外パスで `next` が呼ばれるか検証

### 1‑B バリデーション & ミドルウェア

* **B11 スキーマ定義**

  * [ ] **B11‑1** `dashboard.validator.ts` に `z.object({...})` を作成
  * [ ] **B11‑2** `title: z.string().min(1)` などフィールド追加
  * [ ] **B11‑3** 型エクスポート `DashboardAddInput`
* **B12 validate ミドルウェア適用**

  * [ ] **B12‑1** 共通 `validate(schema)` をインポート
  * [ ] **B12‑2** ルートに `validate(addSchema)` を挿入
* **B13 必須フィールド列挙**

  * [ ] **B13‑1** 要件から必要 field を洗い出し
  * [ ] **B13‑2** Zod ルールに反映
* **B14 型エラー解消**

  * [ ] **B14‑1** `tsc --noEmit` で型チェック
  * [ ] **B14‑2** 潜在的 `any` を除去
* **B15 バリデーションエラーハンドル**

  * [ ] **B15‑1** 400 JSON 例 `{ message, issues }` を共通 util で返却
* **B16 レートリミット**

  * [ ] **B16‑1** `rateLimit` をインポート
  * [ ] **B16‑2** window: 1min / 10 req に設定
* **B17 JWT ミドルウェア**

  * [ ] **B17‑1** `authMiddleware` を追加
  * [ ] **B17‑2** テストトークンで 200, 無トークンで 401
* **B18 Swagger 更新**

  * [ ] **B18‑1** openapi.yaml に `/dashboard/add` セクション追加
  * [ ] **B18‑2** リクエスト/レスポンス例を書く
* **B19 ESLint 警告ゼロ**

  * [ ] **B19‑1** `pnpm lint` を再実行
* **B20 コミット**

  * [ ] **B20‑1** `feat(backend): dashboard add route` をコミット
  * [ ] **B20‑2** PR を draft で作成

---

## フェーズ 2: データベース & Prisma

### 2‑A スキーマ作成

* **D01 モデル追加**

  * [ ] **D01‑1** `schema.prisma` を開く
  * [ ] **D01‑2** `model DashboardTask { ... }` を追記
  * [ ] **D01‑3** `@@map("dashboard_tasks")` を設定
* **D02 フィールド定義**

  * [ ] **D02‑1** `id Int @id @default(autoincrement())`
  * [ ] **D02‑2** `userId Int` & `projectId Int`
  * [ ] **D02‑3** `title String`
  * [ ] **D02‑4** `scheduledAt DateTime`
  * [ ] **D02‑5** `createdAt DateTime @default(now())`
* **D03 インデックス**

  * [ ] **D03‑1** `@@index([userId, scheduledAt])`
* **D04 リレーション**

  * [ ] **D04‑1** `user User @relation(fields: [userId], references: [id])`
  * [ ] **D04‑2** `project Project @relation(fields: [projectId], references: [id])`
* **D05 デフォルト**

  * [ ] **D05‑1** `@default(now())` を確認

### 2‑B マイグレーション実行

* **D06 migrate**

  * [ ] **D06‑1** `pnpm prisma migrate dev --name dashboard_task`
  * [ ] **D06‑2** `prisma studio` でテーブル確認
* **D07 Supabase 接続**

  * [ ] **D07‑1** `.env` に DB URL があるか確認
  * [ ] **D07‑2** `npx prisma db pull` 成功を確認
* **D08 Client 生成**

  * [ ] **D08‑1** `pnpm prisma generate`
  * [ ] **D08‑2** TS 型が更新されたか確認
* **D09 Service 実装**

  * [ ] **D09‑1** `dashboardService.create` に Prisma 呼び出し
  * [ ] **D09‑2** 成功時 Task を返却、失敗時 throw
* **D10 サービステスト**

  * [ ] **D10‑1** sqlite memory DB 設定
  * [ ] **D10‑2** 成功ケース作成
  * [ ] **D10‑3** バリデーションエラーケース作成

---

## フェーズ 3: フロントエンド API プロキシ

### 3‑A Next.js Edge ルート

* **F01 ルート生成**

  * [ ] **F01‑1** ディレクトリ `app/api/dashboard/add` を作成
  * [ ] **F01‑2** `route.ts` に `'use server'` を書かないことを確認
* **F02 POST ハンドラ**

  * [ ] **F02‑1** `export const POST = async (req: Request) => {}`
  * [ ] **F02‑2** `await fetch(`\${BACKEND\_URL}/api/dashboard/add`, {...})`
* **F03 環境変数**

  * [ ] **F03‑1** `.env.local` に `NEXT_PUBLIC_BACKEND_URL` を追加
  * [ ] **F03‑2** `process.env...` で undefined ガード
* **F04 JSON/Headers 転送**

  * [ ] **F04‑1** `headers: { 'Content-Type': 'application/json', Authorization: req.headers.get('Authorization') }`
* **F05 エラー時レスポンス**

  * [ ] **F05‑1** 非 2xx → `return new Response(body, { status })`
* **F06 CORS**

  * [ ] **F06‑1** backend 側で origin 許可を確認
* **F07 try/catch**

  * [ ] **F07‑1** ネットワーク例外時 502 を返却
* **F08 ユニットテスト**

  * [ ] **F08‑1** vitest `fetch-mock` で成功ケース
  * [ ] **F08‑2** エラーケース (500)

### 3‑B ダッシュボード API クライアント

* **F09 add() 関数**

  * [ ] **F09‑1** ファイルに `export const add = async (...)` を定義
  * [ ] **F09‑2** `await fetch('/api/dashboard/add', {...})`
* **F10 Zod パース**

  * [ ] **F10‑1** `const parsed = dashboardTaskSchema.parse(json.data)`
* **F11 エラーハンドリング**

  * [ ] **F11‑1** `if (!res.ok) throw new Error(json.message)`
* **F12 共通ヘッダ**

  * [ ] **F12‑1** `Authorization` 付き fetch util へ抽出
* **F13 型注釈**

  * [ ] **F13‑1** 戻り値型 `DashboardTask`
* **F14 useSWRMutation (任意)**

  * [ ] **F14‑1** `const { trigger, isMutating } = useSWRMutation(...)`
* **F15 コミット**

  * [ ] **F15‑1** `feat(frontend): dashboard api client` PR 作成

---

## フェーズ 4: UI & 状態管理

### 4‑A ボタン & ハンドラ

* **U01 onClick 実装**

  * [ ] **U01‑1** `AddToDashboardButton.tsx` で `handleAdd` を宣言
  * [ ] **U01‑2** `handleAdd` 内で `await dashboardApi.add(...)`
* **U02 ローディング表示**

  * [ ] **U02‑1** `isPending` state を追加
  * [ ] **U02‑2** スピナー or `disabled` に切替
* **U03 トースト**

  * [ ] **U03‑1** `toast.success` メッセージ日本語化
  * [ ] **U03‑2** エラー時 `toast.error`
* **U04 ARIA & a11y**

  * [ ] **U04‑1** `aria-label="ダッシュボードに追加"` を付与

### 4‑B プロジェクトページ連携

* **U06 Prop 渡し**

  * [ ] **U06‑1** `project-template.tsx` に `onAdd={addTaskGroupToSchedule}`
* **U07 引数生成**

  * [ ] **U07‑1** 今日の日付を utc‑start で生成
  * [ ] **U07‑2** タイトルはタスクグループ名を利用
* **U08 モーダル閉鎖**

  * [ ] **U08‑1** 完了後 `closeModal()` を実行
* **U09 ローディングリセット**

  * [ ] **U09‑1** finally で `setIsPending(false)`

### 4‑C ダッシュボード状態反映

* **U10 SWR キー**

  * [ ] **U10‑1** `const { data, mutate } = useSWR('/dashboard/tasks')`
* **U11 楽観的 UI**

  * [ ] **U11‑1** mutate 第2引数 `false` でローカル更新
* **U12 重複排除**

  * [ ] **U12‑1** `new Set` で id ユニーク化
* **U13 EmptyState**

  * [ ] **U13‑1** `data?.length === 0` でプレースホルダを表示
* **U14 レスポンシブ**

  * [ ] **U14‑1** `sm:grid-cols-1 md:grid-cols-2` を確認
* **U15 コミット**

  * [ ] **U15‑1** `feat(frontend): add-to-dashboard UI` を push

---

## フェーズ 5: テスト・ドキュメント・CI

### 5‑A ユニット & 統合テスト

* **T01 backend controller**

  * [ ] **T01‑1** happy path 201
  * [ ] **T01‑2** validation error 400
  * [ ] **T01‑3** unauthorized 401
* **T02 supertest ルート**

  * [ ] **T02‑1** in‑memory sqlite + app.listen()
  * [ ] **T02‑2** POST /add returns JSON
* **T03 レート制限**

  * [ ] **T03‑1** 11 回 POST → 429 を確認
* **T04 frontend api client**

  * [ ] **T04‑1** fetch 成功で型一致
  * [ ] **T04‑2** fetch 500 で throw
* **T05 Button click**

  * [ ] **T05‑1** RTL fireEvent.click → trigger called
* **T06 SWR mutate spy**

  * [ ] **T06‑1** jest.spyOn(mutate)
* **T07 e2e**

  * [ ] **T07‑1** playwright test `add_button.spec.ts`
* **T08 coverage**

  * [ ] **T08‑1** `pnpm test --coverage` 85%以上

### 5‑B ドキュメント

* **T09 API Spec**

  * [ ] **T09‑1** openapi ハッシュ生成
* **T10 Data Spec**

  * [ ] **T10‑1** ER 図更新
* **T11 UI Spec**

  * [ ] **T11‑1** ステート図 PNG 差し替え
* **T12 README**

  * [ ] **T12‑1** Quick‑start に curl 例追加
* **T13 Changelog**

  * [ ] **T13‑1** `## [Unreleased]` セクションに追加

### 5‑C CI/CD & デプロイ

* **T14 GitHub Actions**

  * [ ] **T14‑1** step: `prisma migrate deploy`
* **T15 backend workflow**

  * [ ] **T15‑1** cache node\_modules
* **T16 Vercel preview**

  * [ ] **T16‑1** `VERCEL_PROJECT_ID` secret を確認
* **T17 Fly.io deploy**

  * [ ] **T17‑1** fly apps list
  * [ ] **T17‑2** `fly deploy --remote-only`
* **T18 Smoke test**

  * [ ] **T18‑1** curl /healthz
* **T19 PR template**

  * [ ] **T19‑1** `.github/pull_request_template.md` を更新
* **T20 Final commit**

  * [ ] **T20‑1** `feat: dashboard add complete` コミット
  * [ ] **T20‑2** main ブランチへ squash merge

---

> **完了基準** — 180 項目すべて `[x]` になり、CI/CD が緑色であること。
