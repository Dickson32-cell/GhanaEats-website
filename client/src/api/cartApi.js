import api from './axiosInstance';

export const getCart = () => api.get('/cart');
export const addItem = (menuItemId, quantity = 1) => api.post('/cart', { menuItemId, quantity });
export const updateItem = (menuItemId, quantity) => api.put(`/cart/${menuItemId}`, { quantity });
export const removeItem = (menuItemId) => api.delete(`/cart/${menuItemId}`);
export const clearCart = () => api.delete('/cart');
