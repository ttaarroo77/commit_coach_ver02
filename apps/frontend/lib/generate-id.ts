/**
 * 一意のIDを生成するユーティリティ
 *
 * nanoidを使用して衝突しにくいIDを生成します。
 * プレフィックスを指定することで、IDの種類を識別しやすくします。
 */
import { nanoid } from 'nanoid';

/**
 * 指定されたプレフィックスと一意のIDを組み合わせた文字列を生成します
 * @param prefix ID種別を示すプレフィックス（例: 'project', 'task', 'subtask'）
 * @returns プレフィックス-ランダムID の形式の文字列
 */
export const genId = (prefix: string): string => `${prefix}-${nanoid(6)}`;

/**
 * 既存のIDリストと衝突しない新しいIDを生成します
 * @param prefix ID種別を示すプレフィックス
 * @param existingIds 既存のID配列
 * @returns 一意のID
 */
export const genUniqueId = (prefix: string, existingIds: string[]): string => {
  let newId = genId(prefix);
  while (existingIds.includes(newId)) {
    newId = genId(prefix);
  }
  return newId;
};
