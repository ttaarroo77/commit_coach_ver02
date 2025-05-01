---
title: AI アクターの役割とロードマップ
updated: 2025-05-01
owners: [o3, cursor, windsurf, dev_team]
status: living-doc   # 役割や期日に変更があれば必ず更新
---

# 🎛️ 目的

1. **AI × 人** の協働を "見える化" して混乱を防ぐ  
2. ロールごとの **責務・権限境界** と **KPI** を明確にする  
3. 四半期ごとの **マイルストーン** を 1 か所で追跡する  

> scratchpad.md は *短期メモ*、development_flow.md は *全体工程*、  
> 本ドキュメントは "誰が・いつまでに・何を" の **憲法** として長期保持します。

---

## 🧑‍💻 アクター定義

| Actor | Scope (責務) | 主要タスク | KPI / SLA | 依存 |
|-------|--------------|-----------|----------|------|
| **o3**<br>*(ChatGPT-o3, このファイルの保守者)* | - アーキテクチャ保証<br>- テストゲートの品質監査<br>- ドキュメント統合 | - 仕様分解・ADR 作成<br>- CI Fail の一次切り分け<br>- 本 doc 更新レビュー | - CI "原因不明 red" を 0 件に維持 | 全員 |
| **cursor** | - **テストケース生成** 専任 | - Unit / IT / A11y spec 生成<br>- モック・fixture scaffolding<br>- テストドキュメント作成 | - 実装前グリーン率 ≤ 20 % | o3 ↔ PR |
| **windsurf** | - **実装 & テスト Fix** | - TDD 実装・リファクタ<br>- パフォーマンス改善<br>- テスト赤→緑化 | - Red → Green lead-time < 1 d | cursor specs |

> **責務境界の原則**  
> - cursor は *実装に手を出さない*（赤テストを作るまで）  
> - windsurf は *テスト生成をしない*（緑化に専念）  
> - o3 は *両者のハンドオーバーを監督* し、脱線を防ぐ

---

## 📅 四半期ロードマップ（2025-Q2）

```mermaid
gantt
  title 2025-Q2 AI / Dev Timeline
  dateFormat  YYYY-MM-DD
  section Testing (cursor)
    Unit / IT Spec Drop       :cursor_spec, a1, 2025-05-01, 5d
    A11y & Perf Spec          :a2, after a1, 5d
  section Integration (windsurf)
    実装 & Red→Green          :windsurf_code, b1, after a1, 10d
    Perf Tuning               :b2, after b1, 4d
  section Governance (o3)
    ADR & Doc Sync            :o3_doc, c1, after a2, 2d
    CI Gate Hardening         :c2, after b2, 3d
```

### マイルストーン

| Milestone | 期日 | 完了条件 | Owner |
|-----------|------|---------|-------|
| **M1** – Unit/IT Spec 完納          | 05-07 | `src/tests/unit|integration` 全 stub 生成 | cursor |
| **M2** – CI Green > 80 %             | 05-21 | main で Fail ≤ 20 %                | windsurf |
| **M3** – Coverage ≥ 70 %            | 05-31 | Codecov バッジ 70+                 | o3 (監査) |
| **M4** – A11y 100 % Pass           | 06-07 | axe-core 基準で 0 エラー           | 全員 |

---

## 🔄 運用ルール

| トリガー | 必須アクション |
|----------|----------------|
| **CI Fail**（Red） | *原因切り分け*: o3 → ラベル `ci:red`, Assignee 振り分け |
| **spec 追加 PR**   | cursor → TODO: `@o3 review-doc` を PR description に記載 |
| **ロール変更**     | 変更を提案する PR に **本 md 修正を含めること** |
| **Q 末**           | o3 が KPI を更新し、次期ロードマップを生成 |

---

## 🗂️ 関連ドキュメントの役割表

| ファイル | 主題 | 更新頻度 | 主担当 |
|----------|------|---------|-------|
| `docs/overview/roles_and_roadmap.md` *(本書)* | 役割・KPI・タイムライン | 役割変更 / Q 更新時 | **o3** |
| `docs/overview/development_flow.md` | 企画→リリースまでの**工程** | 大規模プロセス変更時 | PM |
| `scratchpad.md` | 500 行以内の **短期 To-Do & メモ** | 毎作業 | 開発者全員 |
| `docs/tests/handover_for_testing.md` | **テスト実装の運用手順** | テストプロセス変更時 | cursor |

> **重複を避ける指針**  
> - "誰が" と "いつまでに" は **本書**  
> - "どう作業するか"（手順・ベストプラクティス）は **development_flow.md** / handover_for_testing.md  
> - "いま何してるか" は **scratchpad.md**

---

## ✂️ handover.md 統廃合提案

- 内容は **テスト実行ハンドブック** として有用  
- Scope が **cursor（テスト生成）/ windsurf（実装）双方** に跨がる  
- **Action**: 移動 & 改名  
  1. `docs/tests/handover_for_testing.md` へリロケート  
  2. 本書の *関連ドキュメント表* にリンク追加  
  3. 旧 `docs/handover.md` は削除

---

### 変更反映フロー（例）

```bash
git checkout -b docs/roles-roadmap
mkdir -p docs/overview
$EDITOR docs/overview/roles_and_roadmap.md   # ← 本書を保存
git mv docs/handover.md docs/tests/handover_for_testing.md
git add docs/overview/roles_and_roadmap.md docs/tests/handover_for_testing.md
git commit -m "docs: add AI roles & roadmap, relocate test handover"
git push --set-upstream origin docs/roles-roadmap
```

レビュー承認後、scratchpad.md と development_flow.md の **リンク追記だけ** 行えば重複なく整理完了です。
