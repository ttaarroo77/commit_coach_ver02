import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ProjectList from '../../components/ProjectList';

describe('ProjectList Performance Tests', () => {
  const generateMockProjects = (count: number) => {
    return Array.from({ length: count }, (_, i) => ({
      id: `${i + 1}`,
      name: `プロジェクト${i + 1}`,
      description: `プロジェクト${i + 1}の説明`,
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-02T00:00:00Z',
    }));
  };

  it('大量のプロジェクトを表示した際のレンダリングパフォーマンス', () => {
    const mockProjects = generateMockProjects(1000);
    const onProjectClick = vi.fn();
    const onProjectDelete = vi.fn();

    const startTime = performance.now();
    render(
      <ProjectList
        projects={mockProjects}
        onProjectClick={onProjectClick}
        onProjectDelete={onProjectDelete}
      />
    );
    const endTime = performance.now();

    // レンダリング時間が500ms以内であることを確認
    expect(endTime - startTime).toBeLessThan(500);
  });

  it('プロジェクトの検索パフォーマンス', () => {
    const mockProjects = generateMockProjects(100);
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
    const startTime = performance.now();
    fireEvent.change(searchInput, { target: { value: 'プロジェクト1' } });
    const endTime = performance.now();

    // 検索操作の時間が100ms以内であることを確認
    expect(endTime - startTime).toBeLessThan(100);
  });

  it('プロジェクトのページネーションパフォーマンス', () => {
    const mockProjects = generateMockProjects(100);
    const onProjectClick = vi.fn();
    const onProjectDelete = vi.fn();

    render(
      <ProjectList
        projects={mockProjects}
        onProjectClick={onProjectClick}
        onProjectDelete={onProjectDelete}
      />
    );

    const nextPageButton = screen.getByTestId('next-page-button');
    const startTime = performance.now();
    fireEvent.click(nextPageButton);
    const endTime = performance.now();

    // ページ切り替えの時間が50ms以内であることを確認
    expect(endTime - startTime).toBeLessThan(50);
  });
}); 