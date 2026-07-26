import { Router } from 'express';
import * as reviewController from './reviews.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';

const router = Router();

// Public routes - get reviews
router.get('/menu-item/:menuItemId', reviewController.getMenuItemReviews);
router.get('/menu-item/:menuItemId/average', reviewController.getMenuItemAverageRating);

// Authenticated routes - manage user reviews
router.post('/', authenticate, reviewController.createReview);
router.get('/my-reviews', authenticate, reviewController.getUserReviews);
router.get('/order/:orderId', authenticate, reviewController.getOrderReviews);
router.put('/:id', authenticate, reviewController.updateReview);
router.delete('/:id', authenticate, reviewController.deleteReview);

export default router;
