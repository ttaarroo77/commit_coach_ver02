/**
 * @example
 * このファイルはJestまたはVitestがインストールされた後に使用するためのテスト例です。
 * 実際の使用前にテストライブラリをインストールし、設定ファイルを作成してください。
 *
 * インストール手順:
 * Jest: npm install --save-dev jest @testing-library/react
 * Vitest: npm install --save-dev vitest @testing-library/react
 */

/**
 * ダッシュボードのプロジェクトグループデータから重複IDがないことを確認するテスト
 */
describe('Projects data integrity', () => {
  test('should not have duplicate project IDs within any group', () => {
    // サンプルデータ
    // 実際のアプリケーションでは、実データあるいはモックデータを使用
    const groups = [
      {
        id: 'group-1',
        name: 'To Do',
        projects: [
          { id: 'project-1', title: 'プロジェクト1' },
          { id: 'project-2', title: 'プロジェクト2' }
        ]
      },
      {
        id: 'group-2',
        name: 'In Progress',
        projects: [
          { id: 'project-3', title: 'プロジェクト3' },
          // 重複IDの例: { id: 'project-2', title: 'プロジェクト2のコピー' }
        ]
      }
    ];

    // すべてのプロジェクトIDを取得
    const allProjectIds = groups.flatMap(group =>
      group.projects.map(project => project.id)
    );

    // ユニークなIDの数を確認
    const uniqueIds = new Set(allProjectIds);

    // 重複がある場合にテストが失敗する
    expect(uniqueIds.size).toBe(allProjectIds.length);

    // 具体的な重複IDを見つける（テスト失敗時のデバッグ用）
    const duplicateIds = allProjectIds.filter((id, index) =>
      allProjectIds.indexOf(id) !== index
    );

    expect(duplicateIds).toEqual([]);
  });

  test('should use compound keys for draggable items', () => {
    // 実際のレンダリングロジックをモック
    const renderDraggableKey = (groupId, projectId) => `${groupId}-${projectId}`;

    // サンプルデータ
    const groups = [
      {
        id: 'group-1',
        projects: [
          { id: 'project-1' },
          { id: 'project-2' }
        ]
      },
      {
        id: 'group-2',
        projects: [
          { id: 'project-3' },
          { id: 'project-2' } // 同じプロジェクトID
        ]
      }
    ];

    // すべてのドラッグ可能アイテムのキーを生成
    const allDraggableKeys = groups.flatMap(group =>
      group.projects.map(project => renderDraggableKey(group.id, project.id))
    );

    // ユニークなキーの数を確認
    const uniqueKeys = new Set(allDraggableKeys);

    // 複合キーを使うことで重複は発生しないはず
    expect(uniqueKeys.size).toBe(allDraggableKeys.length);

    // 重複キーがないことを確認
    const duplicateKeys = allDraggableKeys.filter((key, index) =>
      allDraggableKeys.indexOf(key) !== index
    );

    expect(duplicateKeys).toEqual([]);
  });
});
