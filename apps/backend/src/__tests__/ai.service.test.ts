import { AIService } from '../services/ai.service';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

// モック
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(() => ({
            data: null,
            error: { message: 'Not found' }
          }))
        })),
        order: jest.fn(() => ({
          limit: jest.fn(() => ({
            data: [],
            error: null
          }))
        }))
      })),
      upsert: jest.fn(() => ({
        error: null
      })),
      insert: jest.fn(() => ({
        error: null
      }))
    }))
  }))
}));

jest.mock('openai', () => {
  return jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: jest.fn().mockResolvedValue({
          choices: [
            {
              message: {
                content: 'モックレスポンス'
              }
            }
          ]
        })
      }
    }
  }));
});

// テスト用データ
const mockTask = {
  id: 'task-id',
  title: 'テストタスク',
  description: 'テスト用のタスクです',
  status: 'TODO',
  priority: 'HIGH',
  created_at: '2025-05-01T00:00:00Z',
  updated_at: '2025-05-01T00:00:00Z',
  user_id: 'user-id',
  project_id: 'project-id',
  order: 0
};

const mockProject = {
  id: 'project-id',
  title: 'テストプロジェクト',
  description: 'テスト用のプロジェクトです',
  status: 'IN_PROGRESS',
  created_at: '2025-05-01T00:00:00Z',
  updated_at: '2025-05-01T00:00:00Z',
  user_id: 'user-id'
};

describe('AIService', () => {
  let aiService: AIService;

  beforeEach(() => {
    // テスト前に環境変数をモック
    process.env.OPENAI_API_KEY = 'test-api-key';
    process.env.SUPABASE_URL = 'https://test.supabase.co';
    process.env.SUPABASE_ANON_KEY = 'test-anon-key';

    // AIServiceのインスタンスを作成
    aiService = new AIService();
  });

  afterEach(() => {
    // テスト後に環境変数をリセット
    delete process.env.OPENAI_API_KEY;
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_ANON_KEY;

    // モックをリセット
    jest.clearAllMocks();
  });

  describe('getUserConfig', () => {
    it('ユーザー設定が見つからない場合はデフォルト設定を返すこと', async () => {
      const config = await aiService.getUserConfig('user-id');
      
      expect(config).toEqual({
        model: 'gpt-3.5-turbo',
        temperature: 0.7,
        maxTokens: 1000,
      });
    });
  });

  describe('breakDownTask', () => {
    it('タスクを分解できること', async () => {
      const result = await aiService.breakDownTask(mockTask);
      
      expect(result).toHaveProperty('taskId', mockTask.id);
      expect(result).toHaveProperty('breakdown');
      expect(Array.isArray(result.breakdown)).toBe(true);
    });

    it('OpenAI APIキーがない場合はモックデータを返すこと', async () => {
      delete process.env.OPENAI_API_KEY;
      // AIServiceを再初期化
      aiService = new AIService();
      
      const result = await aiService.breakDownTask(mockTask);
      
      expect(result).toHaveProperty('taskId', mockTask.id);
      expect(result).toHaveProperty('breakdown');
      expect(Array.isArray(result.breakdown)).toBe(true);
      expect(result.breakdown.length).toBeGreaterThan(0);
    });
  });

  describe('analyzeTask', () => {
    it('タスクを分析できること', async () => {
      const result = await aiService.analyzeTask(mockTask);
      
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('OpenAI APIキーがない場合はモックデータを返すこと', async () => {
      delete process.env.OPENAI_API_KEY;
      // AIServiceを再初期化
      aiService = new AIService();
      
      const result = await aiService.analyzeTask(mockTask);
      
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
      expect(result).toContain(mockTask.title);
    });
  });

  describe('analyzeProject', () => {
    it('プロジェクトを分析できること', async () => {
      const result = await aiService.analyzeProject(mockProject);
      
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('OpenAI APIキーがない場合はモックデータを返すこと', async () => {
      delete process.env.OPENAI_API_KEY;
      // AIServiceを再初期化
      aiService = new AIService();
      
      const result = await aiService.analyzeProject(mockProject);
      
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
      expect(result).toContain(mockProject.title);
    });
  });

  describe('suggestCommits', () => {
    it('コミットメッセージを提案できること', async () => {
      const result = await aiService.suggestCommits('task-id', 'タスクの説明');
      
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it('OpenAI APIキーがない場合はモックデータを返すこと', async () => {
      delete process.env.OPENAI_API_KEY;
      // AIServiceを再初期化
      aiService = new AIService();
      
      const result = await aiService.suggestCommits('task-id', 'タスクの説明');
      
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(3);
      expect(result[0]).toContain('feat:');
    });
  });
});
