import request from 'supertest';
import createServer from '../app';
import { Task } from '../models/Task';
import { User } from '../models/User';
import jwt from 'jsonwebtoken';
import type { Express } from 'express';
import { TaskPriority, TaskStatus } from '../types/task.types';

let app: Express;
let token: string;
let userId: string;

beforeAll(async () => {
  app = await createServer();

  // テスト用ユーザーの作成 (Supabase Admin Client を使用する想定)
  // const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
  //   email: 'test@example.com',
  //   password: 'password123',
  //   email_confirm: true,
  // });
  // if (userError) throw userError;
  // userId = userData.user.id;

  // // users テーブルにも挿入
  // const { error: insertError } = await supabaseAdmin.from('users').insert({
  //   id: userId,
  //   email: 'test@example.com',
  //   name: 'Test User'
  // });
  // if (insertError) throw insertError;

  // 上記の Supabase を使ったユーザー作成は E2E テスト (auth.e2e.test.ts) に寄せ、
  // こちらのテスト (__tests__/task.test.ts) ではモックや固定値を使うことを検討します。
  // 一旦、固定値を使用します。
  userId = 'test-user-id';

  // JWTトークンの生成
  token = jwt.sign({ userId: userId }, process.env.JWT_SECRET || 'test-secret', {
    expiresIn: '1h',
  });
});

// テスト後のクリーンアップ (必要であれば)
// afterAll(async () => {
//   if (userId) {
//     await supabaseAdmin.auth.admin.deleteUser(userId);
//     await supabaseAdmin.from('users').delete().eq('id', userId);
//   }
// });

describe('Task API', () => {
  describe('POST /api/tasks', () => {
    it('新しいタスクを作成できること', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'テストタスク',
          description: 'テスト用のタスクです',
          project_id: 'test-project-id',
          priority: TaskPriority.HIGH,
          status: TaskStatus.TODO,
          due_date: new Date().toISOString(),
          position: 0
        });

      expect(response.status).toBe(201);
      expect(response.body.title).toBe('テストタスク');
      expect(response.body.user_id).toBe(userId);
      expect(response.body.priority).toBe(TaskPriority.HIGH);
      expect(response.body.status).toBe(TaskStatus.TODO);
    });

    it('必須フィールドが不足している場合は400エラーを返すこと', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({
          description: 'テスト用のタスクです',
        });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/tasks', () => {
    it('ユーザーのタスク一覧を取得できること', async () => {
      // テストデータの作成
      await Task.create({
        title: 'タスク1',
        description: '説明1',
        project_id: 'test-project-id',
        priority: TaskPriority.HIGH,
        status: TaskStatus.TODO,
        due_date: new Date().toISOString(),
        position: 0,
        user_id: userId
      });

      await Task.create({
        title: 'タスク2',
        description: '説明2',
        project_id: 'test-project-id',
        priority: TaskPriority.MEDIUM,
        status: TaskStatus.IN_PROGRESS,
        due_date: new Date().toISOString(),
        position: 1,
        user_id: userId
      });

      const response = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2);
      expect(response.body[0].title).toBe('タスク1');
      expect(response.body[1].title).toBe('タスク2');
    });
  });

  describe('PUT /api/tasks/:id', () => {
    it('タスクを更新できること', async () => {
      const task = await Task.create({
        title: '元のタスク',
        description: '元の説明',
        project_id: 'test-project-id',
        priority: TaskPriority.HIGH,
        status: TaskStatus.TODO,
        due_date: new Date().toISOString(),
        position: 0,
        user_id: userId
      });

      const response = await request(app)
        .put(`/api/tasks/${task._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: '更新されたタスク',
          status: TaskStatus.DONE
        });

      expect(response.status).toBe(200);
      expect(response.body.title).toBe('更新されたタスク');
      expect(response.body.status).toBe(TaskStatus.DONE);
    });

    it('存在しないタスクの更新は404エラーを返すこと', async () => {
      const response = await request(app)
        .put('/api/tasks/507f1f77bcf86cd799439011')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: '更新されたタスク',
        });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    it('タスクを削除できること', async () => {
      const task = await Task.create({
        title: '削除するタスク',
        description: '削除用の説明',
        project_id: 'test-project-id',
        priority: TaskPriority.HIGH,
        status: TaskStatus.TODO,
        due_date: new Date().toISOString(),
        position: 0,
        user_id: userId
      });

      const response = await request(app)
        .delete(`/api/tasks/${task._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
    });
  });
});
