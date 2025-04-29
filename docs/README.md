# 🗂️ Docs Overview

Commit Coach ドキュメントディレクトリの構造と目的を一覧できます。LLM／開発者が「どこに何があるか」を即座に把握できることを目指したガイドです。
参考：
- https://deepwiki.com/ttaarroo77/commit_coach_ver02
- https://github.com/ttaarroo77/commit_coach_ver02


> **更新ポリシー**: 新しいドキュメントを追加したら必ずここに追記し、リンク切れが無いか確認してください。

---

## 1. ルート直下 (docs/)
| ファイル / フォルダ | 役割 |
|---------------------|------|
| `development_flow_overview.md` | **公式ロードマップ & チェックリスト**。環境セットアップや Quick Start など実装フローの詳細も含む（※旧 `development_flow.md` を統合済み）。|
| `supabase_setup.md` | Supabase プロジェクトの初期設定手順。|
| `supabase_transactions.md` | Supabase でのトランザクション実装ガイド。|
| `wiki/` | 長期保守ドキュメントのメイン置き場。詳細は下記を参照。|


## 2. `docs/wiki/` のサブツリー
`wiki/` は **「1 ドキュメント = 1 テーマ」** 原則で分類しています。

| サブフォルダ | 内容 | 代表ファイル例 |
|--------------|------|-----------------|
| `overview.md` (直下) | システム全体概要 | `overview.md` |
| `architecture/` | 技術アーキテクチャ（Backend / Frontend / Database） | `architecture_overall.md`, `backend/backend_overview.md` |
| `api/` | API 仕様書 | `api_documentation.md`, `api_spec.md` |
| `specs/` | 製品・データモデル・UI など各種仕様 | `product_spec.md`, `workflow_spec.md` |
| `guides/` | How-to / 運用ガイド | `development_and_deployment.md`, `ai_driven_development.md` |
| `ai_coaching/` | AI 機能設計 | `ai_coaching_system.md` |
| `attachments/` | PDF・画像などバイナリ | `guideline.pdf` |

> 各サブフォルダには `README.md` を置かず、上位表で索引できるようにしています。大量追加時はサブフォルダにも索引を作成してください。


## 3. その他補足
- **Scratch メモ** → `scratch/skratchpad.md`（短期的な作業ログ。通常は docs には含めません）  
- **会話ログ** → `logs/*.md`（履歴用。過去の経緯参照）
- **運用スクリプト** → `scripts/` などに配置（例: `deploy_safe.sh` はリポジトリ直下）


## 4. よくあるリンク
- 開発ロードマップ: [`development_flow_overview.md`](./development_flow_overview.md)  
- システム概要: [`wiki/overview.md`](./wiki/overview.md)  
- API 一覧: [`wiki/api/api_documentation.md`](./wiki/api/api_documentation.md)

---

### 🚀 利用方法（AI & 人間共通）
1. **探す** → 上表を見てサブフォルダを判断。
2. **読む** → 目的の Markdown を開く（章立て・YAML Front-Matter を活用）。
3. **編集する** → ファイル末尾に改訂履歴を追記 & PR にリンク。

Happy hacking! 


