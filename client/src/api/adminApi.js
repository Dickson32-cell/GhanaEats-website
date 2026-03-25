import api from './axiosInstance';

export const getDashboard = () => api.get('/admin/dashboard');
export const getRevenue = () => api.get('/admin/revenue');
export const getAllOrders = (params) => api.get('/admin/orders', { params });
export const updateOrderStatus = (id, status) => api.put(`/admin/orders/${id}/status`, { status });
export const getAllMenuItems = () => api.get('/admin/menu');
export const createMenuItem = (data) => api.post('/admin/menu', data);
export const updateMenuItem = (id, data) => api.put(`/admin/menu/${id}`, data);
export const deleteMenuItem = (id) => api.delete(`/admin/menu/${id}`);
export const getAllUsers = () => api.get('/admin/users');
