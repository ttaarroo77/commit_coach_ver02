import { Project, ProjectWithStats } from '../../entities/project';
import { ProjectRepository } from '../../repositories/project.repository';

export class GetProjectUseCase {
  constructor(private readonly projectRepository: ProjectRepository) {}

  /**
   * プロジェクトを取得する
   * @param id プロジェクトID
   * @returns プロジェクト
   */
  async execute(id: string): Promise<Project> {
    const project = await this.projectRepository.findById(id);
    if (!project) {
      throw new Error('プロジェクトが見つかりません');
    }

    return project;
  }

  /**
   * すべてのプロジェクトを取得する
   * @returns プロジェクトの配列
   */
  async executeAll(): Promise<Project[]> {
    return this.projectRepository.findAll();
  }

  /**
   * タスク統計情報を含むプロジェクトを取得する
   * @param id プロジェクトID
   * @returns タスク統計情報を含むプロジェクト
   */
  async executeWithStats(id: string): Promise<ProjectWithStats> {
    const project = await this.projectRepository.findWithStats(id);
    if (!project) {
      throw new Error('プロジェクトが見つかりません');
    }

    return project;
  }
}
