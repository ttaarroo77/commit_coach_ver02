import { Request, Response, NextFunction } from 'express';
import { ValidationMiddleware } from '../validation.middleware';
import { z } from 'zod';

describe('ValidationMiddleware', () => {
  let validationMiddleware: ValidationMiddleware;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    validationMiddleware = new ValidationMiddleware();
    mockRequest = {
      body: {},
      params: {},
      query: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    nextFunction = jest.fn();
  });

  describe('validate', () => {
    const testSchema = z.object({
      name: z.string().min(1, '名前は必須です'),
      age: z.number().min(0, '年齢は0以上である必要があります'),
    });

    it('有効なデータでバリデーションが成功すること', () => {
      mockRequest.body = {
        name: 'テストユーザー',
        age: 25,
      };

      validationMiddleware.validate(testSchema)(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction,
      );

      expect(nextFunction).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it('無効なデータで400エラーを返すこと', () => {
      mockRequest.body = {
        name: '',
        age: -1,
      };

      validationMiddleware.validate(testSchema)(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction,
      );

      expect(nextFunction).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: expect.arrayContaining([
          expect.stringContaining('名前は必須です'),
          expect.stringContaining('年齢は0以上である必要があります'),
        ]),
      });
    });

    it('必須フィールドが欠けている場合400エラーを返すこと', () => {
      mockRequest.body = {};

      validationMiddleware.validate(testSchema)(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction,
      );

      expect(nextFunction).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: expect.arrayContaining([
          expect.stringContaining('名前は必須です'),
        ]),
      });
    });

    it('型が異なるデータで400エラーを返すこと', () => {
      mockRequest.body = {
        name: 123,
        age: '25',
      };

      validationMiddleware.validate(testSchema)(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction,
      );

      expect(nextFunction).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: expect.any(Array),
      });
    });
  });
});
