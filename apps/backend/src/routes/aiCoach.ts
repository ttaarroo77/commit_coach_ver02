import { Router } from 'express';
import { chat } from '../controllers/aiCoach';
import { validate } from '../middleware/validate';
import { aiCoachSchema } from '../validators/aiCoach';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/chat', authenticate, validate(aiCoachSchema), chat);

export default router;