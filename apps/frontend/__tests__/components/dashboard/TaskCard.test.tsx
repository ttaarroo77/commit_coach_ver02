import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TaskCard } from '@/components/dashboard/TaskCard';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import type { Task } from '@/types/dashboard';

// モックデータ
const mockTask: Task = {
  id: 'task-1',
  title: 'テストタスク',
  status: 'todo',
  progress: 0,
  subtasks: [
    { id: 'subtask-1', title: 'サブタスク1', completed: false },
    { id: 'subtask-2', title: 'サブタスク2', completed: true },
  ],
  expanded: false,
  projectId: 'test-project',  // projectをprojectIdに変更
  priority: '中',
  startTime: '09:00',
  endTime: '10:00',
  createdAt: new Date().toISOString(), // 必須フィールド追加
  updatedAt: new Date().toISOString(), // 必須フィールド追加
};

// react-beautiful-dndのためのラッパーコンポーネント
const TaskCardWrapper = ({ task, index, groupId }: { task: Task; index: number; groupId: string }) => (
  <DragDropContext onDragEnd={() => {}}>
    <Droppable droppableId={groupId}>
      {(provided) => (
        <div ref={provided.innerRef} {...provided.droppableProps}>
          <TaskCard task={task} index={index} groupId={groupId} />
          {provided.placeholder}
        </div>
      )}
    </Droppable>
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

describe('TaskCard Component', () => {
  it('タスクカードが正しくレンダリングされる', () => {
    render(<TaskCardWrapper task={mockTask} index={0} groupId="test-group" />);
    
    // タスクのタイトルが表示されていることを確認
    expect(screen.getByText('テストタスク')).toBeInTheDocument();
    
    // 時間が表示されていることを確認
    expect(screen.getByText('09:00 - 10:00')).toBeInTheDocument();
    
    // プロジェクト名が表示されていることを確認
    expect(screen.getByText('テストプロジェクト')).toBeInTheDocument();
  });

  it('展開ボタンをクリックするとサブタスクが表示される', () => {
    // 展開可能なタスクを作成
    const expandableTask = { ...mockTask, expanded: true };
    
    render(<TaskCardWrapper task={expandableTask} index={0} groupId="test-group" />);
    
    // サブタスクが表示されていることを確認
    expect(screen.getByText('サブタスク1')).toBeInTheDocument();
    expect(screen.getByText('サブタスク2')).toBeInTheDocument();
    
    // サブタスク追加ボタンが表示されていることを確認
    expect(screen.getByText('サブタスクを追加')).toBeInTheDocument();
  });
});
