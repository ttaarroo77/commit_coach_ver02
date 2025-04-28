import { z } from 'zod';

export const aiCoachSchema = z.object({
  message: z.string().min(1).max(1000),
}); 