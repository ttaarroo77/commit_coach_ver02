/**
 * 日付と時刻のフォーマット用ユーティリティ関数
 */

/**
 * ISO形式の日付文字列から時刻のみを取り出してフォーマットする
 * @param isoString ISO形式の日付文字列
 * @returns 時:分 形式の文字列 (例: "12:30")
 */
export function formatTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    // サーバーサイドとクライアントサイドで一貫した結果を返すためにUTCを使用
    return `${String(date.getUTCHours()).padStart(2, '0')}:${String(date.getUTCMinutes()).padStart(2, '0')}`;
  } catch (error) {
    console.error('Invalid date format:', error);
    return '--:--';
  }
}

/**
 * ISO形式の日付文字列から日付をフォーマットする
 * @param isoString ISO形式の日付文字列
 * @returns YYYY/MM/DD 形式の文字列
 */
export function formatDate(isoString: string): string {
  try {
    const date = new Date(isoString);
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  } catch (error) {
    console.error('Invalid date format:', error);
    return 'YYYY/MM/DD';
  }
}

/**
 * 現在時刻をISO形式の文字列で取得する
 * @returns ISO形式の日付文字列
 */
export function getCurrentISOTime(): string {
  return new Date().toISOString();
}
