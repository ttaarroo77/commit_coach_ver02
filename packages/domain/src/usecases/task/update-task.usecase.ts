import { Task, UpdateTaskInput } from '../../entities/task';
import { TaskRepository } from '../../repositories/task.repository';

export class UpdateTaskUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  /**
   * タスクを更新する
   * @param id タスクID
   * @param input タスク更新の入力
   * @returns 更新されたタスク
   */
  async execute(id: string, input: UpdateTaskInput): Promise<Task> {
    // タスクの存在確認
    const existingTask = await this.taskRepository.findById(id);
    if (!existingTask) {
      throw new Error('タスクが見つかりません');
    }

    // タスクの更新
    const updatedTask = await this.taskRepository.update(id, input);

    return updatedTask;
  }
}
