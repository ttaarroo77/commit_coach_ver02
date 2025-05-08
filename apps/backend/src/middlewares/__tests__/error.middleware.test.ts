import { Request, Response, NextFunction } from 'express';
import { ErrorMiddleware } from '../error.middleware';

describe('ErrorMiddleware', () => {
  let errorMiddleware: ErrorMiddleware;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    errorMiddleware = new ErrorMiddleware();
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    nextFunction = jest.fn();
  });

  describe('handleError', () => {
    it('デフォルトで500エラーを返すこと', () => {
      const error = new Error('予期せぬエラー');

      errorMiddleware.handleError(
        error,
        mockRequest as Request,
        mockResponse as Response,
        nextFunction,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: '予期せぬエラーが発生しました',
      });
    });

    it('カスタムエラーメッセージを返すこと', () => {
      const error = new Error('カスタムエラー');
      (error as any).statusCode = 400;

      errorMiddleware.handleError(
        error,
        mockRequest as Request,
        mockResponse as Response,
        nextFunction,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'カスタムエラー',
      });
    });

    it('バリデーションエラーを適切に処理すること', () => {
      const error = new Error('バリデーションエラー');
      (error as any).statusCode = 400;
      (error as any).errors = ['名前は必須です', '年齢は0以上である必要があります'];

      errorMiddleware.handleError(
        error,
        mockRequest as Request,
        mockResponse as Response,
        nextFunction,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: ['名前は必須です', '年齢は0以上である必要があります'],
      });
    });

    it('認証エラーを適切に処理すること', () => {
      const error = new Error('認証エラー');
      (error as any).statusCode = 401;

      errorMiddleware.handleError(
        error,
        mockRequest as Request,
        mockResponse as Response,
        nextFunction,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: '認証エラー',
      });
    });

    it('権限エラーを適切に処理すること', () => {
      const error = new Error('権限エラー');
      (error as any).statusCode = 403;

      errorMiddleware.handleError(
        error,
        mockRequest as Request,
        mockResponse as Response,
        nextFunction,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: '権限エラー',
      });
    });
  });
});
