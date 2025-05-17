# Scratchpad – Task Progress Checklist

> **目的**: 単一ファイルでタスク・エラー・アイデアを一元管理し、LLM が階層構造をパースして進捗を追跡できるようにする。
> **書式**: `- [ ]` / `- [x]` によるチェックリストを多層構造の箇条書きで記述。

---

## Phase 0 — Blockers & Critical Bugs 🚨 *(先に片付ける)*

* [ ] **CI/CD で `node-gyp` ビルドが落ちる** — blocker — ASAP  @carol

  * Context: Ubuntu 22.04 + Node 20
  * [ ] `docker run` でローカル再現
  * [ ] node-gyp / Python / kernel‑headers のバージョンを揃えてビルド通過
  * [ ] GitHub Actions CI の `runs-on` を 22.04→24.04 に更新しテスト
  * [ ] main ブランチでパイプライン成功を確認

* [ ] **Root Layout Hydration エラー** — bug — ASAP  @ttaarroo77

  * Context: `data-redeviation-bs-uid`, `cz-shortcut-listen` 属性差分
  * [x] Chrome 拡張 (ColorZilla 等) を無効化 → 再現確認
  * [x] CI (headless Chrome) で同エラーが出ないことを確認
  * [x] `<div id="__extension_safe_root">` へ限定的に `suppressHydrationWarning`
  * [x] middleware or `<meta>` で ColorZilla を無効化
  * [x] Playwright に回帰テストを追加 (Phase 1 タスクと連動)
  * [ ] PR 作成 & レビュー → main へマージ

---

## Phase 1 — Validation & Guardrails 🛡️

* [x] **Playwright テスト: 不正 HTML 属性検知** — test — 2025‑05‑22  @qa-team

  * [x] テストで `body` の拡張属性を検証
  * [x] CI に統合しビルドブレイク条件を追加

---

## Phase 2 — Docs & Rules 📚

* [x] **`docs/overview` に「ハイドレーション差分禁止」ルール追記** — docs — 2025‑05‑22 @doc-team

  * [x] ドラフト作成
  * [x] チームレビュー
  * [ ] main へマージ

---

## Phase 3 — Feature Backlog 🚀

* [ ] **Stripe Webhook リトライロジック実装** — chore — In Progress — 2025‑05‑18 @backend

  * [ ] 要件整理 & retry 方針決定
  * [ ] 実装
  * [ ] 単体テスト追加
  * [ ] ステージングで検証

* [ ] **GraphQL スキーマ自動生成 CI 連携** — feature — 2025‑06‑01 @alice

  * [ ] codegen ツール選定
  * [ ] CI ワークフローへ統合
  * [ ] 型整合性テスト

* [ ] **4K 画像アップロード失敗を調査** — bug — 2025‑05‑30 @bob

  * [ ] エラー再現 (Sentry ERR\_UPLOAD\_413)
  * [ ] 制限値または圧縮処理を追加
  * [ ] e2e テスト追加

---

## Phase 4 — Ideas & Icebox 💡

* [ ] **GitHub Actions で e2e ビデオ録画保存** — idea — TBD @devops

---

## Done ✅ *(直近 2 週間)*

* [x] Prisma マイグレーション自動ロールバック — feature — 完了 2025‑05‑16

---

## Caveats (運用ルール)

1. **ファイルサイズ** — 2 k tokens 超なら `Done` をアーカイブ。
2. **セクション固定** — Phase 見出しと順序を変えない。
3. **重複禁止** — 同一タスクは 1 箇所に。階層で紐付ける。
4. **ブロッカー優先** — Phase 0 が空になるまで次フェーズ着手禁止。
5. **チェックボックス運用** — サブタスク完了後に親タスクを閉じる。
