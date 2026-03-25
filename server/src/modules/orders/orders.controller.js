import * as ordersService from './orders.service.js';
import { success } from '../../utils/apiResponse.js';

export const placeOrder = async (req, res, next) => {
  try {
    const data = await ordersService.placeOrder(req.user.id, req.body);
    success(res, data, 'Order placed successfully', 201);
  } catch (err) { next(err); }
};

export const getOrders = async (req, res, next) => {
  try {
    const data = await ordersService.getOrders(req.user.id);
    success(res, data);
  } catch (err) { next(err); }
};

export const getOrderById = async (req, res, next) => {
  try {
    const data = await ordersService.getOrderById(req.user.id, req.params.id);
    success(res, data);
  } catch (err) { next(err); }
};

export const trackOrder = async (req, res, next) => {
  try {
    const data = await ordersService.trackOrder(req.user.id, req.params.id);
    success(res, data);
  } catch (err) { next(err); }
};
