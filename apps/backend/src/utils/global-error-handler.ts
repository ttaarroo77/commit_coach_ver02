import { logger } from './logger';

/**
 * グローバルな未処理例外ハンドラー
 * プロセス全体で未処理の例外をキャッチし、適切にログに記録する
 */
export function setupGlobalErrorHandlers(): void {
  // 未処理の例外をキャッチ
  process.on('uncaughtException', (error: Error) => {
    logger.fatal({
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack
      },
      type: 'uncaughtException'
    }, '未処理の例外が発生しました');
    
    // 未処理の例外は致命的なエラーとみなし、プロセスを終了する
    // ただし、ログが確実に書き込まれるように少し待機する
    setTimeout(() => {
      process.exit(1);
    }, 1000);
  });

  // 未処理のPromiseリジェクションをキャッチ
  process.on('unhandledRejection', (reason: unknown, promise: Promise<any>) => {
    const error = reason instanceof Error ? reason : new Error(String(reason));
    
    logger.error({
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack
      },
      type: 'unhandledRejection'
    }, '未処理のPromiseリジェクションが発生しました');
    
    // unhandledRejectionはプロセスを終了しない
    // 将来的にはこれも致命的エラーとして扱われる可能性がある
  });

  // SIGTERMシグナルのハンドリング（優雅な終了）
  process.on('SIGTERM', () => {
    logger.info('SIGTERMシグナルを受信しました。アプリケーションを終了します。');
    
    // 必要なクリーンアップ処理を行う
    // 例: データベース接続のクローズなど
    
    process.exit(0);
  });

  // SIGINTシグナルのハンドリング（Ctrl+C）
  process.on('SIGINT', () => {
    logger.info('SIGINTシグナルを受信しました。アプリケーションを終了します。');
    
    // 必要なクリーンアップ処理を行う
    
    process.exit(0);
  });

  logger.info('グローバルエラーハンドラーが設定されました');
}

/**
 * エラーの詳細情報を安全に取得する
 * センシティブな情報を含まないようにフィルタリングする
 */
export function getSafeErrorDetails(error: unknown): Record<string, any> {
  if (!(error instanceof Error)) {
    return { message: String(error) };
  }

  const errorObj: Record<string, any> = {
    name: error.name,
    message: error.message,
  };

  // 開発環境の場合はスタックトレースも含める
  if (process.env.NODE_ENV !== 'production') {
    errorObj.stack = error.stack;
  }

  // 追加のプロパティがある場合はそれも含める（ただし安全なものだけ）
  const sensitiveKeys = ['password', 'token', 'secret', 'key', 'auth', 'credential'];
  
  Object.entries(error).forEach(([key, value]) => {
    // センシティブな情報を含むキーはスキップ
    if (sensitiveKeys.some(sk => key.toLowerCase().includes(sk))) {
      return;
    }
    
    errorObj[key] = value;
  });

  return errorObj;
}

export default setupGlobalErrorHandlers;
