import * as favService from './favorites.service.js';
import { success } from '../../utils/apiResponse.js';

export const getFavorites = async (req, res, next) => {
  try {
    const data = await favService.getFavorites(req.user.id);
    success(res, data);
  } catch (err) { next(err); }
};

export const addFavorite = async (req, res, next) => {
  try {
    const data = await favService.addFavorite(req.user.id, req.body.menuItemId);
    success(res, data, 'Added to favorites', 201);
  } catch (err) { next(err); }
};

export const removeFavorite = async (req, res, next) => {
  try {
    await favService.removeFavorite(req.user.id, req.params.menuItemId);
    success(res, null, 'Removed from favorites');
  } catch (err) { next(err); }
};
