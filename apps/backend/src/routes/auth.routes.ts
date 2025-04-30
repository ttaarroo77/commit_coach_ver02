import { Router } from 'express';
import { authController } from '../controllers/auth.controller';

const router = Router();

router.post('/login', authController.login.bind(authController));
router.post('/signup', authController.signup.bind(authController));
router.post('/logout', authController.logout.bind(authController));

export default router;
