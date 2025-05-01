import { Router } from 'express';
import { TaskController } from '../controllers/task.controller';
import { auth, isOwner } from '../middleware/auth';

const router = Router();
const taskController = new TaskController();

// 認証ミドルウェアを適用
router.use(auth);

// タスクの作成
router.post('/', (req, res) => taskController.createTask(req, res));

// プロジェクトのタスク一覧取得
router.get('/project/:projectId', (req, res) => taskController.getTasksByProject(req, res));

// グループのタスク一覧取得
router.get('/group/:groupId', (req, res) => taskController.getTasksByGroup(req, res));

// タスクの詳細取得 (所有権チェック付き)
router.get('/:id', isOwner('tasks'), (req, res) => taskController.getTaskById(req, res));

// タスクの更新 (所有権チェック付き)
router.put('/:id', isOwner('tasks'), (req, res) => taskController.updateTask(req, res));

// タスクの削除 (所有権チェック付き)
router.delete('/:id', isOwner('tasks'), (req, res) => taskController.deleteTask(req, res));

// タスクの順序更新 (所有権チェック付き)
router.post('/:id/order', isOwner('tasks'), (req, res) => taskController.updateTaskOrder(req, res));

// サブタスクの取得 (親タスクの所有権チェック付き)
router.get('/:parentId/subtasks', isOwner('tasks', 'parentId'), (req, res) => taskController.getSubtasks(req, res));

// タスクのステータス更新 (所有権チェック付き)
router.patch('/:id/status', isOwner('tasks'), (req, res) => taskController.updateTaskStatus(req, res));

// タスクの期限更新 (所有権チェック付き)
router.patch('/:id/due-date', isOwner('tasks'), (req, res) => taskController.updateTaskDueDate(req, res));

export default router;
