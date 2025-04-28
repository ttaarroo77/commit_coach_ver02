import { z } from 'zod';

export const userProfileSchema = z.object({
  userId: z.string(),
  displayName: z.string().min(2).max(50),
  bio: z.string().max(500).optional(),
  avatarUrl: z.string().url().optional(),
  skills: z.array(z.string()).max(10).optional(),
  experience: z.number().min(0).max(100).optional(),
  availability: z.object({
    monday: z.boolean(),
    tuesday: z.boolean(),
    wednesday: z.boolean(),
    thursday: z.boolean(),
    friday: z.boolean(),
    saturday: z.boolean(),
    sunday: z.boolean(),
  }).optional(),
  timezone: z.string().optional(),
  preferredLanguage: z.enum(['ja', 'en']).default('ja'),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type UserProfile = z.infer<typeof userProfileSchema>; 