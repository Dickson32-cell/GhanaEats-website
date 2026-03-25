import * as adminService from './admin.service.js';
import { success } from '../../utils/apiResponse.js';

export const getDashboard = async (req, res, next) => {
  try { success(res, await adminService.getDashboard()); }
  catch (err) { next(err); }
};

export const getRevenue = async (req, res, next) => {
  try { success(res, await adminService.getRevenue()); }
  catch (err) { next(err); }
};

export const getAllOrders = async (req, res, next) => {
  try { success(res, await adminService.getAllOrders(req.query)); }
  catch (err) { next(err); }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const data = await adminService.updateOrderStatus(req.params.id, req.body.status, req.user.id);
    success(res, data, 'Order status updated');
  } catch (err) { next(err); }
};

export const getAllMenuItems = async (req, res, next) => {
  try { success(res, await adminService.getAllMenuItems()); }
  catch (err) { next(err); }
};

export const createMenuItem = async (req, res, next) => {
  try {
    const data = await adminService.createMenuItem(req.body);
    success(res, data, 'Menu item created', 201);
  } catch (err) { next(err); }
};

export const updateMenuItem = async (req, res, next) => {
  try {
    const data = await adminService.updateMenuItem(req.params.id, req.body);
    success(res, data, 'Menu item updated');
  } catch (err) { next(err); }
};

export const deleteMenuItem = async (req, res, next) => {
  try {
    await adminService.deleteMenuItem(req.params.id);
    success(res, null, 'Menu item disabled');
  } catch (err) { next(err); }
};

export const getAllUsers = async (req, res, next) => {
  try { success(res, await adminService.getAllUsers()); }
  catch (err) { next(err); }
};
