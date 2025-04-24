import { z } from 'zod';

export const createProjectSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'プロジェクト名は必須です'),
    description: z.string().optional(),
  }),
});

export const updateProjectSchema = z.object({
  params: z.object({
    id: z.string().uuid('有効なプロジェクトIDを指定してください'),
  }),
  body: z.object({
    name: z.string().min(1, 'プロジェクト名は必須です').optional(),
    description: z.string().optional(),
    is_archived: z.boolean().optional(),
  }),
});

export const getProjectSchema = z.object({
  params: z.object({
    id: z.string().uuid('有効なプロジェクトIDを指定してください'),
  }),
});

export const deleteProjectSchema = z.object({
  params: z.object({
    id: z.string().uuid('有効なプロジェクトIDを指定してください'),
  }),
});

export const getProjectsSchema = z.object({
  query: z.object({
    limit: z.string().optional().transform((val) => val ? parseInt(val, 10) : 10),
    offset: z.string().optional().transform((val) => val ? parseInt(val, 10) : 0),
    include_archived: z.string().optional().transform((val) => val === 'true'),
  }),
});

export const addProjectMemberSchema = z.object({
  params: z.object({
    id: z.string().uuid('有効なプロジェクトIDを指定してください'),
  }),
  body: z.object({
    user_id: z.string().uuid('有効なユーザーIDを指定してください'),
    role: z.enum(['owner', 'editor', 'viewer'], {
      errorMap: () => ({ message: 'ロールは owner, editor, viewer のいずれかである必要があります' })
    }),
  }),
});

export const removeProjectMemberSchema = z.object({
  params: z.object({
    id: z.string().uuid('有効なプロジェクトIDを指定してください'),
    userId: z.string().uuid('有効なユーザーIDを指定してください'),
  }),
}); 