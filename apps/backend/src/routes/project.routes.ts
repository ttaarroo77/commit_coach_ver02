import { Router } from 'express';
import * as projectController from '../controllers/project.controller';
import { auth, isOwner } from '../middleware/auth';

const router = Router();

// 認証が必要なルート
router.use(auth);

// プロジェクト一覧の取得
router.get('/', projectController.getProjects);

// プロジェクトの作成
router.post('/', projectController.createProject);

// プロジェクトの詳細取得 (所有権チェック付き)
router.get('/:id', isOwner('projects'), projectController.getProject);

// プロジェクトの更新 (所有権チェック付き)
router.put('/:id', isOwner('projects'), projectController.updateProject);

// プロジェクトの削除 (所有権チェック付き)
router.delete('/:id', isOwner('projects'), projectController.deleteProject);

export default router; 