import { render, screen, fireEvent } from '@testing-library/react';
import { TaskForm } from '@/components/projects/task-form-modal';
import { useProjectTasks } from '@/hooks/useProjectTasks';

jest.mock('@/hooks/useProjectTasks');

describe('TaskForm', () => {
  const mockCreateTask = jest.fn();

  beforeEach(() => {
    (useProjectTasks as jest.Mock).mockReturnValue({
      createTask: mockCreateTask,
    });
  });

  it('フォームが正しくレンダリングされること', () => {
    render(<TaskForm projectId="1" />);

    expect(screen.getByLabelText('タイトル')).toBeInTheDocument();
    expect(screen.getByLabelText('説明')).toBeInTheDocument();
    expect(screen.getByLabelText('優先度')).toBeInTheDocument();
    expect(screen.getByLabelText('期限')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '保存' })).toBeInTheDocument();
  });

  it('バリデーションエラーが表示されること', async () => {
    render(<TaskForm projectId="1" />);

    const submitButton = screen.getByRole('button', { name: '保存' });
    fireEvent.click(submitButton);

    expect(screen.getByText('タイトルを入力してください')).toBeInTheDocument();
    expect(screen.getByText('説明を入力してください')).toBeInTheDocument();
    expect(screen.getByText('優先度を選択してください')).toBeInTheDocument();
    expect(screen.getByText('期限を入力してください')).toBeInTheDocument();
  });

  it('タスクが正しく作成されること', async () => {
    render(<TaskForm projectId="1" />);

    const titleInput = screen.getByLabelText('タイトル');
    const descriptionInput = screen.getByLabelText('説明');
    const prioritySelect = screen.getByLabelText('優先度');
    const dueDateInput = screen.getByLabelText('期限');

    fireEvent.change(titleInput, { target: { value: '新しいタスク' } });
    fireEvent.change(descriptionInput, { target: { value: '新しいタスクの説明' } });
    fireEvent.change(prioritySelect, { target: { value: 'high' } });
    fireEvent.change(dueDateInput, { target: { value: '2024-03-01' } });

    const submitButton = screen.getByRole('button', { name: '保存' });
    fireEvent.click(submitButton);

    expect(mockCreateTask).toHaveBeenCalledWith({
      title: '新しいタスク',
      description: '新しいタスクの説明',
      status: 'todo',
      priority: 'high',
      dueDate: '2024-03-01',
      projectId: '1',
    });
  });

  it('フォームのキャンセルが正しく動作すること', () => {
    const onCancel = jest.fn();
    render(<TaskForm projectId="1" onCancel={onCancel} />);

    const cancelButton = screen.getByRole('button', { name: 'キャンセル' });
    fireEvent.click(cancelButton);

    expect(onCancel).toHaveBeenCalled();
  });

  it('初期値が正しく設定されること', () => {
    const initialValues = {
      title: '初期タイトル',
      description: '初期説明',
      priority: 'medium',
      dueDate: '2024-03-01',
    };

    render(<TaskForm projectId="1" initialValues={initialValues} />);

    expect(screen.getByLabelText('タイトル')).toHaveValue(initialValues.title);
    expect(screen.getByLabelText('説明')).toHaveValue(initialValues.description);
    expect(screen.getByLabelText('優先度')).toHaveValue(initialValues.priority);
    expect(screen.getByLabelText('期限')).toHaveValue(initialValues.dueDate);
  });
}); 