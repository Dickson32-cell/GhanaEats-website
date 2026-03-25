import { Router } from 'express';
import * as ctrl from './admin.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { requireAdmin } from '../../middleware/admin.middleware.js';

const router = Router();

router.use(authenticate, requireAdmin);

router.get('/dashboard', ctrl.getDashboard);
router.get('/revenue', ctrl.getRevenue);
router.get('/orders', ctrl.getAllOrders);
router.put('/orders/:id/status', ctrl.updateOrderStatus);
router.get('/menu', ctrl.getAllMenuItems);
router.post('/menu', ctrl.createMenuItem);
router.put('/menu/:id', ctrl.updateMenuItem);
router.delete('/menu/:id', ctrl.deleteMenuItem);
router.get('/users', ctrl.getAllUsers);

export default router;
