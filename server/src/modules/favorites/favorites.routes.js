import { Router } from 'express';
import * as ctrl from './favorites.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/', ctrl.getFavorites);
router.post('/', ctrl.addFavorite);
router.delete('/:menuItemId', ctrl.removeFavorite);

export default router;
