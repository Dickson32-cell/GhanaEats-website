import api from './axiosInstance';

export const getCategories = () => api.get('/menu/categories');
export const getItems = (params) => api.get('/menu/items', { params });
export const getItemById = (id) => api.get(`/menu/items/${id}`);
