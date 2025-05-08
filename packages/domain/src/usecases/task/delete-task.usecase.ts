import { TaskRepository } from '../../repositories/task.repository';

export class DeleteTaskUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  /**
   * タスクを削除する
   * @param id タスクID
   */
  async execute(id: string): Promise<void> {
    // タスクの存在確認
    const existingTask = await this.taskRepository.findById(id);
    if (!existingTask) {
      throw new Error('タスクが見つかりません');
    }

    // タスクの削除
    await this.taskRepository.delete(id);
  }
}
