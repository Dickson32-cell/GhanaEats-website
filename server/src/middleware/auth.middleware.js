import { verifyToken } from '../utils/jwt.utils.js';
import { error } from '../utils/apiResponse.js';

export const authenticate = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return error(res, 'Unauthorized', 401);

  try {
    const token = header.split(' ')[1];
    req.user = verifyToken(token);
    next();
  } catch {
    return error(res, 'Invalid or expired token', 401);
  }
};

export const authorize = (roles) => {
  return (req, res, next) => {
    if (!req.user) return error(res, 'Unauthorized', 401);
    if (!roles.includes(req.user.role)) return error(res, 'Forbidden - Insufficient permissions', 403);
    next();
  };
};
