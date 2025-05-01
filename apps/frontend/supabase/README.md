# Commit Coach - Supabase マイグレーション

このディレクトリには Commit Coach プロジェクトの Supabase マイグレーションファイルが含まれています。

## 概要

- `migrations/`: データベースのスキーマ変更を含む SQL ファイル
- `seed/`: 初期データを含む SQL ファイル（開発用）
- `functions/`: PostgreSQL 関数（トランザクション処理など）

## マイグレーションの実行手順

### Supabase CLIを使用する場合

1. Supabase CLI をインストール
   ```bash
   npm install -g supabase
   ```

2. Supabase プロジェクトをリンク
   ```bash
   supabase login
   supabase link --project-ref <your-project-id>
   ```

3. マイグレーションを適用
   ```bash
   supabase db push
   ```

### 手動で適用する場合

1. Supabase ダッシュボードにログイン
2. 「Table Editor」→「SQL」を選択
3. `migrations` ディレクトリ内の SQL ファイルを順番にコピー＆ペーストして実行

## マイグレーションファイルの命名規則

マイグレーションファイルは以下の命名規則に従います：

```
YYYYMMDDHHMMSS_descriptive_name.sql
```

例：`20251001000000_initial_schema.sql`

## 新しいマイグレーションの作成

1. 新しいマイグレーションファイルを作成
   ```bash
   supabase migration new <name>
   ```

2. 生成されたファイルに SQL を記述

3. マイグレーションを適用
   ```bash
   supabase db push
   ```

## テストデータのシード

開発環境でテストデータを追加するには：

```bash
supabase db reset
```

これにより、データベースがリセットされ、マイグレーションとシードが適用されます。

## 本番環境への適用

本番環境に適用する前に、以下の点を確認してください：

1. マイグレーションがデータ損失を引き起こさないことを確認
2. 大規模なテーブルを変更する場合は、パフォーマンスへの影響を評価
3. ロールバック計画を用意

```bash
# 本番環境へのマイグレーション適用
supabase db push --db-url <production-db-url>
```

※ 本番環境の更新には、Supabase ダッシュボードからの手動実行も検討してください。 