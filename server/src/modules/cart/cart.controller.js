import * as cartService from './cart.service.js';
import { success } from '../../utils/apiResponse.js';

export const getCart = async (req, res, next) => {
  try {
    const data = await cartService.getCart(req.user.id);
    success(res, data);
  } catch (err) { next(err); }
};

export const addItem = async (req, res, next) => {
  try {
    const { menuItemId, quantity } = req.body;
    const data = await cartService.addItem(req.user.id, menuItemId, quantity);
    success(res, data, 'Added to cart', 201);
  } catch (err) { next(err); }
};

export const updateItem = async (req, res, next) => {
  try {
    const data = await cartService.updateItem(req.user.id, req.params.menuItemId, req.body.quantity);
    success(res, data, 'Cart updated');
  } catch (err) { next(err); }
};

export const removeItem = async (req, res, next) => {
  try {
    await cartService.removeItem(req.user.id, req.params.menuItemId);
    success(res, null, 'Removed from cart');
  } catch (err) { next(err); }
};

export const clearCart = async (req, res, next) => {
  try {
    await cartService.clearCart(req.user.id);
    success(res, null, 'Cart cleared');
  } catch (err) { next(err); }
};
