import { Router } from 'express';
import * as taskController from '../controllers/task.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// 認証が必要なルート
router.use(authenticate);

// タスク一覧の取得
router.get('/', taskController.getTasks);

// タスクの作成
router.post('/', taskController.createTask);

// タスクの詳細取得
router.get('/:id', taskController.getTask);

// タスクの更新
router.put('/:id', taskController.updateTask);

// タスクの削除
router.delete('/:id', taskController.deleteTask);

// プロジェクトのタスク一覧取得
router.get('/project/:projectId', taskController.getTasksByProject);

// グループのタスク一覧取得
router.get('/group/:groupId', taskController.getTasksByGroup);

// タスクの順序更新 (所有権チェック付き)
router.post('/:id/order', taskController.updateTaskOrder);

// サブタスクの取得 (親タスクの所有権チェック付き)
router.get('/:parentId/subtasks', taskController.getSubtasks);

// タスクのステータス更新 (所有権チェック付き)
router.patch('/:id/status', taskController.updateTaskStatus);

// タスクの期限更新 (所有権チェック付き)
router.patch('/:id/due-date', taskController.updateTaskDueDate);

export default router;
