import { Router } from 'express';
import { TaskController } from '../controllers/task.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const taskController = new TaskController();

// 認証ミドルウェアを適用
router.use(authMiddleware);

// タスクの作成
router.post('/', taskController.createTask.bind(taskController));

// プロジェクトのタスク一覧取得
router.get('/project/:projectId', taskController.getTasksByProject.bind(taskController));

// グループのタスク一覧取得
router.get('/group/:groupId', taskController.getTasksByGroup.bind(taskController));

// タスクの詳細取得
router.get('/:id', taskController.getTaskById.bind(taskController));

// タスクの更新
router.put('/:id', taskController.updateTask.bind(taskController));

// タスクの削除
router.delete('/:id', taskController.deleteTask.bind(taskController));

// タスクの順序更新
router.post('/:id/order', taskController.updateTaskOrder.bind(taskController));

// サブタスクの取得
router.get('/:parentId/subtasks', taskController.getSubtasks.bind(taskController));

// タスクのステータス更新
router.patch('/:id/status', taskController.updateTaskStatus.bind(taskController));

// タスクの期限更新
router.patch('/:id/due-date', taskController.updateTaskDueDate.bind(taskController));

export default router; 