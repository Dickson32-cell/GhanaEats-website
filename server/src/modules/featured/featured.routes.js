import { Router } from 'express';
import * as featuredController from './featured.controller.js';
import { authenticate, authorize } from '../../middleware/auth.middleware.js';

const router = Router();

// Public route - get featured items for homepage
router.get('/', featuredController.getFeaturedItems);

// Admin routes - manage featured items
router.post('/', authenticate, authorize(['ADMIN']), featuredController.setFeaturedItems);
router.post('/add', authenticate, authorize(['ADMIN']), featuredController.addFeaturedItem);
router.delete('/:id', authenticate, authorize(['ADMIN']), featuredController.removeFeaturedItem);
router.put('/reorder', authenticate, authorize(['ADMIN']), featuredController.reorderFeaturedItems);

export default router;
