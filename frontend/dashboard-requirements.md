# コミットコーチ - ダッシュボード要件定義書

## 1. 概要

コミットコーチのダッシュボードは、ユーザーが日々のタスクを効率的に管理し、AIコーチングを受けながら作業の見通しを立てるための中心的な機能です。発達障害の特性も考慮した視覚的なタスク管理と時間の可視化を重視し、ユーザーの生産性向上をサポートします。

## 2. 目的と価値

### 2.1 目的
- ユーザーの日々のタスクを視覚的に整理し、優先順位付けを支援する
- 時間管理を視覚的に表現し、作業の見通しを立てやすくする
- AIコーチングを通じてモチベーション維持と先延ばし防止をサポートする
- プロジェクト全体の進捗状況を一目で把握できるようにする

### 2.2 提供価値
- **見通しの確保**: 時系列でタスクを表示し、残り時間を視覚的に把握
- **達成感の獲得**: タスク完了による小さな成功体験の積み重ね
- **集中力の維持**: 現在取り組むべきタスクを明確に示す
- **モチベーション向上**: AIコーチングによる励ましと適切なアドバイス

## 3. 機能要件

### 3.1 タスク管理セクション
- **今日のタスク表示**
  - タスクを時系列で表示
  - 各タスクの開始時間、終了予定時間を明示
  - タスクの状態（未着手、進行中、完了）を色分けで表示
  - タスクの優先度を視覚的に表現

- **タスク操作**
  - 新規タスクの追加
  - タスクの編集、削除
  - タスクの状態変更（ドラッグ＆ドロップ）
  - タスクの詳細表示（クリック時）

### 3.2 時間管理セクション
- **タイムライン表示**
  - 現在時刻の表示
  - 時間経過に伴うタイムバーの進行表示
  - 残り作業時間の視覚化

- **時間設定**
  - タスクごとの所要時間設定
  - 締め切り時間のアラート表示

### 3.3 プロジェクト管理セクション
- **プロジェクト一覧**
  - 参加中のプロジェクト表示
  - プロジェクトごとの進捗状況表示
  - プロジェクト別タスク数の表示

- **プロジェクトナビゲーション**
  - プロジェクト詳細ページへのリンク
  - プロジェクト切り替え機能

### 3.4 AIコーチングセクション
- **AIコーチとの対話**
  - チャットインターフェース
  - タスク進捗に基づいたアドバイス表示
  - モチベーション維持のための励まし機能

- **タスク分析**
  - 完了タスクと未完了タスクの分析
  - 生産性パターンの可視化
  - 改善提案の表示

## 4. UI/UX要件

### 4.1 レイアウト
- **2カラムレイアウト**
  - 左側：タスク管理と時間管理
  - 右側：AIコーチングとプロジェクト概要

### 4.2 視覚的要素
- **カラーコーディング**
  - 未着手：グレー
  - 進行中：ティール（#31A9B8）
  - 完了：緑
  - 期限切れ/遅延：赤

- **アイコンと視覚的指標**
  - タスク状態を示すアイコン
  - 時間経過を示すプログレスバー
  - 優先度を示す視覚的マーカー

### 4.3 アクセシビリティ
- 色だけでなく形状でも状態を区別
- 十分なコントラスト比の確保
- スクリーンリーダー対応のラベル設定

## 5. 技術要件

### 5.1 フロントエンド
- React/Next.jsによるコンポーネント実装
- Tailwind CSSによるスタイリング
- 状態管理にReact Hooksを使用

### 5.2 データ管理
- ローカルステートでのタスク管理
- 将来的にはSupabaseとの連携

### 5.3 AIコーチング
- OpenAI APIを活用したチャットボット実装
- ユーザーのタスク状況に基づいた応答生成

## 6. 拡張性と将来計画

### 6.1 短期的拡張
- タスクのリマインダー機能
- タスク完了時のお祝い表示
- 日次/週次レポート機能

### 6.2 長期的拡張
- GitHub連携によるコミット情報の自動取得
- チーム連携機能の追加
- カスタマイズ可能なダッシュボードウィジェット

## 7. 参考事例

「コンダクター」アプリの以下の特徴を参考にしています：
1. タスクの時系列表示による見通しの確保
2. 時間経過の視覚的表現
3. タスクのラベル分け
4. サブタスク機能による達成感の獲得

これらの特徴を開発者向けにカスタマイズし、AIコーチング機能を追加することで、コミットコーチ独自の価値を提供します。
\`\`\`

次に、要件定義に基づいたダッシュボードを実装します：
