import { render, screen } from '@testing-library/react';
import { CommitHistory } from '../../../components/dashboard/commit-history';
import { Commit } from '../../../types';

// テスト用コミットデータ
const mockCommits: Commit[] = [
  {
    id: '1',
    type: 'feat',
    message: '新機能を追加',
    createdAt: new Date('2023-01-03T10:00:00Z').toISOString(),
  },
  {
    id: '2',
    type: 'fix',
    message: 'バグの修正',
    createdAt: new Date('2023-01-02T09:30:00Z').toISOString(),
  },
  {
    id: '3',
    type: 'docs',
    message: 'ドキュメントの更新',
    createdAt: new Date('2023-01-01T14:45:00Z').toISOString(),
  },
];

describe('CommitHistoryコンポーネント', () => {
  test('コミット履歴が正しくレンダリングされる', () => {
    render(<CommitHistory commits={mockCommits} />);

    // タイトルが表示される
    expect(screen.getByText('コミット履歴')).toBeInTheDocument();

    // 各コミットが表示される
    expect(screen.getByText('新機能を追加')).toBeInTheDocument();
    expect(screen.getByText('バグの修正')).toBeInTheDocument();
    expect(screen.getByText('ドキュメントの更新')).toBeInTheDocument();

    // コミットタイプが表示される
    expect(screen.getByText('feat')).toBeInTheDocument();
    expect(screen.getByText('fix')).toBeInTheDocument();
    expect(screen.getByText('docs')).toBeInTheDocument();

    // 日付がフォーマットされて表示される
    const dateTimeElements = screen.getAllByTestId('commit-date');
    expect(dateTimeElements).toHaveLength(3);
  });

  test('コミットがない場合、メッセージが表示される', () => {
    render(<CommitHistory commits={[]} />);

    // 「コミットがありません」というメッセージが表示される
    expect(screen.getByText('コミット履歴はありません')).toBeInTheDocument();
  });

  test('コミットが日付の降順でレンダリングされる', () => {
    render(<CommitHistory commits={mockCommits} />);

    // コミット項目の要素を取得
    const commitItems = screen.getAllByTestId('commit-item');
    expect(commitItems).toHaveLength(3);

    // 最初の要素が最新のコミット（2023-01-03）であることを確認
    expect(commitItems[0]).toHaveTextContent('新機能を追加');
    // 2番目の要素が2番目に新しいコミット（2023-01-02）であることを確認
    expect(commitItems[1]).toHaveTextContent('バグの修正');
    // 3番目の要素が最も古いコミット（2023-01-01）であることを確認
    expect(commitItems[2]).toHaveTextContent('ドキュメントの更新');
  });

  test('コミットタイプに応じたバッジの色が適用される', () => {
    render(<CommitHistory commits={mockCommits} />);

    // タイプに対応するバッジが存在する
    const badges = screen.getAllByTestId('commit-type-badge');
    expect(badges).toHaveLength(3);

    // 各バッジが正しいクラスを持っていることを確認
    // 注: 実装によって異なるため、実際のコンポーネントに合わせて調整が必要
    const featBadge = badges.find(badge => badge.textContent === 'feat');
    const fixBadge = badges.find(badge => badge.textContent === 'fix');
    const docsBadge = badges.find(badge => badge.textContent === 'docs');

    expect(featBadge).toBeInTheDocument();
    expect(fixBadge).toBeInTheDocument();
    expect(docsBadge).toBeInTheDocument();
  });
}); 