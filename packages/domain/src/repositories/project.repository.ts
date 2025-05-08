import { Project, CreateProjectInput, UpdateProjectInput, ProjectWithStats } from '../entities/project';

export interface ProjectRepository {
  /**
   * プロジェクトを作成する
   */
  create(input: CreateProjectInput): Promise<Project>;

  /**
   * プロジェクトを更新する
   */
  update(id: string, input: UpdateProjectInput): Promise<Project>;

  /**
   * プロジェクトを削除する
   */
  delete(id: string): Promise<void>;

  /**
   * プロジェクトを取得する
   */
  findById(id: string): Promise<Project | null>;

  /**
   * すべてのプロジェクトを取得する
   */
  findAll(): Promise<Project[]>;

  /**
   * タスク統計情報を含むプロジェクトを取得する
   */
  findWithStats(id: string): Promise<ProjectWithStats | null>;

  /**
   * プロジェクトのステータスを更新する
   */
  updateStatus(id: string, status: Project['status']): Promise<Project>;

  /**
   * プロジェクトのタイプを更新する
   */
  updateType(id: string, type: Project['type']): Promise<Project>;
}
