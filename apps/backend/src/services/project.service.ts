import { Project, UpdateProject } from '../types/project.types';
import { ApiError } from '../middleware/errorHandler';
import logger from '../utils/logger';
import dbService from './database.service';

export class ProjectService {
  /**
   * 新しいプロジェクトを作成する
   * @param userId ユーザーID
   * @param projectData プロジェクトデータ
   * @returns 作成されたプロジェクト
   */
  async createProject(
    userId: string,
    projectData: Omit<Project, 'user_id' | 'id' | 'created_at' | 'updated_at'>
  ) {
    try {
      logger.info({ userId, projectData }, 'プロジェクト作成開始');

      const { data, error } = await dbService.insert('projects', {
        ...projectData,
        user_id: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      if (error) {
        logger.error({ error }, 'プロジェクト作成エラー');
        throw new ApiError(500, 'プロジェクトの作成に失敗しました');
      }

      logger.info({ projectId: data?.[0]?.id }, 'プロジェクト作成成功');
      return data?.[0];
    } catch (error) {
      logger.error({ error }, 'プロジェクト作成例外');
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'プロジェクト作成中に予期せぬエラーが発生しました');
    }
  }

  /**
   * プロジェクトIDからプロジェクトを取得する
   * @param id プロジェクトID
   * @returns プロジェクト情報
   */
  async getProjectById(id: string) {
    try {
      logger.info({ projectId: id }, 'プロジェクト取得開始');

      const { data, error } = await dbService.select('projects', {
        filters: { id },
        single: true,
      });

      if (error) {
        logger.error({ error, projectId: id }, 'プロジェクト取得エラー');
        throw new ApiError(500, 'プロジェクトの取得に失敗しました');
      }

      if (!data || (Array.isArray(data) && data.length === 0)) {
        logger.warn({ projectId: id }, 'プロジェクトが見つかりません');
        throw new ApiError(404, 'プロジェクトが見つかりません');
      }

      logger.info({ projectId: id }, 'プロジェクト取得成功');
      return Array.isArray(data) ? data[0] : data;
    } catch (error) {
      logger.error({ error, projectId: id }, 'プロジェクト取得例外');
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'プロジェクト取得中に予期せぬエラーが発生しました');
    }
  }

  /**
   * ユーザーIDに紐づくプロジェクト一覧を取得する
   * @param userId ユーザーID
   * @returns プロジェクト一覧
   */
  async getProjectsByOwner(userId: string) {
    try {
      logger.info({ userId }, 'プロジェクト一覧取得開始');

      const { data, error } = await dbService.select('projects', {
        filters: { user_id: userId },
        orderBy: { column: 'created_at', ascending: false },
      });

      if (error) {
        logger.error({ error, userId }, 'プロジェクト一覧取得エラー');
        throw new ApiError(500, 'プロジェクト一覧の取得に失敗しました');
      }

      logger.info({ userId, count: data?.length || 0 }, 'プロジェクト一覧取得成功');
      return data || [];
    } catch (error) {
      logger.error({ error, userId }, 'プロジェクト一覧取得例外');
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'プロジェクト一覧取得中に予期せぬエラーが発生しました');
    }
  }

  /**
   * プロジェクトを更新する
   * @param id プロジェクトID
   * @param userId ユーザーID
   * @param updates 更新データ
   * @returns 更新されたプロジェクト
   */
  async updateProject(id: string, userId: string, updates: UpdateProject) {
    try {
      logger.info({ projectId: id, userId, updates }, 'プロジェクト更新開始');

      // プロジェクトの存在と所有権を確認
      const { data: projects, error: checkError } = await dbService.select('projects', {
        filters: { id, user_id: userId },
        single: true,
      });

      if (checkError || !projects || (Array.isArray(projects) && projects.length === 0)) {
        logger.error({ error: checkError, projectId: id }, 'プロジェクト確認エラー');
        throw new ApiError(404, 'プロジェクトが見つかりません');
      }

      // プロジェクトを更新
      const { data, error } = await dbService.update('projects', id, {
        ...updates,
        updated_at: new Date().toISOString(),
      });

      if (error) {
        logger.error({ error, projectId: id }, 'プロジェクト更新エラー');
        throw new ApiError(500, 'プロジェクトの更新に失敗しました');
      }

      logger.info({ projectId: id }, 'プロジェクト更新成功');
      return Array.isArray(data) ? data[0] : data;
    } catch (error) {
      logger.error({ error, projectId: id }, 'プロジェクト更新例外');
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'プロジェクト更新中に予期せぬエラーが発生しました');
    }
  }

  /**
   * プロジェクトを削除する
   * @param id プロジェクトID
   * @param userId ユーザーID
   */
  async deleteProject(id: string, userId: string) {
    try {
      logger.info({ projectId: id, userId }, 'プロジェクト削除開始');

      // プロジェクトの存在と所有権を確認
      const { data: projects, error: checkError } = await dbService.select('projects', {
        filters: { id, user_id: userId },
      });

      if (checkError || !projects || projects.length === 0) {
        logger.error({ error: checkError, projectId: id }, 'プロジェクト確認エラー');
        throw new ApiError(404, 'プロジェクトが見つかりません');
      }

      // プロジェクトを削除
      const { error } = await dbService.delete('projects', id);

      if (error) {
        logger.error({ error, projectId: id }, 'プロジェクト削除エラー');
        throw new ApiError(500, 'プロジェクトの削除に失敗しました');
      }

      logger.info({ projectId: id }, 'プロジェクト削除成功');
    } catch (error) {
      logger.error({ error, projectId: id }, 'プロジェクト削除例外');
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'プロジェクト削除中に予期せぬエラーが発生しました');
    }
  }

  async addMember(projectId: string, userId: string) {
    try {
      logger.info({ projectId, userId }, 'プロジェクトメンバー追加開始');

      // プロジェクトの存在確認
      const { data: projects, error: checkError } = await dbService.select('projects', {
        filters: { id: projectId },
      });

      if (checkError || !projects || projects.length === 0) {
        logger.error({ error: checkError }, 'プロジェクト確認エラー');
        throw new ApiError(404, 'プロジェクトが見つかりません');
      }

      // メンバー追加のRPC呼び出し
      const { data, error } = await dbService.rpc('add_project_member', {
        p_project_id: projectId,
        p_user_id: userId,
      });

      if (error) {
        logger.error({ error }, 'メンバー追加エラー');
        throw new ApiError(500, 'メンバーの追加に失敗しました');
      }

      logger.info({ projectId, userId }, 'プロジェクトメンバー追加成功');
      return data;
    } catch (error) {
      logger.error({ error }, 'メンバー追加例外');
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'メンバー追加中に予期せぬエラーが発生しました');
    }
  }

  async removeMember(projectId: string, userId: string) {
    try {
      logger.info({ projectId, userId }, 'プロジェクトメンバー削除開始');

      // プロジェクトの存在確認
      const { data: projects, error: checkError } = await dbService.select('projects', {
        filters: { id: projectId },
      });

      if (checkError || !projects || projects.length === 0) {
        logger.error({ error: checkError }, 'プロジェクト確認エラー');
        throw new ApiError(404, 'プロジェクトが見つかりません');
      }

      // メンバー削除のRPC呼び出し
      const { data, error } = await dbService.rpc('remove_project_member', {
        p_project_id: projectId,
        p_user_id: userId,
      });

      if (error) {
        logger.error({ error }, 'メンバー削除エラー');
        throw new ApiError(500, 'メンバーの削除に失敗しました');
      }

      logger.info({ projectId, userId }, 'プロジェクトメンバー削除成功');
      return data;
    } catch (error) {
      logger.error({ error }, 'メンバー削除例外');
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'メンバー削除中に予期せぬエラーが発生しました');
    }
  }
}
