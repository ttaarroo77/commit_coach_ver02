import { Task, CreateTaskInput } from '../../entities/task';
import { TaskRepository } from '../../repositories/task.repository';

export class CreateTaskUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  /**
   * タスクを作成する
   * @param input タスク作成の入力
   * @returns 作成されたタスク
   */
  async execute(input: CreateTaskInput): Promise<Task> {
    // バリデーション
    if (!input.title) {
      throw new Error('タスクのタイトルは必須です');
    }

    if (!input.projectId) {
      throw new Error('プロジェクトIDは必須です');
    }

    // タスクの作成
    const task = await this.taskRepository.create(input);

    return task;
  }
}
