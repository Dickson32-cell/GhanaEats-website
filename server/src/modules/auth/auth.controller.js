import * as authService from './auth.service.js';
import { success } from '../../utils/apiResponse.js';

export const register = async (req, res, next) => {
  try {
    const result = await authService.register(req.body);
    success(res, result, 'Registered successfully', 201);
  } catch (err) { next(err); }
};

export const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    success(res, result, 'Logged in successfully');
  } catch (err) { next(err); }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await authService.getMe(req.user.id);
    success(res, user);
  } catch (err) { next(err); }
};

export const updateMe = async (req, res, next) => {
  try {
    const user = await authService.updateMe(req.user.id, req.body);
    success(res, user, 'Profile updated');
  } catch (err) { next(err); }
};

export const changePassword = async (req, res, next) => {
  try {
    await authService.changePassword(req.user.id, req.body);
    success(res, null, 'Password changed successfully');
  } catch (err) { next(err); }
};
