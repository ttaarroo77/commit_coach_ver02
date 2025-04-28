import { z } from 'zod';

export const coachingSessionSchema = z.object({
  id: z.string().optional(),
  coachId: z.string(),
  clientId: z.string(),
  title: z.string().min(1).max(100),
  description: z.string().max(1000).optional(),
  status: z.enum(['scheduled', 'in_progress', 'completed', 'cancelled']).default('scheduled'),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  duration: z.number().min(15).max(120), // 分単位
  meetingUrl: z.string().url().optional(),
  notes: z.string().max(5000).optional(),
  feedback: z.object({
    rating: z.number().min(1).max(5).optional(),
    comment: z.string().max(1000).optional(),
  }).optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type CoachingSession = z.infer<typeof coachingSessionSchema>;