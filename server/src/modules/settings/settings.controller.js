import * as settingsService from './settings.service.js';
import { success } from '../../utils/apiResponse.js';

// Public — get all settings as key→value map (for frontend rendering)
export const getPublicSettings = async (req, res, next) => {
  try {
    const settings = await settingsService.getAllSettings();
    success(res, settings);
  } catch (err) { next(err); }
};

// Admin — get settings grouped by category
export const getAdminSettings = async (req, res, next) => {
  try {
    const grouped = await settingsService.getSettingsByCategory();
    success(res, grouped);
  } catch (err) { next(err); }
};

// Admin — bulk update settings
export const updateSettings = async (req, res, next) => {
  try {
    const result = await settingsService.updateSettings(req.body);
    success(res, result, 'Settings updated successfully');
  } catch (err) { next(err); }
};

// Admin — delete a setting
export const deleteSetting = async (req, res, next) => {
  try {
    await settingsService.deleteSetting(req.params.key);
    success(res, null, 'Setting deleted');
  } catch (err) { next(err); }
};