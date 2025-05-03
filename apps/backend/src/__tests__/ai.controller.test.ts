import { Request, Response } from 'express';
import { AIService } from '../services/ai.service';
import { TaskService } from '../services/task.service';
import * as aiController from '../controllers/ai.controller';
import { ApiError } from '../middleware/errorHandler';

// モック
jest.mock('../services/ai.service');
jest.mock('../services/task.service');

describe('AIController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    // リクエスト、レスポンス、nextのモックを設定
    mockRequest = {
      user: { id: 'user-id' },
      body: {},
      query: {}
    };
    mockResponse = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis()
    };
    mockNext = jest.fn();

    // AIServiceのモックをリセット
    jest.clearAllMocks();
  });

  describe('getAIConfig', () => {
    it('ユーザーIDがない場合は401エラーを返すこと', async () => {
      // ユーザーIDを削除
      mockRequest.user = undefined;

      // テスト対象の関数を実行
      await expect(aiController.getAIConfig(mockRequest as Request, mockResponse as Response))
        .rejects.toThrow(ApiError);
    });

    it('ユーザー設定を取得できること', async () => {
      // AIServiceのモックを設定
      const mockConfig = { model: 'gpt-3.5-turbo', temperature: 0.7, maxTokens: 1000 };
      (AIService.prototype.getUserConfig as jest.Mock).mockResolvedValue(mockConfig);

      // テスト対象の関数を実行
      await aiController.getAIConfig(mockRequest as Request, mockResponse as Response);

      // 期待される結果を検証
      expect(AIService.prototype.getUserConfig).toHaveBeenCalledWith('user-id');
      expect(mockResponse.json).toHaveBeenCalledWith(mockConfig);
    });
  });

  describe('updateAIConfig', () => {
    it('ユーザーIDがない場合は401エラーを返すこと', async () => {
      // ユーザーIDを削除
      mockRequest.user = undefined;

      // テスト対象の関数を実行
      await expect(aiController.updateAIConfig(mockRequest as Request, mockResponse as Response))
        .rejects.toThrow(ApiError);
    });

    it('ユーザー設定を更新できること', async () => {
      // リクエストボディを設定
      const mockConfig = { model: 'gpt-4', temperature: 0.5, maxTokens: 2000 };
      mockRequest.body = mockConfig;

      // AIServiceのモックを設定
      (AIService.prototype.saveUserConfig as jest.Mock).mockResolvedValue(undefined);

      // テスト対象の関数を実行
      await aiController.updateAIConfig(mockRequest as Request, mockResponse as Response);

      // 期待される結果を検証
      expect(AIService.prototype.saveUserConfig).toHaveBeenCalledWith('user-id', mockConfig);
      expect(mockResponse.json).toHaveBeenCalledWith(mockConfig);
    });
  });

  describe('getAIMessages', () => {
    it('ユーザーIDがない場合は401エラーを返すこと', async () => {
      // ユーザーIDを削除
      mockRequest.user = undefined;

      // テスト対象の関数を実行
      await expect(aiController.getAIMessages(mockRequest as Request, mockResponse as Response))
        .rejects.toThrow(ApiError);
    });

    it('AIメッセージを取得できること', async () => {
      // クエリパラメータを設定
      mockRequest.query = { limit: '5' };

      // AIServiceのモックを設定
      const mockMessages = [{ content: 'メッセージ1' }, { content: 'メッセージ2' }];
      (AIService.prototype.getMessages as jest.Mock).mockResolvedValue(mockMessages);

      // テスト対象の関数を実行
      await aiController.getAIMessages(mockRequest as Request, mockResponse as Response);

      // 期待される結果を検証
      expect(AIService.prototype.getMessages).toHaveBeenCalledWith('user-id', 5);
      expect(mockResponse.json).toHaveBeenCalledWith(mockMessages);
    });
  });

  describe('breakDownTask', () => {
    it('ユーザーIDがない場合は401エラーを返すこと', async () => {
      // ユーザーIDを削除
      mockRequest.user = undefined;

      // テスト対象の関数を実行
      await expect(aiController.breakDownTask(mockRequest as Request, mockResponse as Response))
        .rejects.toThrow(ApiError);
    });

    it('タスクが見つからない場合は404エラーを返すこと', async () => {
      // リクエストボディを設定
      mockRequest.body = { taskId: 'task-id' };

      // TaskServiceのモックを設定
      (TaskService.prototype.getTaskById as jest.Mock).mockResolvedValue(null);

      // テスト対象の関数を実行
      await expect(aiController.breakDownTask(mockRequest as Request, mockResponse as Response))
        .rejects.toThrow(ApiError);
    });

    it('タスクを分解できること', async () => {
      // リクエストボディを設定
      mockRequest.body = { taskId: 'task-id' };

      // TaskServiceのモックを設定
      const mockTask = {
        id: 'task-id',
        title: 'テストタスク',
        description: 'テスト用のタスクです',
        status: 'TODO',
        priority: 'HIGH'
      };
      (TaskService.prototype.getTaskById as jest.Mock).mockResolvedValue(mockTask);

      // AIServiceのモックを設定
      const mockBreakdown = {
        taskId: 'task-id',
        breakdown: [
          { title: 'サブタスク1', description: '説明1', estimatedHours: 1, priority: 'high' }
        ]
      };
      (AIService.prototype.breakDownTask as jest.Mock).mockResolvedValue(mockBreakdown);

      // テスト対象の関数を実行
      await aiController.breakDownTask(mockRequest as Request, mockResponse as Response);

      // 期待される結果を検証
      expect(TaskService.prototype.getTaskById).toHaveBeenCalledWith('user-id', 'task-id');
      expect(AIService.prototype.breakDownTask).toHaveBeenCalledWith(mockTask);
      expect(mockResponse.json).toHaveBeenCalledWith(mockBreakdown);
    });
  });

  describe('analyzeTask', () => {
    it('ユーザーIDがない場合は401エラーを返すこと', async () => {
      // ユーザーIDを削除
      mockRequest.user = undefined;

      // テスト対象の関数を実行
      await expect(aiController.analyzeTask(mockRequest as Request, mockResponse as Response))
        .rejects.toThrow(ApiError);
    });

    it('タスクが見つからない場合は404エラーを返すこと', async () => {
      // リクエストボディを設定
      mockRequest.body = { taskId: 'task-id' };

      // TaskServiceのモックを設定
      (TaskService.prototype.getTaskById as jest.Mock).mockResolvedValue(null);

      // テスト対象の関数を実行
      await expect(aiController.analyzeTask(mockRequest as Request, mockResponse as Response))
        .rejects.toThrow(ApiError);
    });

    it('タスクを分析できること', async () => {
      // リクエストボディを設定
      mockRequest.body = { taskId: 'task-id' };

      // TaskServiceのモックを設定
      const mockTask = {
        id: 'task-id',
        title: 'テストタスク',
        description: 'テスト用のタスクです',
        status: 'TODO',
        priority: 'HIGH'
      };
      (TaskService.prototype.getTaskById as jest.Mock).mockResolvedValue(mockTask);

      // AIServiceのモックを設定
      const mockAnalysis = 'タスク分析結果';
      (AIService.prototype.analyzeTask as jest.Mock).mockResolvedValue(mockAnalysis);

      // テスト対象の関数を実行
      await aiController.analyzeTask(mockRequest as Request, mockResponse as Response);

      // 期待される結果を検証
      expect(TaskService.prototype.getTaskById).toHaveBeenCalledWith('user-id', 'task-id');
      expect(AIService.prototype.analyzeTask).toHaveBeenCalledWith(mockTask);
      expect(mockResponse.json).toHaveBeenCalledWith({ taskId: 'task-id', analysis: mockAnalysis });
    });
  });

  describe('analyzeProject', () => {
    it('ユーザーIDがない場合は401エラーを返すこと', async () => {
      // ユーザーIDを削除
      mockRequest.user = undefined;

      // テスト対象の関数を実行
      await expect(aiController.analyzeProject(mockRequest as Request, mockResponse as Response))
        .rejects.toThrow(ApiError);
    });

    it('プロジェクトを分析できること', async () => {
      // リクエストボディを設定
      mockRequest.body = { projectId: 'project-id' };

      // dbServiceのモックを設定（動的インポートのため、jest.mockではなく手動でモック）
      const mockProject = {
        id: 'project-id',
        title: 'テストプロジェクト',
        description: 'テスト用のプロジェクトです',
        status: 'IN_PROGRESS'
      };
      
      jest.mock('../services/database.service', () => ({
        __esModule: true,
        default: {
          select: jest.fn().mockResolvedValue({
            data: [mockProject],
            error: null
          })
        }
      }), { virtual: true });

      // AIServiceのモックを設定
      const mockAnalysis = 'プロジェクト分析結果';
      (AIService.prototype.analyzeProject as jest.Mock).mockResolvedValue(mockAnalysis);

      // テスト対象の関数を実行
      await aiController.analyzeProject(mockRequest as Request, mockResponse as Response);

      // 期待される結果を検証
      expect(AIService.prototype.analyzeProject).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith({ projectId: 'project-id', analysis: mockAnalysis });
    });
  });
});
