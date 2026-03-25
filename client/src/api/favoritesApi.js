import api from './axiosInstance';

export const getFavorites = () => api.get('/favorites');
export const addFavorite = (menuItemId) => api.post('/favorites', { menuItemId });
export const removeFavorite = (menuItemId) => api.delete(`/favorites/${menuItemId}`);
