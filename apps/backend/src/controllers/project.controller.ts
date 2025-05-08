import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin, supabaseAnon } from '../config/supabase';
import { ApiError } from '../middleware/errorHandler';
import { ProjectService } from '../services/project.service';
import { projectSchema, updateProjectSchema } from '../types/project.types';
import { z } from 'zod';
import { CreateProjectUseCase, UpdateProjectUseCase, DeleteProjectUseCase, GetProjectUseCase } from '@commit-coach/domain/usecases/project';
import { CreateProjectInput, UpdateProjectInput } from '@commit-coach/domain/entities/project';

const projectService = new ProjectService();

// config/supabase.tsから初期化済みのクライアントを使用
const supabase = supabaseAnon;

// プロジェクト作成のバリデーションスキーマ
const createProjectSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/)
    .optional(),
});

export class ProjectController {
  constructor(
    private readonly createProjectUseCase: CreateProjectUseCase,
    private readonly updateProjectUseCase: UpdateProjectUseCase,
    private readonly deleteProjectUseCase: DeleteProjectUseCase,
    private readonly getProjectUseCase: GetProjectUseCase,
  ) {}

  /**
   * プロジェクトを作成する
   */
  async create(req: Request, res: Response): Promise<void> {
    try {
      const input: CreateProjectInput = req.body;
      const project = await this.createProjectUseCase.execute(input);
      res.status(201).json(project);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  /**
   * プロジェクトを更新する
   */
  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const input: UpdateProjectInput = req.body;
      const project = await this.updateProjectUseCase.execute(id, input);
      res.json(project);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  /**
   * プロジェクトを削除する
   */
  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.deleteProjectUseCase.execute(id);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  /**
   * プロジェクトを取得する
   */
  async get(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const project = await this.getProjectUseCase.execute(id);
      res.json(project);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  /**
   * すべてのプロジェクトを取得する
   */
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const projects = await this.getProjectUseCase.executeAll();
      res.json(projects);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  /**
   * タスク統計情報を含むプロジェクトを取得する
   */
  async getWithStats(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const project = await this.getProjectUseCase.executeWithStats(id);
      res.json(project);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  /**
   * プロジェクトのステータスを更新する
   */
  async updateStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const project = await this.getProjectUseCase.executeUpdateStatus(id, status);
      res.json(project);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  /**
   * プロジェクトのタイプを更新する
   */
  async updateType(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { type } = req.body;
      const project = await this.getProjectUseCase.executeUpdateType(id, type);
      res.json(project);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

/**
 * プロジェクト一覧を取得
 */
export const getProjects = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new ApiError(401, '認証が必要です');
    }

    const projects = await projectService.getProjectsByOwner(userId);
    res.json(projects);
  } catch (error) {
    throw error;
  }
};

/**
 * 特定のプロジェクトを取得
 */
export const getProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    const projectId = req.params.id;

    if (!userId) {
      throw new ApiError(401, '認証が必要です');
    }

    const project = await projectService.getProjectById(projectId);
    if (!project) {
      throw new ApiError(404, 'プロジェクトが見つかりません');
    }
    res.json(project);
  } catch (error) {
    throw error;
  }
};

/**
 * 新しいプロジェクトを作成
 */
export const createProject = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new ApiError(401, '認証が必要です');
    }

    const validatedData = createProjectSchema.parse(req.body);

    const { data, error } = await supabase
      .from('projects')
      .insert({
        ...validatedData,
        user_id: userId,
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ApiError(400, 'バリデーションエラー', error);
    }
    throw error;
  }
};

/**
 * プロジェクトを更新
 */
export const updateProject = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const projectId = req.params.id;

    if (!userId) {
      throw new ApiError(401, '認証が必要です');
    }

    const validatedData = createProjectSchema.partial().parse(req.body);

    const { data, error } = await supabase
      .from('projects')
      .update(validatedData)
      .eq('id', projectId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new ApiError(404, 'プロジェクトが見つかりません');
      }
      throw error;
    }

    res.json(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ApiError(400, 'バリデーションエラー', error);
    }
    throw error;
  }
};

/**
 * プロジェクトを削除
 */
export const deleteProject = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const projectId = req.params.id;

    if (!userId) {
      throw new ApiError(401, '認証が必要です');
    }

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId)
      .eq('user_id', userId);

    if (error) {
      if (error.code === 'PGRST116') {
        throw new ApiError(404, 'プロジェクトが見つかりません');
      }
      throw error;
    }

    res.status(204).send();
  } catch (error) {
    throw error;
  }
};

/**
 * プロジェクトにメンバーを追加
 */
export const addMember = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    const project = await projectService.addMember(req.params.id, userId);
    res.json(project);
  } catch (error) {
    throw new ApiError(400, 'メンバーの追加に失敗しました');
  }
};

/**
 * プロジェクトからメンバーを削除
 */
export const removeMember = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    const project = await projectService.removeMember(req.params.id, userId);
    res.json(project);
  } catch (error) {
    throw new ApiError(400, 'メンバーの削除に失敗しました');
  }
};

/**
 * プロジェクトメンバーの一覧を取得
 */
export const getProjectMembers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    // プロジェクトメンバー情報を取得
    const { data, error } = await supabaseAdmin
      .from('project_members')
      .select('user_id, role, users!inner(id, email, name, avatar_url)')
      .eq('project_id', id);

    if (error) {
      throw new ApiError(500, error.message);
    }

    // 整形したメンバー情報
    const formattedMembers = data?.map((member) => ({
      id: member.user_id,
      role: member.role,
      ...member.users,
    }));

    res.status(200).json({
      status: 'success',
      data: formattedMembers,
    });
  } catch (error) {
    next(error);
  }
};
