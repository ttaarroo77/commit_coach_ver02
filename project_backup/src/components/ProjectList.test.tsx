import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ProjectList from './ProjectList';

describe('ProjectList', () => {
  const mockProjects = [
    {
      id: '1',
      name: 'プロジェクト1',
      description: 'プロジェクト1の説明',
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-02T00:00:00Z',
    },
    {
      id: '2',
      name: 'プロジェクト2',
      description: 'プロジェクト2の説明',
      createdAt: '2025-01-03T00:00:00Z',
      updatedAt: '2025-01-04T00:00:00Z',
    },
    {
      id: '3',
      name: 'プロジェクト3',
      description: 'プロジェクト3の説明',
      createdAt: '2025-01-05T00:00:00Z',
      updatedAt: '2025-01-06T00:00:00Z',
    },
  ];

  it('レンダリングが正しく行われること', () => {
    render(
      <ProjectList
        projects={mockProjects}
        onProjectClick={() => { }}
        onProjectDelete={() => { }}
      />
    );

    expect(screen.getByTestId('project-list')).toBeInTheDocument();
    expect(screen.getByTestId('search-input')).toBeInTheDocument();
    expect(screen.getByText('プロジェクト1')).toBeInTheDocument();
    expect(screen.getByText('プロジェクト2')).toBeInTheDocument();
    expect(screen.getByText('プロジェクト3')).toBeInTheDocument();
  });

  it('検索機能が正しく機能すること', () => {
    render(
      <ProjectList
        projects={mockProjects}
        onProjectClick={() => { }}
        onProjectDelete={() => { }}
      />
    );

    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'プロジェクト1' } });

    expect(screen.getByText('プロジェクト1')).toBeInTheDocument();
    expect(screen.queryByText('プロジェクト2')).not.toBeInTheDocument();
    expect(screen.queryByText('プロジェクト3')).not.toBeInTheDocument();
  });

  it('ページネーションが正しく機能すること', () => {
    const manyProjects = Array.from({ length: 10 }, (_, i) => ({
      id: String(i + 1),
      name: `プロジェクト${i + 1}`,
      description: `プロジェクト${i + 1}の説明`,
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-02T00:00:00Z',
    }));

    render(
      <ProjectList
        projects={manyProjects}
        onProjectClick={() => { }}
        onProjectDelete={() => { }}
      />
    );

    // 最初のページには5つのプロジェクトが表示される
    expect(screen.getByText('プロジェクト1')).toBeInTheDocument();
    expect(screen.getByText('プロジェクト5')).toBeInTheDocument();
    expect(screen.queryByText('プロジェクト6')).not.toBeInTheDocument();

    // 2ページ目に移動
    fireEvent.click(screen.getByTestId('page-button-2'));

    // 2ページ目には6-10のプロジェクトが表示される
    expect(screen.getByText('プロジェクト6')).toBeInTheDocument();
    expect(screen.getByText('プロジェクト10')).toBeInTheDocument();
    expect(screen.queryByText('プロジェクト5')).not.toBeInTheDocument();
  });

  it('プロジェクトのクリックが正しく機能すること', () => {
    const onProjectClick = vi.fn();
    render(
      <ProjectList
        projects={mockProjects}
        onProjectClick={onProjectClick}
        onProjectDelete={() => { }}
      />
    );

    fireEvent.click(screen.getByTestId(`project-name-1`));
    expect(onProjectClick).toHaveBeenCalledWith('1');
  });

  it('プロジェクトの削除が正しく機能すること', () => {
    const onProjectDelete = vi.fn();
    render(
      <ProjectList
        projects={mockProjects}
        onProjectClick={() => { }}
        onProjectDelete={onProjectDelete}
      />
    );

    fireEvent.click(screen.getByTestId('delete-button-1'));
    expect(onProjectDelete).toHaveBeenCalledWith('1');
  });
}); 