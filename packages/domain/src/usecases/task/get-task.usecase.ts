import { Task, TaskWithSubtasks } from '../../entities/task';
import { TaskRepository } from '../../repositories/task.repository';

export class GetTaskUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  /**
   * タスクを取得する
   * @param id タスクID
   * @returns タスク
   */
  async execute(id: string): Promise<Task> {
    const task = await this.taskRepository.findById(id);
    if (!task) {
      throw new Error('タスクが見つかりません');
    }

    return task;
  }

  /**
   * サブタスクを含むタスクを取得する
   * @param id タスクID
   * @returns サブタスクを含むタスク
   */
  async executeWithSubtasks(id: string): Promise<TaskWithSubtasks> {
    const task = await this.taskRepository.findWithSubtasks(id);
    if (!task) {
      throw new Error('タスクが見つかりません');
    }

    return task;
  }
}
