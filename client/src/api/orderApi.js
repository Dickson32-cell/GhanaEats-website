import api from './axiosInstance';

export const placeOrder = (data) => api.post('/orders', data);
export const getOrders = () => api.get('/orders');
export const getOrderById = (id) => api.get(`/orders/${id}`);
export const trackOrder = (id) => api.get(`/orders/${id}/track`);
