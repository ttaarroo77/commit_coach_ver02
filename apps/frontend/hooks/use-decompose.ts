/**
 * タスク分解フック
 * モックサービスを呼び出し、将来的にAI実装に差し替え可能
 */
import { decompose } from "@/lib/decompose-service";

/**
 * タイトルとレベルから項目を分解するフック
 * @param title 分解対象のタイトル
 * @param level 階層レベル（1: プロジェクト, 2: タスク）
 * @returns 分解された項目の配列を含むPromise
 */
export async function useDecompose(
  title: string,
  level: 1 | 2
): Promise<string[]> {
  // ここを将来AI呼び出しに差し替える
  return decompose(title, level);
}
