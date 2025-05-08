import { Task, CreateTaskInput, UpdateTaskInput, TaskWithSubtasks } from '../entities/task';

export interface TaskRepository {
  /**
   * タスクを作成する
   */
  create(input: CreateTaskInput): Promise<Task>;

  /**
   * タスクを更新する
   */
  update(id: string, input: UpdateTaskInput): Promise<Task>;

  /**
   * タスクを削除する
   */
  delete(id: string): Promise<void>;

  /**
   * タスクを取得する
   */
  findById(id: string): Promise<Task | null>;

  /**
   * プロジェクトに属するタスクを取得する
   */
  findByProjectId(projectId: string): Promise<Task[]>;

  /**
   * サブタスクを含むタスクを取得する
   */
  findWithSubtasks(id: string): Promise<TaskWithSubtasks | null>;

  /**
   * タスクのステータスを更新する
   */
  updateStatus(id: string, status: Task['status']): Promise<Task>;

  /**
   * タスクの優先度を更新する
   */
  updatePriority(id: string, priority: Task['priority']): Promise<Task>;
}
