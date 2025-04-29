import { render, screen, fireEvent } from "@testing-library/react";
import { TaskMenu } from "../../../components/projects/task-menu";

describe("TaskMenu", () => {
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("メニューボタンをクリックするとドロップダウンが表示される", () => {
    render(<TaskMenu onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    const menuButton = screen.getByRole("button");
    fireEvent.click(menuButton);

    expect(screen.getByText("編集")).toBeInTheDocument();
    expect(screen.getByText("削除")).toBeInTheDocument();
  });

  it("編集メニューをクリックするとonEdit関数が呼ばれる", () => {
    render(<TaskMenu onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    const menuButton = screen.getByRole("button");
    fireEvent.click(menuButton);

    const editButton = screen.getByText("編集");
    fireEvent.click(editButton);

    expect(mockOnEdit).toHaveBeenCalledTimes(1);
  });

  it("削除メニューをクリックするとonDelete関数が呼ばれる", () => {
    render(<TaskMenu onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    const menuButton = screen.getByRole("button");
    fireEvent.click(menuButton);

    const deleteButton = screen.getByText("削除");
    fireEvent.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledTimes(1);
  });
}); 