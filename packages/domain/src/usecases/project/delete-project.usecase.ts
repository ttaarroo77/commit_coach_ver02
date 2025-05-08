import { ProjectRepository } from '../../repositories/project.repository';

export class DeleteProjectUseCase {
  constructor(private readonly projectRepository: ProjectRepository) {}

  /**
   * プロジェクトを削除する
   * @param id プロジェクトID
   */
  async execute(id: string): Promise<void> {
    // プロジェクトの存在確認
    const existingProject = await this.projectRepository.findById(id);
    if (!existingProject) {
      throw new Error('プロジェクトが見つかりません');
    }

    // プロジェクトの削除
    await this.projectRepository.delete(id);
  }
}
