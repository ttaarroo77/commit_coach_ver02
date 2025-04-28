import { Router } from 'express';
import * as projectController from '../controllers/project.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// 認証が必要なルート
router.use(authenticate);

// プロジェクト一覧の取得
router.get('/', projectController.getProjects);

// プロジェクトの作成
router.post('/', projectController.createProject);

// プロジェクトの詳細取得
router.get('/:id', projectController.getProject);

// プロジェクトの更新
router.put('/:id', projectController.updateProject);

// プロジェクトの削除
router.delete('/:id', projectController.deleteProject);

export default router;
