import { Project, UpdateProjectInput } from '../../entities/project';
import { ProjectRepository } from '../../repositories/project.repository';

export class UpdateProjectUseCase {
  constructor(private readonly projectRepository: ProjectRepository) {}

  /**
   * プロジェクトを更新する
   * @param id プロジェクトID
   * @param input プロジェクト更新の入力
   * @returns 更新されたプロジェクト
   */
  async execute(id: string, input: UpdateProjectInput): Promise<Project> {
    // プロジェクトの存在確認
    const existingProject = await this.projectRepository.findById(id);
    if (!existingProject) {
      throw new Error('プロジェクトが見つかりません');
    }

    // プロジェクトの更新
    const updatedProject = await this.projectRepository.update(id, input);

    return updatedProject;
  }
}
