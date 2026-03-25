import { Router } from 'express';
import * as ctrl from './menu.controller.js';

const router = Router();

router.get('/categories', ctrl.getCategories);
router.get('/items', ctrl.getItems);
router.get('/items/:id', ctrl.getItemById);

export default router;
