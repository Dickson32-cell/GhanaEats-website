import { Router } from 'express';
import * as ctrl from './cart.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/', ctrl.getCart);
router.post('/', ctrl.addItem);
router.put('/:menuItemId', ctrl.updateItem);
router.delete('/:menuItemId', ctrl.removeItem);
router.delete('/', ctrl.clearCart);

export default router;
