import express from 'express';
import * as promoController from './promos.controller.js';
import { authenticate, authorize } from '../../middleware/auth.middleware.js';

const router = express.Router();

// Public routes
router.get('/active', promoController.getActivePromos);

// Admin routes
router.get('/', authenticate, authorize(['ADMIN']), promoController.getAllPromos);
router.get('/:id', authenticate, authorize(['ADMIN']), promoController.getPromoById);
router.post('/', authenticate, authorize(['ADMIN']), promoController.createPromo);
router.put('/:id', authenticate, authorize(['ADMIN']), promoController.updatePromo);
router.delete('/:id', authenticate, authorize(['ADMIN']), promoController.deletePromo);

export default router;
