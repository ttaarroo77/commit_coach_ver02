import { Router } from 'express';
import { TaskGroupController } from '../controllers/task-group.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const taskGroupController = new TaskGroupController();

// 認証ミドルウェアを適用
router.use(authMiddleware);

// プロジェクト内のタスクグループ一覧を取得
router.get('/project/:projectId', taskGroupController.getTaskGroupsByProject);

// タスクグループを作成
router.post('/', taskGroupController.createTaskGroup);

// 特定のタスクグループを取得
router.get('/:id', taskGroupController.getTaskGroupById);

// タスクグループを更新
router.put('/:id', taskGroupController.updateTaskGroup);

// タスクグループを削除
router.delete('/:id', taskGroupController.deleteTaskGroup);

// タスクグループの順序を更新
router.post('/order', taskGroupController.updateTaskGroupOrder);

export default router; 