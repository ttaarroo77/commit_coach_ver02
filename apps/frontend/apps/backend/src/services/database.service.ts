import { supabaseAdmin, supabaseClient, createSupabaseClientWithToken } from '../utils/supabase';
import logger, { logDbOperation } from '../utils/logger';

/**
 * データベースサービス
 * Supabaseとのやり取りを抽象化し、一貫したデータアクセスを提供する
 */
class DatabaseService {
  /**
   * 指定したテーブルからデータを取得する
   * @param table テーブル名
   * @param query クエリパラメータ（オプション）
   * @param userToken ユーザートークン（オプション）
   * @returns 取得したデータと発生したエラー
   */
  async select(table: string, query: any = {}, userToken?: string) {
    try {
      const client = userToken ? createSupabaseClientWithToken(userToken) : supabaseClient;

      let queryBuilder = client.from(table).select('*');

      // フィルタリング
      if (query.filters) {
        for (const [key, value] of Object.entries(query.filters)) {
          queryBuilder = queryBuilder.eq(key, value);
        }
      }

      // 並び替え
      if (query.orderBy) {
        queryBuilder = queryBuilder.order(query.orderBy.column, {
          ascending: query.orderBy.ascending,
        });
      }

      // ページネーション
      if (query.limit) {
        queryBuilder = queryBuilder.limit(query.limit);
      }

      if (query.offset) {
        queryBuilder = queryBuilder.range(query.offset, query.offset + (query.limit || 10) - 1);
      }

      const { data, error } = await queryBuilder;

      logDbOperation('select', table, {
        success: !error,
        filters: query.filters,
        count: data?.length || 0,
      });

      return { data, error };
    } catch (error) {
      logger.error({ error, table, operation: 'select' }, 'データベース操作エラー');
      return { data: null, error };
    }
  }

  /**
   * 指定したテーブルに新しいレコードを挿入する
   * @param table テーブル名
   * @param data 挿入するデータ
   * @param userToken ユーザートークン（オプション）
   * @returns 挿入したデータと発生したエラー
   */
  async insert(table: string, data: any, userToken?: string) {
    try {
      const client = userToken ? createSupabaseClientWithToken(userToken) : supabaseClient;

      const { data: insertedData, error } = await client.from(table).insert(data).select();

      logDbOperation('insert', table, {
        success: !error,
        id: insertedData?.[0]?.id,
      });

      return { data: insertedData, error };
    } catch (error) {
      logger.error({ error, table, operation: 'insert' }, 'データベース操作エラー');
      return { data: null, error };
    }
  }

  /**
   * 指定したテーブルの既存レコードを更新する
   * @param table テーブル名
   * @param id 更新するレコードのID
   * @param data 更新するデータ
   * @param userToken ユーザートークン（オプション）
   * @returns 更新したデータと発生したエラー
   */
  async update(table: string, id: string, data: any, userToken?: string) {
    try {
      const client = userToken ? createSupabaseClientWithToken(userToken) : supabaseClient;

      const { data: updatedData, error } = await client
        .from(table)
        .update(data)
        .eq('id', id)
        .select();

      logDbOperation('update', table, {
        success: !error,
        id,
      });

      return { data: updatedData, error };
    } catch (error) {
      logger.error({ error, table, operation: 'update' }, 'データベース操作エラー');
      return { data: null, error };
    }
  }

  /**
   * 指定したテーブルのレコードを削除する
   * @param table テーブル名
   * @param id 削除するレコードのID
   * @param userToken ユーザートークン（オプション）
   * @returns 削除操作の結果と発生したエラー
   */
  async delete(table: string, id: string, userToken?: string) {
    try {
      const client = userToken ? createSupabaseClientWithToken(userToken) : supabaseClient;

      const { data, error } = await client.from(table).delete().eq('id', id);

      logDbOperation('delete', table, {
        success: !error,
        id,
      });

      return { data, error };
    } catch (error) {
      logger.error({ error, table, operation: 'delete' }, 'データベース操作エラー');
      return { data: null, error };
    }
  }

  /**
   * SupabaseのRPC関数を呼び出す
   * @param functionName 関数名
   * @param params 関数に渡すパラメータ
   * @param userToken ユーザートークン（オプション）
   * @returns RPC呼び出しの結果と発生したエラー
   */
  async rpc(functionName: string, params: any = {}, userToken?: string) {
    try {
      const client = userToken ? createSupabaseClientWithToken(userToken) : supabaseClient;

      const { data, error } = await client.rpc(functionName, params);

      logDbOperation('rpc', functionName, {
        success: !error,
        params,
      });

      return { data, error };
    } catch (error) {
      logger.error({ error, functionName, operation: 'rpc' }, 'RPC呼び出しエラー');
      return { data: null, error };
    }
  }

  /**
   * 管理者権限でデータベース操作を実行する
   * 注意: このメソッドはRLSを迂回するため、バックエンドでのみ使用すること
   * @returns 管理者権限を持つデータベースサービスのインスタンス
   */
  admin() {
    return {
      select: async (table: string, query: any = {}) => {
        try {
          let queryBuilder = supabaseAdmin.from(table).select('*');

          // フィルタリング
          if (query.filters) {
            for (const [key, value] of Object.entries(query.filters)) {
              queryBuilder = queryBuilder.eq(key, value);
            }
          }

          // 並び替え
          if (query.orderBy) {
            queryBuilder = queryBuilder.order(query.orderBy.column, {
              ascending: query.orderBy.ascending,
            });
          }

          // ページネーション
          if (query.limit) {
            queryBuilder = queryBuilder.limit(query.limit);
          }

          if (query.offset) {
            queryBuilder = queryBuilder.range(query.offset, query.offset + (query.limit || 10) - 1);
          }

          const { data, error } = await queryBuilder;

          logDbOperation('select_admin', table, {
            success: !error,
            filters: query.filters,
            count: data?.length || 0,
          });

          return { data, error };
        } catch (error) {
          logger.error({ error, table, operation: 'select_admin' }, 'データベース操作エラー');
          return { data: null, error };
        }
      },

      insert: async (table: string, data: any) => {
        try {
          const { data: insertedData, error } = await supabaseAdmin
            .from(table)
            .insert(data)
            .select();

          logDbOperation('insert_admin', table, {
            success: !error,
            id: insertedData?.[0]?.id,
          });

          return { data: insertedData, error };
        } catch (error) {
          logger.error({ error, table, operation: 'insert_admin' }, 'データベース操作エラー');
          return { data: null, error };
        }
      },

      update: async (table: string, id: string, data: any) => {
        try {
          const { data: updatedData, error } = await supabaseAdmin
            .from(table)
            .update(data)
            .eq('id', id)
            .select();

          logDbOperation('update_admin', table, {
            success: !error,
            id,
          });

          return { data: updatedData, error };
        } catch (error) {
          logger.error({ error, table, operation: 'update_admin' }, 'データベース操作エラー');
          return { data: null, error };
        }
      },

      delete: async (table: string, id: string) => {
        try {
          const { data, error } = await supabaseAdmin.from(table).delete().eq('id', id);

          logDbOperation('delete_admin', table, {
            success: !error,
            id,
          });

          return { data, error };
        } catch (error) {
          logger.error({ error, table, operation: 'delete_admin' }, 'データベース操作エラー');
          return { data: null, error };
        }
      },
    };
  }
}

export const dbService = new DatabaseService();
export default dbService;
