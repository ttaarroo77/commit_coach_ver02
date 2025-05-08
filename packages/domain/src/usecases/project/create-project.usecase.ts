import { Project, CreateProjectInput } from '../../entities/project';
import { ProjectRepository } from '../../repositories/project.repository';

export class CreateProjectUseCase {
  constructor(private readonly projectRepository: ProjectRepository) {}

  /**
   * プロジェクトを作成する
   * @param input プロジェクト作成の入力
   * @returns 作成されたプロジェクト
   */
  async execute(input: CreateProjectInput): Promise<Project> {
    // バリデーション
    if (!input.name) {
      throw new Error('プロジェクト名は必須です');
    }

    if (!input.type) {
      throw new Error('プロジェクトタイプは必須です');
    }

    if (!input.status) {
      throw new Error('プロジェクトステータスは必須です');
    }

    // プロジェクトの作成
    const project = await this.projectRepository.create(input);

    return project;
  }
}
