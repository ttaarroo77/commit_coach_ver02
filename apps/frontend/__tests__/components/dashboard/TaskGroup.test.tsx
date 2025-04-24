import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TaskGroup } from '@/components/dashboard/TaskGroup';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import type { TaskGroup as TaskGroupType } from '@/types/dashboard';

// モックデータ
const mockTaskGroup: TaskGroupType = {
  id: 'test-group',
  title: 'テストグループ',
  expanded: true,
  completed: false,
  tasks: [
    {
      id: 'task-1',
      title: 'テストタスク1',
      status: 'todo',
      progress: 0,
      subtasks: [],
      expanded: false,
      projectId: 'test-project',
      priority: 'medium',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'task-2',
      title: 'テストタスク2',
      status: 'in-progress',
      progress: 50,
      subtasks: [],
      expanded: false,
      projectId: 'test-project',
      priority: 'high',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
};

// react-beautiful-dndのためのラッパーコンポーネント
const TaskGroupWrapper = ({ group }: { group: TaskGroupType }) => (
  <DragDropContext onDragEnd={() => {}}>
    <TaskGroup
      group={group}
      onToggleGroup={() => {}}
      onDeleteTask={() => {}}
      onAddTask={() => {}}
      onUpdateGroupTitle={() => {}}
      onSortTasks={() => {}}
      sortOrder="none"
    />
  </DragDropContext>
);

// react-beautiful-dndのモック
jest.mock('react-beautiful-dnd', () => ({
  DragDropContext: ({ children }: { children: React.ReactNode }) => children,
  Droppable: ({ children }: { children: Function }) => children({
    droppableProps: {
      'data-rbd-droppable-id': 'test-droppable',
      'data-rbd-droppable-context-id': '123',
    },
    innerRef: jest.fn(),
    placeholder: null,
  }),
  Draggable: ({ children }: { children: Function }) => children({
    draggableProps: {
      'data-rbd-draggable-context-id': '123',
      'data-rbd-draggable-id': 'test-draggable',
    },
    innerRef: jest.fn(),
    dragHandleProps: {
      'data-rbd-drag-handle-draggable-id': 'test-draggable',
      'data-rbd-drag-handle-context-id': '123',
      role: 'button',
      'aria-labelledby': 'test',
      tabIndex: 0,
      draggable: false,
      onDragStart: jest.fn(),
    },
  }),
}));

describe('TaskGroup Component', () => {
  it('タスクグループが正しくレンダリングされる', () => {
    render(<TaskGroupWrapper group={mockTaskGroup} />);
    
    // グループのタイトルが表示されていることを確認
    expect(screen.getByText('テストグループ')).toBeInTheDocument();
    
    // タスクが表示されていることを確認
    expect(screen.getByText('テストタスク1')).toBeInTheDocument();
    expect(screen.getByText('テストタスク2')).toBeInTheDocument();
  });

  it('折りたたまれたグループではタスクが表示されない', () => {
    // 折りたたまれたグループを作成
    const collapsedGroup = { ...mockTaskGroup, expanded: false };
    
    render(<TaskGroupWrapper group={collapsedGroup} />);
    
    // グループのタイトルは表示されていることを確認
    expect(screen.getByText('テストグループ')).toBeInTheDocument();
    
    // タスクは表示されていないことを確認
    expect(screen.queryByText('テストタスク1')).not.toBeInTheDocument();
    expect(screen.queryByText('テストタスク2')).not.toBeInTheDocument();
  });
});
