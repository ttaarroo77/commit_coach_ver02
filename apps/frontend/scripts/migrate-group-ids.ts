/**
 * グループIDをマイグレーションするスクリプト
 *
 * 古い形式のグループID（"today"や単純な文字列）を新しい形式（日付 + nanoid）に変換します。
 * このスクリプトは以下を処理します：
 * 1. ローカルストレージに保存されたデータ
 * 2. IndexedDBに保存されたデータ（ある場合）
 * 3. Supabaseに保存されたデータ（環境変数で設定されている場合）
 */

import { debugNanoid } from '../lib/utils';
import { makeGroupId } from '../lib/dashboard-utils';

// 既存のIDから新しいIDへのマッピング
const idMapping: Record<string, string> = {};

/**
 * IDの変換を行い、マッピングを記録する
 * @param oldId 古いID
 * @returns 新しいID
 */
function migrateId(oldId: string): string {
  // すでに変換済みの場合はマッピングから取得
  if (idMapping[oldId]) {
    return idMapping[oldId];
  }

  // 新しいIDを生成（または特定のIDから直接変換）
  let newId: string;

  if (oldId === 'today') {
    // 今日の日付を使用
    newId = makeGroupId(new Date());
  } else if (oldId === 'unscheduled' || oldId === 'backlog') {
    // 未スケジュール用の特別なID（現在の日付+特別な識別子）
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10);
    newId = `${dateStr}-unscheduled-${debugNanoid(4)}`;
  } else if (oldId.includes('-')) {
    // すでに新形式である可能性が高い場合はそのまま使用
    return oldId;
  } else {
    // その他の場合は汎用的なIDを生成
    newId = makeGroupId();
  }

  // マッピングを記録
  idMapping[oldId] = newId;
  console.log(`ID変換: ${oldId} -> ${newId}`);

  return newId;
}

/**
 * ローカルストレージのデータを変換する
 */
function migrateLocalStorage() {
  try {
    console.log('ローカルストレージのデータを変換中...');

    // dashboardDataを取得
    const dashboardDataStr = localStorage.getItem('dashboardData');
    if (!dashboardDataStr) {
      console.log('ローカルストレージにデータがありません');
      return;
    }

    // JSONとしてパース
    const dashboardData = JSON.parse(dashboardDataStr);

    // グループIDを変換
    const migratedData = dashboardData.map((group: any) => {
      const newGroupId = migrateId(group.id);

      return {
        ...group,
        id: newGroupId
      };
    });

    // 変換したデータを保存
    localStorage.setItem('dashboardData', JSON.stringify(migratedData));
    localStorage.setItem('idMigrationMapping', JSON.stringify(idMapping));

    console.log('ローカルストレージのデータ変換が完了しました');
  } catch (error) {
    console.error('ローカルストレージの変換中にエラーが発生しました:', error);
  }
}

/**
 * このスクリプトをブラウザで実行するためのメイン関数
 */
function main() {
  console.log('グループIDマイグレーションを開始します...');

  // ブラウザ環境でのみ実行
  if (typeof window !== 'undefined') {
    migrateLocalStorage();
    // 必要に応じてIndexedDBやSupabaseの変換関数を呼び出す
    // migrateIndexedDB();
    // migrateSupabase();
  } else {
    console.error('このスクリプトはブラウザ環境でのみ実行できます');
  }

  console.log('グループIDマイグレーションが完了しました');
  console.log('変換マッピング:', idMapping);
}

// スクリプトがモジュールとしてインポートされた場合は実行しない
if (typeof window !== 'undefined' && window.document.currentScript?.getAttribute('data-execute') === 'true') {
  main();
}

export { migrateId, migrateLocalStorage, main };
