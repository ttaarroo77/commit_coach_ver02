import pino from 'pino';
import pretty from 'pino-pretty';
import { Request, Response, NextFunction } from 'express';

// 環境変数に基づいてログレベルを設定
const logLevel = process.env.NODE_ENV === 'production' ? 'info' : 'debug';

// 開発環境では読みやすいフォーマットで出力、本番環境ではJSON形式で出力
const transport = process.env.NODE_ENV !== 'production'
  ? pretty({
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname',
    })
  : undefined;

// ロガーの設定
export const logger = pino({
  level: logLevel,
  transport,
  base: undefined, // pid, hostnameなどのデフォルト値を含めない
  timestamp: pino.stdTimeFunctions.isoTime,
  redact: {
    paths: ['req.headers.authorization', 'req.headers.cookie', 'password', 'token'],
    censor: '***REDACTED***'
  },
});

/**
 * リクエストログ用のミドルウェア
 * 各リクエストの開始時と完了時にログを記録する
 * 
 * @param {Request} req - Expressリクエストオブジェクト
 * @param {Response} res - Expressレスポンスオブジェクト
 * @param {NextFunction} next - Expressミドルウェアの次の処理を呼び出す関数
 */
export const requestLogger = (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
  const startTime = Date.now();
  
  // レスポンス送信後にログを記録
  res.on('finish', () => {
    const responseTime = Date.now() - startTime;
    
    logger.info({
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      responseTime: `${responseTime}ms`,
      userAgent: req.headers['user-agent'],
      ip: req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress,
    }, 'Request completed');
  });
  
  next();
};

/**
 * エラーログ用のヘルパー関数
 * エラー情報を構造化してログに記録する
 * 
 * @param {Error} err - ログに記録するエラーオブジェクト
 * @param {Express.Request} [req] - 関連するリクエストオブジェクト（あれば）
 */
export const logError = (err: Error, req?: Express.Request) => {
  const logData: any = {
    error: {
      name: err.name,
      message: err.message,
      stack: err.stack
    }
  };
  
  if (req) {
    logData.method = req.method;
    logData.url = req.originalUrl;
    logData.ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  }
  
  logger.error(logData, 'Error occurred');
};

/**
 * アプリケーション起動ログ
 * サーバー起動時の情報をログに記録する
 * 
 * @param {number} port - サーバーがリッスンしているポート番号
 */
export const logAppStart = (port: number) => {
  logger.info(`Server started on port ${port} in ${process.env.NODE_ENV || 'development'} mode`);
};

/**
 * データベース操作ログ
 * データベース操作の詳細をログに記録する
 * 
 * @param {string} operation - 実行された操作の種類（select, insert, update, deleteなど）
 * @param {string} table - 操作対象のテーブル名
 * @param {Object} [details] - 操作の詳細情報（ステータスや結果など）
 */
export const logDbOperation = (operation: string, table: string, details?: Record<string, any>) => {
  logger.debug({ operation, table, details }, 'Database operation');
};

/**
 * 認証関連ログ
 * ログインやログアウトなどの認証関連アクションをログに記録する
 * 
 * @param {string} userId - アクションの対象となるユーザーID
 * @param {string} action - 実行されたアクション（login, logout, registerなど）
 * @param {boolean} success - アクションが成功したかどうか
 * @param {Object} [details] - 詳細情報（エラーメッセージなど）
 */
export const logAuth = (userId: string, action: string, success: boolean, details?: Record<string, any>) => {
  logger.info({ userId, action, success, details }, 'Authentication');
};

export default logger;
