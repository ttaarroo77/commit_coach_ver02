import { Router } from 'express';
import { ProjectController } from '../controllers/project.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const projectController = new ProjectController();

// 認証が必要なルート
router.use(authMiddleware);

// プロジェクト一覧の取得
router.get('/', projectController.getProjects.bind(projectController));

// プロジェクトの作成
router.post('/', projectController.createProject.bind(projectController));

// プロジェクトの詳細取得
router.get('/:id', projectController.getProject.bind(projectController));

// プロジェクトの更新
router.put('/:id', projectController.updateProject.bind(projectController));

// プロジェクトの削除
router.delete('/:id', projectController.deleteProject.bind(projectController));

export default router; 