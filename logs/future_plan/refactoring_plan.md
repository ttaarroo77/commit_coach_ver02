## Phase 0: Kickoff & Baseline Snapshot

### 0.1 ステークホルダー整合

\[ ] 1. ステークホルダーKickoffミーティングを設定し目的・範囲を確認する
\[ ] 2. リファクタリングの成功指標(KPI)を合意する
\[ ] 3. 週次ステータス共有用チャンネルを作成する

### 0.2 現状計測

\[ ] 4. mainブランチをタグ付けし現状スナップショットを保存する
\[ ] 5. 現行テストカバレッジを収集して記録する
\[ ] 6. ビルド時間とバンドルサイズを測定して記録する

### 0.3 リスク管理

\[ ] 7. 依存パッケージのEOLリストを作成する
\[ ] 8. プロジェクトカレンダーに主要マイルストーンを登録する
\[ ] 9. リスク登録簿をConfluenceに作成する
\[ ] 10. バックアウト戦略を文書化する

## Phase 1: Repository Hygiene & CI

### 1.1 コードスタイル統一

\[ ] 11. Prettier設定をmonorepoルートに統合する
\[ ] 12. ESLint設定を共有設定に統一する
\[ ] 13. VScode用settings.jsonで自動フォーマットを強制する

### 1.2 コミットガード

\[ ] 14. huskyでpre-commitにpnpm testを追加する
\[ ] 15. lint-stagedでステージ済みファイルだけをフォーマットする
\[ ] 16. commitlintでConventional Commitsを強制する

### 1.3 CIベースライン

\[ ] 17. GitHub Actionsでci.ymlを作成しbuild+testを走らせる
\[ ] 18. キャッシュキーをTurborepoハッシュに連動させる
\[ ] 19. mainブランチへのPRにステータスチェックを必須化する

### 1.4 セキュリティスキャン

\[ ] 20. Dependabotを有効化して週次でPRを自動生成する
\[ ] 21. npm auditジョブをCIに追加する
\[ ] 22. Snyk CLIを導入し高リスク依存を検出する

## Phase 2: Domain Layer Extraction

### 2.1 新規パッケージ作成

\[ ] 23. packages/domainディレクトリを作成する
\[ ] 24. package.jsonにnameとexportsフィールドを追加する
\[ ] 25. tsconfig.jsonでstrict設定を有効にする

### 2.2 エンティティ移動

\[ ] 26. src/models配下のエンティティをpackages/domain/src/entitiesへ移動する
\[ ] 27. 移動後import参照をパス書き換えする
\[ ] 28. Entityにequals()メソッドを追加して比較を統一する

### 2.3 ユースケース抽出

\[ ] 29. サービスクラスをpackages/domain/src/usecasesへ移動する
\[ ] 30. 不要なUI依存を除去して純粋ロジック化する
\[ ] 31. ユースケースごとに単体テストを追加する

### 2.4 ファサード整備

\[ ] 32. index.tsで公開APIをバレルエクスポートする
\[ ] 33. APIドキュメントをREADME.mdに追記する

### 2.5 ワークスペース統合

\[ ] 34. pnpm workspacesにdomainパッケージを追加する
\[ ] 35. CIパイプラインにdomainの独自ビルドステップを追加する
\[ ] 36. Storybookでdomain型のMockデータgenerateを確認する

## Phase 3: Infrastructure Layer Isolation

### 3.1 パッケージスキャフォルド

\[ ] 37. packages/infrastructureを作成しpackage.jsonを設定する
\[ ] 38. Supabase Client初期化コードをここに移動する

### 3.2 APIクライアント統一

\[ ] 39. fetchベースAPI呼び出しをpackages/infrastructure/src/apiへ集約する
\[ ] 40. 共通エラーハンドリングロジックを実装する
\[ ] 41. openapi-typescriptで型安全なClientを生成する

### 3.3 環境変数管理

\[ ] 42. .env.exampleに必要変数を列挙する
\[ ] 43. @commit-coach/configで環境変数ラッパーを実装する
\[ ] 44. CIのSecretsに本番用変数を登録する

### 3.4 パフォーマンス最適化

\[ ] 45. キャッシュレイヤーとしてreact-queryのqueryClientを導入する
\[ ] 46. インフラ層のユニットテストでSupabaseモックを追加する


# ここから先はやらない予定

## Phase 4: UI Layer Modularization

### 4.1 UIパッケージ生成

\[ ] 47. packages/uiを作成しstorybookを初期化する
\[ ] 48. Tailwind設定をuiパッケージに移動する

### 4.2 Atomic Design移行

\[ ] 49. コンポーネントをatoms/molecules/organismsへ分類する
\[ ] 50. パスエイリアス@commit-coach/uiを設定する
\[ ] 51. Storybook Docsを自動生成する

### 4.3 デザインシステム

\[ ] 52. 色・タイポグラフィトークンをui/tokensに定義する
\[ ] 53. ESLint pluginでUI層からdomain import禁止ルールを追加する

### 4.4 アクセシビリティ

\[ ] 54. eslint-plugin-jsx-a11yを導入し警告を修正する
\[ ] 55. Storybookでa11yアドオンを有効化する
\[ ] 56. Lighthouse CIでUIパッケージのアクセシビリティスコアを計測する

## Phase 5: Schema Driven Development

### 5.1 OpenAPIスキーマ整備

\[ ] 57. 現行エンドポイントをschema/openapi.yamlに書き起こす
\[ ] 58. pnpm generate\:typesでAPI型を生成する

### 5.2 DBスキーマ管理

\[ ] 59. SupabaseのDDLをschema/schema.sqlとしてバージョン管理する
\[ ] 60. migrateスクリプトをTurbo pipelineに組み込む

### 5.3 型生成自動化

\[ ] 61. GraphQL SDLがあればcodegen.ymlを追加する
\[ ] 62. CIでスキーマ変更時に自動ビルドを走らせる

### 5.4 スキーマレビュー

\[ ] 63. プルリクテンプレートにschema変更セクションを追加する
\[ ] 64. スキーマ差分をgraphql-inspectorでチェックする

### 5.5 ドキュメント公開

\[ ] 65. redoclyでAPIドキュメントサイトを自動ホストする
\[ ] 66. READMEにドキュメントURLを記載する

## Phase 6: Documentation & Metadata

### 6.1 パッケージREADME

\[ ] 67. 各packages/\*にREADME.mdを作成し目的・公開APIを記載する
\[ ] 68. docs/architecture.mdでレイヤー図を更新する

### 6.2 Mermaidダイアグラム

\[ ] 69. ドメインオブジェクト関係をMermaidクラス図で追加する
\[ ] 70. OpenAPIフローをシーケンス図で記載する

### 6.3 変更履歴管理

\[ ] 71. changesetを導入してバージョニングを自動化する
\[ ] 72. docs/changelog.mdを自動生成する

### 6.4 コントリビューションガイド

\[ ] 73. CONTRIBUTING.mdにセットアップ手順を記載する
\[ ] 74. コーディング規約を日本語でまとめる

### 6.5 ADR管理

\[ ] 75. docs/adr/0001-record-architecture.mdを作成する
\[ ] 76. 各重要決定をADR形式で追加する

## Phase 7: Testing & Coverage Reinforcement

### 7.1 ユニットテスト強化

\[ ] 77. Vitest設定をpackages間で共有する
\[ ] 78. エンティティごとにHappy/Edgeケーステストを追加する

### 7.2 Integrationテスト

\[ ] 79. Supabase Test Containerを使った統合テストを作成する
\[ ] 80. APIモックサーバーでエンドツーエンドテストを走らせる

### 7.3 Coverage閾値

\[ ] 81. vitest --coverage --threshold 80をCIに設定する
\[ ] 82. 低カバレッジファイルをIssueとして自動生成する

### 7.4 Visual Regression

\[ ] 83. Chromaticを導入してUI差分テストを自動化する
\[ ] 84. emergent差分があるPRをブロックする

### 7.5 負荷テスト

\[ ] 85. k6スクリプトを作成してAPIのRPSを計測する
\[ ] 86. 本番相当前提のしきい値を記録する

## Phase 8: AI Prompt & Automation Pipeline

### 8.1 Promptテンプレート

\[ ] 87. docs/prompts/add\_column.mdを作成し変更範囲テンプレを定義する
\[ ] 88. docs/prompts/refactor\_component.mdを作成する

### 8.2 GPTコードレビュー

\[ ] 89. Danger.jsとOpenAI APIでPRコメント自動生成を実装する
\[ ] 90. 重大指摘のみをタグ付けするロジックを追加する

### 8.3 コード生成フック

\[ ] 91. turborepoタスクgenerate\:llmでLLM補助生成を行う
\[ ] 92. OpenAI鍵をCI Secretsに追加する

### 8.4 ChatOps

\[ ] 93. GitHub Appで/ask-aiコメントトリガーを実装する
\[ ] 94. Slack通知に生成差分要約を送信する

### 8.5 ガイド整備

\[ ] 95. docs/ai\_guidelines.mdでプロンプトルールをまとめる
\[ ] 96. 社内勉強会でLLMハンズオンを開催する

## Phase 9: Final Migration & Cleanup

### 9.1 デッドコード除去

\[ ] 97. 未使用コンポーネントをpnpm depcheckで特定し削除する
\[ ] 98. ts-pruneで未参照exportを掃除する

### 9.2 バージョンアップ

\[ ] 99. Next.js / Vite の最新安定版へアップグレードする
\[ ] 100. Node.js LTSバージョンを20系に更新する

### 9.3 パフォーマンス最終調整

\[ ] 101. webpack bundle analyzerでChunkサイズを最適化する
\[ ] 102. Code splittingポリシーを文書化する

### 9.4 本番デプロイ

\[ ] 103. 新アーキテクチャでステージ環境へBlue/Greenデプロイを行う
\[ ] 104. モニタリングをDatadogで設定しエラーバジェットを監視する

### 9.5 学習フィードバック

\[ ] 105. KPTふりかえりミーティングを実施する
\[ ] 106. 主要指標(KPI)を初期値と比較しレポートを発行する

### 9.6 ドキュメント最終化

\[ ] 107. READMEのセットアップ手順を更新する
\[ ] 108. アーキテクチャ図を最終版に差し替える

### 9.7 リポジトリ整理

\[ ] 109. .github/テンプレートを最新化する
\[ ] 110. ブランチ保護ルールを更新する

### 9.8 プロジェクトクロージャ

\[ ] 111. リファクタリング完了のタグ(v2.0.0)を打つ
\[ ] 112. 全関係者へ完了報告メールを送る
