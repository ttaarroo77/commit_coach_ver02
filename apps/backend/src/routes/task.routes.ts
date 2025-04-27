import { Router } from 'express';
import * as taskController from '../controllers/task.controller';
import { auth, isOwner } from '../middleware/auth';

const router = Router();

// 認証ミドルウェアを適用
router.use(auth);

// タスクの作成
router.post('/', taskController.createTask);

// プロジェクトのタスク一覧取得
router.get('/project/:projectId', taskController.getTasksByProject);

// グループのタスク一覧取得
router.get('/group/:groupId', taskController.getTasksByGroup);

// タスクの詳細取得 (所有権チェック付き)
router.get('/:id', isOwner('tasks'), taskController.getTaskById);

// タスクの更新 (所有権チェック付き)
router.put('/:id', isOwner('tasks'), taskController.updateTask);

// タスクの削除 (所有権チェック付き)
router.delete('/:id', isOwner('tasks'), taskController.deleteTask);

// タスクの順序更新 (所有権チェック付き)
router.post('/:id/order', isOwner('tasks'), taskController.updateTaskOrder);

// サブタスクの取得 (親タスクの所有権チェック付き)
router.get('/:parentId/subtasks', isOwner('tasks', 'parentId'), taskController.getSubtasks);

// タスクのステータス更新 (所有権チェック付き)
router.patch('/:id/status', isOwner('tasks'), taskController.updateTaskStatus);

// タスクの期限更新 (所有権チェック付き)
router.patch('/:id/due-date', isOwner('tasks'), taskController.updateTaskDueDate);

export default router;
