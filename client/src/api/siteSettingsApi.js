import api from './axiosInstance';

// Public — get all settings as key→value map
export const getPublicSettings = () => api.get('/settings');

// Admin — get settings grouped by category
export const getAdminSettings = () => api.get('/settings/admin');

// Admin — bulk update settings
export const updateSettings = (data) => api.put('/settings', data);

// Admin — delete a setting
export const deleteSetting = (key) => api.delete(`/settings/${key}`);