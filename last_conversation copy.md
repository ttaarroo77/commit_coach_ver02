<!-- scratchpad.md : 2025-04-30 更新 -->

アーキテクチャ仕様書を確認しました。現在のプロジェクト構造と理想的な構造には大きな差異があります。特に、ファイルがルートディレクトリに散在している状態は整理が必要です。

現状の問題点
ファイルの散在:
コンポーネント、コンテキスト、フック、ライブラリなどのファイルがルートディレクトリに直接配置されています
本来はapps/frontend/src内に整理されるべきです
重複したディレクトリ構造:
apps/frontend/apps/frontendという二重の階層構造があります
理想的にはapps/frontendのみで十分です
設定ファイルの重複:
Babel、Jest、Viteなどの設定ファイルがルートと複数の場所に重複しています
整理計画
以下の手順でプロジェクト構造を整理することを提案します：

1. 現状のバックアップを取る
Ran terminal command
~/…/commit_coach $ mkdir -p project_backup && cp -r __mocks__ __tests__ components contexts hooks lib src types project_backup/

Open in terminal

Not auto-run
2. 理想的なディレクトリ構造の分析
アーキテクチャ仕様書によると、理想的なディレクトリ構造は以下のようになっています：

CopyInsert
commit_coach/
├── apps/
│   ├── frontend/           # Next.jsフロントエンド
│   │   ├── src/            # ソースコード
│   │   │   ├── app/        # App Routerページ
│   │   │   ├── components/ # コンポーネント
│   │   │   ├── hooks/      # カスタムフック
│   │   │   ├── lib/        # ユーティリティ
│   │   │   ├── context/    # Reactコンテキスト
│   │   │   └── types/      # 型定義
│   └── backend/            # Expressバックエンド
├── packages/               # 共有パッケージ
│   ├── config/             # 共通設定
│   ├── shared-types/       # 共有型定義
│   ├── ai-coach/           # AIコーチングロジック
│   └── ui-kit/             # UIコンポーネント
3. 現状の構造との差分
現在の構造では、以下の問題があります：

ルートディレクトリに散在するファイル:
components/, contexts/, hooks/, lib/, src/, types/ などがルートにあります
これらは apps/frontend/src/ 内に移動すべきです
重複した階層構造:
apps/frontend/apps/frontend という二重の階層があります
理想的には apps/frontend のみにすべきです
設定ファイルの重複:
Babel、Jest、Viteなどの設定ファイルが複数の場所にあります
4. 推奨される整理手順
現在のプロジェクト状態を考慮すると、一気に理想的な構造に移行するのはリスクが高いです。段階的に整理することを提案します：

まず、重複した階層構造を解消する:
apps/frontend/apps/frontend の内容を apps/frontend に統合
ルートディレクトリのファイルを整理する:
components/, contexts/, hooks/, lib/, src/, types/ を apps/frontend/src/ に移動
設定ファイルを整理する:
Babel、Jest、Viteなどの設定ファイルを適切な場所に配置し、重複を排除
5. 具体的な実行計画
以下の手順で整理を進めることを提案します：

bash
CopyInsert
# 1. apps/frontend/apps/frontend の内容を apps/frontend に移動
cp -r apps/frontend/apps/frontend/* apps/frontend/
rm -rf apps/frontend/apps

# 2. ルートディレクトリのファイルを apps/frontend/src に移動
mkdir -p apps/frontend/src
mv components apps/frontend/src/
mv contexts apps/frontend/src/
mv hooks apps/frontend/src/
mv lib apps/frontend/src/
mv types apps/frontend/src/

# 3. src ディレクトリの内容も移動
mkdir -p apps/frontend/src/app
cp -r src/* apps/frontend/src/app/
6. 注意点
移行中のエラー:
ファイル移動中にパスの参照が壊れる可能性があります
一度に全てを移動するのではなく、段階的に移動してテストすることをお勧めします
パスエイリアスの調整:
tsconfig.json と next.config.mjs のパスエイリアス設定を更新する必要があります
依存関係の管理:
package.json の依存関係が適切に設定されているか確認が必要です
まとめ
プロジェクト構造を整理することで、以下のメリットが得られます：

開発効率の向上:
明確な構造により、ファイルの場所が分かりやすくなります
チーム開発での混乱を減らせます
ビルド・デプロイの安定化:
設定ファイルの重複がなくなり、一貫した設定が適用されます
メンテナンス性の向上:
標準的な構造に従うことで、新しいメンバーの参加時の学習コストが下がります
まずはバックアップを取った上で、段階的に整理を進めることをお勧めします。特に重要なのは、各ステップ後にビルドとテストを行い、問題がないことを確認することです。
