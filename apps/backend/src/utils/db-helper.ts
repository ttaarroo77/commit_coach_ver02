import { createClient } from '@supabase/supabase-js';
import { logger, logDbOperation } from './logger';
import { ApiError } from '../middleware/errorHandler';

// Supabaseクライアントの作成
const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_ANON_KEY || ''
);

/**
 * データベース操作のラッパー関数
 * エラーハンドリングとロギングを一元化する
 * 
 * @template T - 返却されるデータの型
 * @param {string} operation - 実行する操作の種類（select, insert, update, deleteなど）
 * @param {string} table - 操作対象のテーブル名
 * @param {Function} callback - 実行するデータベース操作を含むコールバック関数
 * @returns {Promise<T>} 操作結果のデータ
 * @throws {ApiError} データベース操作が失敗した場合にスローされるエラー
 */
export async function executeDbOperation<T>(
  operation: string,
  table: string,
  callback: () => Promise<{ data: T | null; error: any }>
): Promise<T> {
  try {
    // 操作開始をログに記録
    logDbOperation(operation, table, { status: 'start' });
    
    // 操作を実行
    const { data, error } = await callback();
    
    // エラーチェック
    if (error) {
      // データベースエラーをログに記録
      logger.error({
        operation,
        table,
        error: {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        }
      }, 'Database operation failed');
      
      // エラーの種類に応じたApiErrorをスロー
      if (error.code === 'PGRST116') {
        throw new ApiError(404, `${table} not found`, error, 'RESOURCE_NOT_FOUND');
      } else if (error.code === '23505') {
        throw new ApiError(409, `Duplicate entry in ${table}`, error, 'DUPLICATE_ENTRY');
      } else if (error.code === '23503') {
        throw new ApiError(400, `Foreign key violation in ${table}`, error, 'FOREIGN_KEY_VIOLATION');
      } else if (error.code === '42P01') {
        throw new ApiError(500, `Table ${table} does not exist`, error, 'TABLE_NOT_FOUND');
      } else if (error.code === '42703') {
        throw new ApiError(500, `Column does not exist in ${table}`, error, 'COLUMN_NOT_FOUND');
      } else {
        throw new ApiError(500, `Database error in ${table}: ${error.message}`, error, 'DATABASE_ERROR');
      }
    }
    
    // 操作成功をログに記録
    logDbOperation(operation, table, { 
      status: 'success',
      resultCount: Array.isArray(data) ? data.length : (data ? 1 : 0)
    });
    
    // 結果を返却
    return data as T;
  } catch (error) {
    // ApiError以外のエラーをラップしてスロー
    if (!(error instanceof ApiError)) {
      logger.error({
        operation,
        table,
        error: {
          name: (error as Error).name,
          message: (error as Error).message,
          stack: (error as Error).stack
        }
      }, 'Unexpected database error');
      
      throw new ApiError(
        500,
        `Unexpected error during ${operation} on ${table}`,
        error as Error,
        'UNEXPECTED_DB_ERROR'
      );
    }
    throw error;
  }
}

/**
 * データベーストランザクションを実行する
 * トランザクションの開始、コミット、ロールバックを自動的に処理する
 * 
 * @template T - 返却されるデータの型
 * @param {Function} callback - トランザクション内で実行する処理を含むコールバック関数
 * @returns {Promise<T>} トランザクションの結果
 * @throws {ApiError} トランザクションが失敗した場合にスローされるエラー
 */
export async function executeTransaction<T>(
  callback: () => Promise<T>
): Promise<T> {
  try {
    // トランザクション開始
    await supabase.rpc('begin_transaction');
    logger.debug('Transaction started');
    
    // コールバック関数を実行
    const result = await callback();
    
    // トランザクションコミット
    await supabase.rpc('commit_transaction');
    logger.debug('Transaction committed');
    
    return result;
  } catch (error) {
    // エラー発生時はロールバック
    try {
      await supabase.rpc('rollback_transaction');
      logger.debug('Transaction rolled back');
    } catch (rollbackError) {
      logger.error({
        error: {
          name: (rollbackError as Error).name,
          message: (rollbackError as Error).message
        }
      }, 'Failed to rollback transaction');
    }
    
    // 元のエラーを再スロー
    if (error instanceof ApiError) {
      throw error;
    }
    
    throw new ApiError(
      500,
      'Transaction failed',
      error as Error,
      'TRANSACTION_FAILED'
    );
  }
}

/**
 * レコード取得のヘルパー関数
 * 指定されたIDのレコードを取得する
 * 
 * @template T - 返却されるレコードの型
 * @param {string} table - テーブル名
 * @param {string} id - 取得するレコードのID
 * @param {string} [userId] - 所有権チェック用のユーザーID（指定された場合は所有権チェックを行う）
 * @returns {Promise<T>} 取得したレコード
 * @throws {ApiError} レコードが見つからない場合などにスローされるエラー
 */
export async function getRecord<T>(
  table: string,
  id: string,
  userId?: string
): Promise<T> {
  return executeDbOperation<T>('select', table, async () => {
    let query = supabase.from(table).select('*').eq('id', id);
    
    // ユーザーIDが指定されている場合は所有権チェック
    if (userId) {
      query = query.eq('user_id', userId);
    }
    
    return await query.single();
  });
}

/**
 * レコード一覧取得のヘルパー関数
 * フィルターやソート、ページネーションなどのオプションを指定してレコード一覧を取得する
 * 
 * @template T - 返却されるレコードの型
 * @param {string} table - テーブル名
 * @param {Record<string, any>} [filters] - フィルター条件（キーと値のペア）
 * @param {Object} [options] - 取得オプション
 * @param {number} [options.limit] - 取得件数の上限
 * @param {number} [options.offset] - スキップするレコード数
 * @param {string} [options.orderBy] - ソートするカラム名
 * @param {'asc'|'desc'} [options.orderDirection] - ソート方向（asc: 昇順、desc: 降順）
 * @returns {Promise<T[]>} 取得したレコードの配列
 */
export async function getRecords<T>(
  table: string,
  filters?: Record<string, any>,
  options?: {
    limit?: number;
    offset?: number;
    orderBy?: string;
    orderDirection?: 'asc' | 'desc';
  }
): Promise<T[]> {
  return executeDbOperation<T[]>('select', table, async () => {
    let query = supabase.from(table).select('*');
    
    // フィルターの適用
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value);
        }
      });
    }
    
    // ソート順の適用
    if (options?.orderBy) {
      query = query.order(options.orderBy, { 
        ascending: options.orderDirection !== 'desc'
      });
    }
    
    // ページネーションの適用
    if (options?.limit) {
      query = query.limit(options.limit);
    }
    
    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
    }
    
    return await query;
  });
}

/**
 * レコード作成のヘルパー関数
 * 新しいレコードを作成し、作成されたレコードを返却する
 * 
 * @template T - 返却されるレコードの型
 * @param {string} table - テーブル名
 * @param {Record<string, any>} data - 作成するレコードのデータ
 * @returns {Promise<T>} 作成されたレコード
 * @throws {ApiError} レコードの作成が失敗した場合にスローされるエラー
 */
export async function createRecord<T>(
  table: string,
  data: Record<string, any>
): Promise<T> {
  return executeDbOperation<T>('insert', table, async () => {
    return await supabase
      .from(table)
      .insert(data)
      .select()
      .single();
  });
}

/**
 * レコード更新のヘルパー関数
 * 指定されたIDのレコードを更新し、更新後のレコードを返却する
 * 
 * @template T - 返却されるレコードの型
 * @param {string} table - テーブル名
 * @param {string} id - 更新するレコードのID
 * @param {Record<string, any>} data - 更新するデータ
 * @param {string} [userId] - 所有権チェック用のユーザーID（指定された場合は所有権チェックを行う）
 * @returns {Promise<T>} 更新後のレコード
 * @throws {ApiError} レコードが見つからない場合や更新が失敗した場合にスローされるエラー
 */
export async function updateRecord<T>(
  table: string,
  id: string,
  data: Record<string, any>,
  userId?: string
): Promise<T> {
  return executeDbOperation<T>('update', table, async () => {
    let query = supabase
      .from(table)
      .update(data)
      .eq('id', id);
    
    // ユーザーIDが指定されている場合は所有権チェック
    if (userId) {
      query = query.eq('user_id', userId);
    }
    
    return await query.select().single();
  });
}

/**
 * レコード削除のヘルパー関数
 * 指定されたIDのレコードを削除する
 * 
 * @param {string} table - テーブル名
 * @param {string} id - 削除するレコードのID
 * @param {string} [userId] - 所有権チェック用のユーザーID（指定された場合は所有権チェックを行う）
 * @returns {Promise<void>} 成功時は何も返さない
 * @throws {ApiError} レコードが見つからない場合や削除が失敗した場合にスローされるエラー
 */
export async function deleteRecord(
  table: string,
  id: string,
  userId?: string
): Promise<void> {
  await executeDbOperation<null>('delete', table, async () => {
    let query = supabase
      .from(table)
      .delete()
      .eq('id', id);
    
    // ユーザーIDが指定されている場合は所有権チェック
    if (userId) {
      query = query.eq('user_id', userId);
    }
    
    return await query;
  });
}

export default supabase;
