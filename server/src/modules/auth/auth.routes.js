import { Router } from 'express';
import * as ctrl from './auth.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';

const router = Router();

router.post('/register', ctrl.register);
router.post('/login', ctrl.login);
router.get('/me', authenticate, ctrl.getMe);
router.put('/me', authenticate, ctrl.updateMe);
router.put('/profile', authenticate, ctrl.updateMe);
router.put('/change-password', authenticate, ctrl.changePassword);

export default router;
