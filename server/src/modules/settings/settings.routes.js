import { Router } from 'express';
import * as ctrl from './settings.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { requireAdmin } from '../../middleware/admin.middleware.js';

const router = Router();

// Public — anyone can read site settings (needed for Navbar/Footer rendering)
router.get('/', ctrl.getPublicSettings);

// Admin-only — manage settings
router.get('/admin', authenticate, requireAdmin, ctrl.getAdminSettings);
router.put('/', authenticate, requireAdmin, ctrl.updateSettings);
router.delete('/:key', authenticate, requireAdmin, ctrl.deleteSetting);

export default router;