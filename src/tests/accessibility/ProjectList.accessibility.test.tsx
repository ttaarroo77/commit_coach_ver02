import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { axe } from 'vitest-axe';
import ProjectList from '../../components/ProjectList';

describe('ProjectList Accessibility Tests', () => {
  const mockProjects = [
    {
      id: '1',
      name: 'プロジェクト1',
      description: 'プロジェクト1の説明',
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-02T00:00:00Z',
    },
  ];

  it('プロジェクトリストがWCAG 2.1 AAに準拠していること', async () => {
    const onProjectClick = vi.fn();
    const onProjectDelete = vi.fn();
    const { container } = render(
      <ProjectList
        projects={mockProjects}
        onProjectClick={onProjectClick}
        onProjectDelete={onProjectDelete}
      />
    );

    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });

  it('プロジェクトカードが適切なARIA属性を持っていること', () => {
    const onProjectClick = vi.fn();
    const onProjectDelete = vi.fn();
    render(
      <ProjectList
        projects={mockProjects}
        onProjectClick={onProjectClick}
        onProjectDelete={onProjectDelete}
      />
    );

    const projectCard = screen.getByRole('article');
    expect(projectCard).toHaveAttribute('aria-labelledby', 'project-name-1');
    expect(projectCard).toHaveAttribute('aria-describedby', 'project-description-1');
  });

  it('検索機能のアクセシビリティ', () => {
    const onProjectClick = vi.fn();
    const onProjectDelete = vi.fn();
    render(
      <ProjectList
        projects={mockProjects}
        onProjectClick={onProjectClick}
        onProjectDelete={onProjectDelete}
      />
    );

    const searchInput = screen.getByPlaceholderText('プロジェクトを検索...');
    expect(searchInput).toHaveAttribute('aria-label', 'プロジェクト検索');
    expect(searchInput).toHaveAttribute('role', 'searchbox');
  });

  it('ページネーションのアクセシビリティ', () => {
    const onProjectClick = vi.fn();
    const onProjectDelete = vi.fn();
    render(
      <ProjectList
        projects={mockProjects}
        onProjectClick={onProjectClick}
        onProjectDelete={onProjectDelete}
      />
    );

    const pagination = screen.getByRole('navigation', { name: 'ページネーション' });
    expect(pagination).toBeInTheDocument();

    const nextButton = screen.getByTestId('next-page-button');
    expect(nextButton).toHaveAttribute('aria-label', '次のページ');
  });

  it('キーボードナビゲーションが正しく機能すること', () => {
    const onProjectClick = vi.fn();
    const onProjectDelete = vi.fn();
    render(
      <ProjectList
        projects={mockProjects}
        onProjectClick={onProjectClick}
        onProjectDelete={onProjectDelete}
      />
    );

    const projectLink = screen.getByText('プロジェクト1');
    expect(projectLink).toHaveAttribute('tabindex', '0');

    const deleteButton = screen.getByTestId('delete-button-1');
    expect(deleteButton).toHaveAttribute('tabindex', '0');
    expect(deleteButton).toHaveAttribute('aria-label', 'プロジェクト1を削除');
  });
}); 