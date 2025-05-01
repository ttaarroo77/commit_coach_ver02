import { render, screen, fireEvent } from '@testing-library/react';
import { TaskFilter } from '@/components/projects/task-filters';

describe('TaskFilter', () => {
  const mockOnFilterChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('フィルターコンポーネントが正しくレンダリングされること', () => {
    render(<TaskFilter onFilterChange={mockOnFilterChange} />);

    expect(screen.getByLabelText('ステータス')).toBeInTheDocument();
    expect(screen.getByLabelText('優先度')).toBeInTheDocument();
    expect(screen.getByLabelText('期限')).toBeInTheDocument();
  });

  it('ステータスフィルターが正しく動作すること', () => {
    render(<TaskFilter onFilterChange={mockOnFilterChange} />);

    const statusSelect = screen.getByLabelText('ステータス');
    fireEvent.change(statusSelect, { target: { value: 'in_progress' } });

    expect(mockOnFilterChange).toHaveBeenCalledWith({
      status: 'in_progress',
      priority: '',
      dueDate: '',
    });
  });

  it('優先度フィルターが正しく動作すること', () => {
    render(<TaskFilter onFilterChange={mockOnFilterChange} />);

    const prioritySelect = screen.getByLabelText('優先度');
    fireEvent.change(prioritySelect, { target: { value: 'high' } });

    expect(mockOnFilterChange).toHaveBeenCalledWith({
      status: '',
      priority: 'high',
      dueDate: '',
    });
  });

  it('期限フィルターが正しく動作すること', () => {
    render(<TaskFilter onFilterChange={mockOnFilterChange} />);

    const dueDateInput = screen.getByLabelText('期限');
    fireEvent.change(dueDateInput, { target: { value: '2024-03-01' } });

    expect(mockOnFilterChange).toHaveBeenCalledWith({
      status: '',
      priority: '',
      dueDate: '2024-03-01',
    });
  });

  it('複数のフィルターが同時に適用できること', () => {
    render(<TaskFilter onFilterChange={mockOnFilterChange} />);

    const statusSelect = screen.getByLabelText('ステータス');
    const prioritySelect = screen.getByLabelText('優先度');
    const dueDateInput = screen.getByLabelText('期限');

    fireEvent.change(statusSelect, { target: { value: 'in_progress' } });
    fireEvent.change(prioritySelect, { target: { value: 'high' } });
    fireEvent.change(dueDateInput, { target: { value: '2024-03-01' } });

    expect(mockOnFilterChange).toHaveBeenCalledWith({
      status: 'in_progress',
      priority: 'high',
      dueDate: '2024-03-01',
    });
  });

  it('フィルターのリセットが正しく動作すること', () => {
    render(<TaskFilter onFilterChange={mockOnFilterChange} />);

    const resetButton = screen.getByRole('button', { name: 'フィルターをリセット' });
    fireEvent.click(resetButton);

    expect(mockOnFilterChange).toHaveBeenCalledWith({
      status: '',
      priority: '',
      dueDate: '',
    });
  });
}); 