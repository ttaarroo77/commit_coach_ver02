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
| **o3**<br>*(ChatGPT-o3, このファイルの保守者)* | - アーキテクチャ設計<br>- 品質保証<br>- ドキュメント統合 | - アーキテクチャ設計書作成<br>- コンポーネント設計<br>- テスト戦略策定<br>- コード品質監視 | - 設計書の完全性<br>- コード品質基準の遵守率 | 全員 |
| **cursor**<br>*(バックエンド担当)* | - バックエンド実装<br>- API設計・開発<br>- DB設計・運用 | - API実装<br>- DBスキーマ設計・管理<br>- バックエンドテスト<br>- パフォーマンス改善 | - API実装完了率<br>- テストカバレッジ<br>- バグ修正率 | o3 |
| **windsurf**<br>*(フロントエンド担当)* | - フロントエンド実装<br>- UI/UX開発<br>- フロントテスト | - コンポーネント実装<br>- UI/UX改善<br>- フロントテスト<br>- バグ修正 | - 実装完了率<br>- テストカバレッジ<br>- バグ修正率 | o3 |

1. **o3（アーキテクチャ設計・品質保証）**
   - アーキテクチャ設計書作成
   - コンポーネント設計
   - テスト戦略策定
   - コード品質監視

2. **cursor（バックエンド担当）**
   - バックエンド実装
   - API設計・開発
   - DB設計・運用
   - バックエンドテスト

3. **windsurf（フロントエンド担当）**
   - フロントエンド実装
   - UI/UX開発
   - フロントテスト
   - バグ修正

> **責務境界の原則**  
> - o3 は *実装に手を出さない*（設計と品質保証に専念）  
> - cursor は *フロントエンド・運用に手を出さない*（バックエンドに専念）  
> - windsurf は *設計・バックエンドに手を出さない*（フロントエンドに専念）

---

## 📅 四半期ロードマップ（2025-Q2）

```mermaid
gantt
  title 2025-Q2 AI / Dev Timeline
  dateFormat  YYYY-MM-DD
  section Design (o3)
    アーキテクチャ設計書作成    :o3_design, a1, 2025-05-01, 5d
    コンポーネント設計策定      :a2, after a1, 5d
  section Backend (cursor)
    バックエンドAPI実装         :cursor_impl, b1, after a1, 10d
    DB設計・テスト             :b2, after b1, 4d
  section Frontend (windsurf)
    フロントエンド実装         :windsurf_impl, c1, after a2, 10d
    UI/UX改善・テスト           :c2, after c1, 4d
```

### マイルストーン

| Milestone | 期日 | 完了条件 | Owner |
|-----------|------|---------|-------|
| **M1** – アーキテクチャ設計完了 | 05-07 | 設計書レビュー完了 | o3 |
| **M2** – バックエンドAPI実装完了 | 05-21 | 主要API実装完了 | cursor |
| **M3** – フロントエンド実装完了 | 05-31 | 主要画面実装完了 | windsurf |
| **M4** – 総合テスト・リリース | 06-07 | E2Eテスト・本番動作確認 | 全員 |

---

## 🔄 運用ルール

| トリガー | 必須アクション |
|----------|----------------|
| **設計変更** | o3 → 設計書更新 & 関係者への通知 |
| **バックエンド実装開始** | cursor → 実装計画の提出 & レビュー依頼 |
| **フロントエンド実装開始** | windsurf → 実装計画の提出 & レビュー依頼 |
| **Q 末** | o3 が KPI を更新し、次期ロードマップを生成 |

---

## 🗂️ 関連ドキュメントの役割表

| ファイル | 主題 | 更新頻度 | 主担当 |
|----------|------|---------|-------|
| `docs/overview/roles_and_roadmap.md` *(本書)* | 役割・KPI・タイムライン | 役割変更 / Q 更新時 | **o3** |
| `docs/overview/development_flow.md` | 企画→リリースまでの**工程** | 大規模プロセス変更時 | o3 |
| `scratchpad.md` | 500 行以内の **短期 To-Do & メモ** | 毎作業 | 開発者全員 |
| `docs/architecture/design.md` | **アーキテクチャ設計書** | 設計変更時 | o3 |
| `docs/implementation/guide.md` | **実装ガイドライン** | 実装方針変更時 | cursor |
| `docs/operations/manual.md` | **運用マニュアル** | 運用プロセス変更時 | windsurf |

> **重複を避ける指針**  
> - "誰が" と "いつまでに" は **本書**  
> - "どう作業するか"（手順・ベストプラクティス）は **development_flow.md**  
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

ご意見やご質問がございましたら、お気軽にお申し付けください。

承知しました。`roles_and_roadmap.md`を更新して、新しい役割分担を反映させましょう。




