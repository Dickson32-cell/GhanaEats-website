import api from './axiosInstance';

// Public endpoints
export const getActivePromos = () => api.get('/promos/active');

// Admin endpoints
export const getAllPromos = () => api.get('/promos');
export const getPromoById = (id) => api.get(`/promos/${id}`);
export const createPromo = (data) => api.post('/promos', data);
export const updatePromo = (id, data) => api.put(`/promos/${id}`, data);
export const deletePromo = (id) => api.delete(`/promos/${id}`);
