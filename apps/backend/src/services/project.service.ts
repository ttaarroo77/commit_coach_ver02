import { createClient } from '@supabase/supabase-js';
import { Project, UpdateProject } from '../types/project.types';
import { ApiError } from '../middleware/errorHandler';

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_ANON_KEY || ''
);

export class ProjectService {
  /**
   * 新しいプロジェクトを作成する
   * @param userId ユーザーID
   * @param projectData プロジェクトデータ
   * @returns 作成されたプロジェクト
   */
  async createProject(userId: string, projectData: Omit<Project, 'user_id' | 'id' | 'created_at' | 'updated_at'>) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert({
          ...projectData,
          user_id: userId
        })
        .select()
        .single();

      if (error) throw new ApiError(500, `プロジェクト作成エラー: ${error.message}`);
      return data;
    } catch (error) {
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
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          throw new ApiError(404, 'プロジェクトが見つかりません');
        }
        throw new ApiError(500, `プロジェクト取得エラー: ${error.message}`);
      }
      return data;
    } catch (error) {
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
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw new ApiError(500, `プロジェクト一覧取得エラー: ${error.message}`);
      return data || [];
    } catch (error) {
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
      const { data, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', id)
        .eq('user_id', userId) // ユーザーIDでも絞り込み（所有権チェック）
        .select()
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          throw new ApiError(404, 'プロジェクトが見つかりません');
        }
        throw new ApiError(500, `プロジェクト更新エラー: ${error.message}`);
      }
      return data;
    } catch (error) {
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
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id)
        .eq('user_id', userId); // ユーザーIDでも絞り込み（所有権チェック）

      if (error) {
        if (error.code === 'PGRST116') {
          throw new ApiError(404, 'プロジェクトが見つかりません');
        }
        throw new ApiError(500, `プロジェクト削除エラー: ${error.message}`);
      }
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'プロジェクト削除中に予期せぬエラーが発生しました');
    }
  }

  async addMember(projectId: string, userId: string) {
    const { data, error } = await supabase
      .from('projects')
      .update({
        members: supabase.raw('array_append(members, ?)', [userId])
      })
      .eq('id', projectId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async removeMember(projectId: string, userId: string) {
    const { data, error } = await supabase
      .from('projects')
      .update({
        members: supabase.raw('array_remove(members, ?)', [userId])
      })
      .eq('id', projectId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
} 