import request from 'supertest';
import { App } from '../app';
import { config } from '@commit-coach/config';

describe('App', () => {
  let app: App;

  beforeEach(() => {
    app = new App(config.port);
  });

  describe('ミドルウェアの初期化', () => {
    it('セキュリティヘッダーが正しく設定されていること', async () => {
      const response = await request(app.getApp()).get('/');
      expect(response.headers['x-powered-by']).toBeUndefined();
      expect(response.headers['x-frame-options']).toBe('SAMEORIGIN');
      expect(response.headers['x-content-type-options']).toBe('nosniff');
    });

    it('CORSが正しく設定されていること', async () => {
      const response = await request(app.getApp())
        .get('/')
        .set('Origin', 'http://localhost:3000');
      expect(response.headers['access-control-allow-origin']).toBe('*');
    });

    it('JSONリクエストを正しくパースできること', async () => {
      const response = await request(app.getApp())
        .post('/api/tasks')
        .send({ title: 'テストタスク' });
      expect(response.status).not.toBe(400);
    });
  });

  describe('ルーティング', () => {
    it('タスクエンドポイントにアクセスできること', async () => {
      const response = await request(app.getApp()).get('/api/tasks');
      expect(response.status).not.toBe(404);
    });

    it('プロジェクトエンドポイントにアクセスできること', async () => {
      const response = await request(app.getApp()).get('/api/projects');
      expect(response.status).not.toBe(404);
    });

    it('ユーザーエンドポイントにアクセスできること', async () => {
      const response = await request(app.getApp()).get('/api/users');
      expect(response.status).not.toBe(404);
    });

    it('存在しないエンドポイントで404が返ること', async () => {
      const response = await request(app.getApp()).get('/api/nonexistent');
      expect(response.status).toBe(404);
    });
  });

  describe('エラーハンドリング', () => {
    it('バリデーションエラーで400が返ること', async () => {
      const response = await request(app.getApp())
        .post('/api/tasks')
        .send({ invalid: 'data' });
      expect(response.status).toBe(400);
    });

    it('認証エラーで401が返ること', async () => {
      const response = await request(app.getApp())
        .get('/api/tasks')
        .set('Authorization', 'invalid-token');
      expect(response.status).toBe(401);
    });
  });
});
