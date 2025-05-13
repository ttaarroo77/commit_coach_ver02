/**
 * タスク分解サービス
 * 現在はモック実装、将来的にAI実装に差し替え可能
 */

/**
 * タスクやプロジェクトを分解する関数（モック実装）
 * @param title 分解対象のタイトル
 * @param level 階層レベル（1: プロジェクト, 2: タスク）
 * @returns 分解された項目の配列
 */
export const mockDecompose = (title: string, level: 1 | 2): string[] => {
  // 後でAIに差し替える箇所
  if (level === 1) {
    return [
      "市場・テーマ選定",
      "ブログ基盤構築",
      "コンテンツ制作・SEO最適化",
      "集客チャネル拡大",
      "収益化 & LTV 向上",
      "計測・改善・自動化",
    ];
  }
  // level 2 → 任意のサブタスク
  return [
    `「${title}」キックオフ`,
    `要件取りまとめ`,
    `工数見積もり`,
    `ステークホルダー承認`,
  ];
};

// 将来的にAI実装に差し替える際のエクスポート
export const decompose = mockDecompose;
