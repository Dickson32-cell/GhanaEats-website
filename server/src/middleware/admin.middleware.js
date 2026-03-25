import { error } from '../utils/apiResponse.js';

export const requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'ADMIN') return error(res, 'Forbidden', 403);
  next();
};
