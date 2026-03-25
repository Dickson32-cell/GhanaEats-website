import * as menuService from './menu.service.js';
import { success } from '../../utils/apiResponse.js';

export const getCategories = async (req, res, next) => {
  try {
    const data = await menuService.getCategories();
    success(res, data);
  } catch (err) { next(err); }
};

export const getItems = async (req, res, next) => {
  try {
    const data = await menuService.getItems(req.query);
    success(res, data);
  } catch (err) { next(err); }
};

export const getItemById = async (req, res, next) => {
  try {
    const data = await menuService.getItemById(req.params.id);
    success(res, data);
  } catch (err) { next(err); }
};
