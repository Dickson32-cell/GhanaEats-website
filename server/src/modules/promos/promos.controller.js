import * as promoService from './promos.service.js';
import { success } from '../../utils/apiResponse.js';

export const getAllPromos = async (req, res, next) => {
  try {
    const promos = await promoService.getAllPromos();
    success(res, promos);
  } catch (err) {
    next(err);
  }
};

export const getActivePromos = async (req, res, next) => {
  try {
    const promos = await promoService.getActivePromos();
    success(res, promos);
  } catch (err) {
    next(err);
  }
};

export const getPromoById = async (req, res, next) => {
  try {
    const promo = await promoService.getPromoById(req.params.id);
    if (!promo) {
      return res.status(404).json({ success: false, message: 'Promo not found' });
    }
    success(res, promo);
  } catch (err) {
    next(err);
  }
};

export const createPromo = async (req, res, next) => {
  try {
    const promo = await promoService.createPromo(req.body);
    success(res, promo, 'Promo created successfully');
  } catch (err) {
    next(err);
  }
};

export const updatePromo = async (req, res, next) => {
  try {
    const promo = await promoService.updatePromo(req.params.id, req.body);
    success(res, promo, 'Promo updated successfully');
  } catch (err) {
    next(err);
  }
};

export const deletePromo = async (req, res, next) => {
  try {
    await promoService.deletePromo(req.params.id);
    success(res, null, 'Promo deleted successfully');
  } catch (err) {
    next(err);
  }
};
