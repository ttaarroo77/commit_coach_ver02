import { Router } from 'express';
import { coachingSessionController } from '../controllers/coachingSession.controller';
import { validate } from '../middleware/validate';
import { coachingSessionSchema } from '../validators/coachingSession.validator';
import { auth } from '../middleware/auth';

const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'coaching-sessions',
    timestamp: new Date().toISOString(),
  });
});

// ... existing code ...