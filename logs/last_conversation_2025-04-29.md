<!-- scratchpad.md : 2025-04-23 更新 -->

## 参考情報情報：windsurf 前回の会話についての生データ





## 参考情報情報： cursor  前回の会話についての生データ

## タイトル：ドキュメント整理計画について

現在、ドキュメントが「overview」「deepwiki」「deepwiki copy」に分散しており、以下の問題が発生しています：

* 同じ内容が重複して編集コストが上がる
* どこに最新版があるか分かりにくい
* リンク切れや翻訳漏れが発生しやすい

## 整理方針

### ① 「deepwiki copy」を完全に削除

deepwiki の旧版が丸ごと残っているだけなので、まずは退避バックアップを取ってから削除します。

### ② 「deepwiki」を正規フォルダに昇格し名称を統一

* `docs/deepwiki` → `docs/wiki` など、短く中立的な名前へリネーム
* ルートに `index.md`（目次）を置き、各ドキュメントへのリンクを一覧化
* MkDocs／Docusaurus 等の静的サイトジェネレーター導入なら `mkdocs.yml` を追加

### ③ 「overview」配下の *.spec.md を wiki 内のサブカテゴリへ統合

| 現在のパス | 移動先 | 備考 |
|------------|--------|------|
| `docs/overview/architecture.spec.md` | `docs/wiki/architecture/architecture_overall.md` | 既存 backend／frontend doc とマージ |
| `docs/overview/product.spec.md` | `docs/wiki/specs/product_spec.md` | |
| `docs/overview/workflow.spec.md` | `docs/wiki/specs/workflow_spec.md` | |
| `docs/overview/ui.spec.md` | `docs/wiki/specs/ui_spec.md` | |
| `docs/overview/data.spec.md` | `docs/wiki/specs/data_model_spec.md` | deepwiki の database_schema とリンク |
| `docs/overview/api.spec.md` | `docs/wiki/api/api_spec.md` | deepwiki の api_documentation と統合 |
| `docs/overview/development_flow.md` | `docs/wiki/guides/development_flow.md` | deepwiki に同名あり → 差分をマージ |
| `docs/overview/guideline.pdf` | `docs/wiki/attachments/` | バイナリは `attachments` で一括管理 |

### ④ deepwiki 直下のファイル／サブフォルダを役割ごとに再編

最終的な構成イメージ（例）：

```
docs/
└── wiki/
    ├── index.md            # 目次
    ├── overview.md         # システム概要
    ├── architecture/
    │   ├── backend.md
    │   ├── frontend.md
    │   └── database.md
    ├── api/
    │   └── api_documentation.md
    ├── specs/
    │   ├── product_spec.md
    │   ├── data_model_spec.md
    │   ├── workflow_spec.md
    │   └── ui_spec.md
    ├── guides/
    │   ├── development_flow.md
    │   ├── development_and_deployment.md
    │   └── ai_driven_development.md
    ├── ai_coaching/
    │   ├── ai_coaching_system.md
    │   └── task_breakdown_ai.md
    └── attachments/        # PDF・画像など
```

#### ポイント

* **"1ファイル=1テーマ"** を徹底し、差分管理とレビューを容易に
* 言語切替が必要なら `ja/` と `en/` サブフォルダを切り、リンクを相対パスで揃える
* `_shared` や `snippets` フォルダで Mermaid 図・コード例を共通化すると重複削減

### ⑤ リンクと参照を一括更新

```bash
ag "/deepwiki copy/" docs | xargs sed -i '' 's/deepwiki copy/wiki/g'
```

`markdown-link-check` でリンク切れチェック → CI に追加

### ⑥ CI／レビュー運用を追加

* Docs PR は "docs/" 配下だけを対象に reviewer 自動アサイン
* `spellcheck-md` や `markdownlint` を GitHub Actions に組み込み品質担保
* 週次で `npm run docs:build && gh-pages` へ自動デプロイ（MkDocs など）

## まとめ

1. **旧コピーを削除**してソースを一本化
2. **deepwiki を正式な wiki として再命名**
3. **overview 内の spec 群を wiki の適切なカテゴリへ移動**
4. **目次ファイルを用意し静的サイト化**で可読性アップ
5. **CI で lint／リンクチェック・自動デプロイ**を回す

こう整理すれば「どこに何を書けばいいか」が明確になり、FAQ から仕様書まで横断的に参照しやすくなります。 