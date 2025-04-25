import { Router } from 'express';
import { TaskGroupController } from '../controllers/task-group.controller';
import { auth, isOwner } from '../middleware/auth';

const router = Router();
const taskGroupController = new TaskGroupController();

// 認証ミドルウェアを適用
router.use(auth);

// プロジェクト内のタスクグループ一覧を取得
router.get('/project/:projectId', taskGroupController.getTaskGroupsByProject);

// タスクグループを作成
router.post('/', taskGroupController.createTaskGroup);

// 特定のタスクグループを取得 (所有権チェック付き)
router.get('/:id', isOwner('task_groups'), taskGroupController.getTaskGroupById);

// タスクグループを更新 (所有権チェック付き)
router.put('/:id', isOwner('task_groups'), taskGroupController.updateTaskGroup);

// タスクグループを削除 (所有権チェック付き)
router.delete('/:id', isOwner('task_groups'), taskGroupController.deleteTaskGroup);

// タスクグループの順序を更新
router.post('/order', taskGroupController.updateTaskGroupOrder);

export default router; 