import { Router } from 'express';
import * as ctrl from './orders.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.post('/', ctrl.placeOrder);
router.get('/', ctrl.getOrders);
router.get('/:id', ctrl.getOrderById);
router.get('/:id/track', ctrl.trackOrder);

export default router;
