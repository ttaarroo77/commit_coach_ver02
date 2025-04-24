import { Router } from 'express';
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  addProjectMember,
  removeProjectMember,
  getProjectMembers
} from '../controllers/project.controller';
import { validate } from '../middleware/validate';
import {
  createProjectSchema,
  updateProjectSchema,
  getProjectSchema,
  deleteProjectSchema,
  getProjectsSchema,
  addProjectMemberSchema,
  removeProjectMemberSchema
} from '../validators/project.validator';
import { auth, isOwner } from '../middleware/auth';

const router = Router();

// すべてのルートで認証が必要
router.use(auth);

// プロジェクト一覧を取得
router.get('/', validate(getProjectsSchema), getProjects);

// 新しいプロジェクトを作成
router.post('/', validate(createProjectSchema), createProject);

// 特定のプロジェクトを取得
router.get('/:id', validate(getProjectSchema), getProject);

// プロジェクトを更新（所有者のみ）
router.put(
  '/:id',
  validate(updateProjectSchema),
  isOwner('projects', 'id', 'owner_id'),
  updateProject
);

// プロジェクトを削除（所有者のみ）
router.delete(
  '/:id',
  validate(deleteProjectSchema),
  isOwner('projects', 'id', 'owner_id'),
  deleteProject
);

// プロジェクトメンバーの一覧を取得
router.get('/:id/members', validate(getProjectSchema), getProjectMembers);

// プロジェクトにメンバーを追加（所有者のみ）
router.post(
  '/:id/members',
  validate(addProjectMemberSchema),
  isOwner('projects', 'id', 'owner_id'),
  addProjectMember
);

// プロジェクトからメンバーを削除（所有者のみ）
router.delete(
  '/:id/members/:userId',
  validate(removeProjectMemberSchema),
  isOwner('projects', 'id', 'owner_id'),
  removeProjectMember
);

export { router as projectRouter }; 