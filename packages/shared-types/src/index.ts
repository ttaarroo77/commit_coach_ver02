import { z } from 'zod';

// User
export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type User = z.infer<typeof UserSchema>;

// Project
export const ProjectSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  status: z.enum(['active', 'archived']),
  createdAt: z.string(),
  updatedAt: z.string(),
  ownerId: z.string(),
});

export type Project = z.infer<typeof ProjectSchema>;

// Task
export const TaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  status: z.enum(['todo', 'in_progress', 'done']),
  priority: z.enum(['low', 'medium', 'high']),
  dueDate: z.string().optional(),
  projectId: z.string(),
  assigneeId: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Task = z.infer<typeof TaskSchema>;

// DashboardTask
export const DashboardTaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  status: z.enum(['pending', 'in_progress', 'completed']),
  startTime: z.string(),
  endTime: z.string(),
  projectId: z.string(),
  projectName: z.string(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type DashboardTask = z.infer<typeof DashboardTaskSchema>;

// API Response
export const ApiResponseSchema = z.object({
  data: z.any(),
  error: z
    .object({
      code: z.string(),
      message: z.string(),
    })
    .optional(),
});

export type ApiResponse<T> = {
  data: T;
  error?: {
    code: string;
    message: string;
  };
};

export * from './types';
