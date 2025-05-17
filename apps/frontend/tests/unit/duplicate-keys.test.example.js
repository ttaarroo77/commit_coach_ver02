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

// 重複キー問題検出のテスト例
// このファイルを参考に、実際のテストを作成してください

import { render } from '@testing-library/react';
import '@testing-library/jest-dom';

/**
 * コンポーネントの重複キー警告をテストする例
 *
 * 使用方法:
 * 1. このファイルを適切なテストディレクトリにコピー
 * 2. テスト対象のコンポーネントをインポート
 * 3. describe/it ブロックを実際のコンポーネントに合わせて調整
 */

describe('重複キーテスト', () => {
  let originalConsoleError;
  let consoleErrorMock;

  beforeEach(() => {
    // console.errorをモック化し、呼び出しを記録
    originalConsoleError = console.error;
    consoleErrorMock = jest.fn();
    console.error = consoleErrorMock;
  });

  afterEach(() => {
    // テスト後に元のconsole.errorを復元
    console.error = originalConsoleError;
  });

  it('DashboardPage コンポーネントでは重複キーエラーが発生しないこと', () => {
    // 実際のテストではDashboardPageをインポートしてレンダリング
    // import DashboardPage from '@/app/dashboard/page';

    // モックデータの準備例
    /*
    const mockTaskGroups = [
      {
        id: 'today',
        expanded: true,
        projects: [
          {
            id: 'project-1',
            title: 'プロジェクト1',
            expanded: true,
            tasks: [
              {
                id: 'task-1',
                title: 'タスク1',
                expanded: true,
                completed: false,
                subtasks: [
                  { id: 'subtask-1', title: 'サブタスク1', completed: false }
                ]
              }
            ]
          },
          {
            id: 'project-2',
            title: 'プロジェクト2',
            expanded: false,
            tasks: []
          }
        ]
      },
      {
        id: 'unscheduled',
        expanded: true,
        projects: [
          {
            id: 'project-2', // 注目: 同じIDが複数グループに存在する例
            title: '未定のプロジェクト2',
            expanded: false,
            tasks: []
          }
        ]
      }
    ];
    */

    // DashboardPageコンポーネントのレンダリング
    // const { container } = render(<DashboardPage />);

    // モックして直接レンダリングする例
    /*
    jest.mock('@/lib/dashboard-utils', () => ({
      ...jest.requireActual('@/lib/dashboard-utils'),
      getDashboardData: () => mockTaskGroups,
    }));
    const { container } = render(<DashboardPage />);
    */

    // 代わりにモック要素を使った簡易テストの例
    const MockComponent = () => {
      return (
        <div>
          <ul>
            {['a', 'b', 'c'].map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      );
    };

    render(<MockComponent />);

    // 重複キーに関連するエラーメッセージをチェック
    const hasDuplicateKeyError = consoleErrorMock.mock.calls.some(
      call =>
        call[0]?.includes?.('Warning: Encountered two children with the same key') ||
        (typeof call[0] === 'object' && call[0]?.message?.includes?.('two children with the same key'))
    );

    // 重複キーエラーがないことを検証
    expect(hasDuplicateKeyError).toBe(false);

    // または特定のエラーメッセージが出ないことを確認する方法
    /*
    expect(consoleErrorMock).not.toHaveBeenCalledWith(
      expect.stringMatching(/Encountered two children with the same key/)
    );
    */
  });

  // 重複キーが存在する場合のネガティブテスト
  it('意図的に重複キーを使用するとエラーが検出されること (ネガティブテスト)', () => {
    const ComponentWithDuplicateKeys = () => {
      return (
        <div>
          <ul>
            {['a', 'b', 'a'].map((item, index) => (
              <li key={item}>{item}</li> // 'a'が重複
            ))}
          </ul>
        </div>
      );
    };

    render(<ComponentWithDuplicateKeys />);

    // 重複キーに関連するエラーメッセージをチェック
    const hasDuplicateKeyError = consoleErrorMock.mock.calls.some(
      call =>
        call[0]?.includes?.('Warning: Encountered two children with the same key') ||
        (typeof call[0] === 'object' && call[0]?.message?.includes?.('two children with the same key'))
    );

    // 重複キーエラーが検出されることを検証
    expect(hasDuplicateKeyError).toBe(true);
  });
});

// プロジェクトID検証用ユーティリティ関数の例
export const validateProjectIds = (taskGroups) => {
  // すべてのプロジェクトIDを収集
  const allProjectIds = new Set();
  const duplicateIds = [];

  taskGroups.forEach(group => {
    group.projects.forEach(project => {
      // 複合キーとして検証
      const compositeKey = `${group.id}-${project.id}`;

      if (allProjectIds.has(compositeKey)) {
        duplicateIds.push(compositeKey);
      } else {
        allProjectIds.add(compositeKey);
      }
    });
  });

  return {
    hasDuplicates: duplicateIds.length > 0,
    duplicateIds
  };
};
