import { Request, Response, NextFunction } from 'express';
import { AuthMiddleware } from '../auth.middleware';
import { config } from '@commit-coach/config';

describe('AuthMiddleware', () => {
  let authMiddleware: AuthMiddleware;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    authMiddleware = new AuthMiddleware();
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    nextFunction = jest.fn();
  });

  describe('authenticate', () => {
    it('有効なトークンで認証が成功すること', () => {
      const validToken = 'valid-token';
      mockRequest.headers = {
        authorization: `Bearer ${validToken}`,
      };

      authMiddleware.authenticate(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction,
      );

      expect(nextFunction).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it('トークンが存在しない場合401エラーを返すこと', () => {
      mockRequest.headers = {};

      authMiddleware.authenticate(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction,
      );

      expect(nextFunction).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: '認証が必要です',
      });
    });

    it('無効なトークン形式で401エラーを返すこと', () => {
      mockRequest.headers = {
        authorization: 'InvalidToken',
      };

      authMiddleware.authenticate(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction,
      );

      expect(nextFunction).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: '無効なトークン形式です',
      });
    });

    it('トークンの検証に失敗した場合401エラーを返すこと', () => {
      mockRequest.headers = {
        authorization: 'Bearer invalid-token',
      };

      authMiddleware.authenticate(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction,
      );

      expect(nextFunction).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: '認証に失敗しました',
      });
    });
  });
});
