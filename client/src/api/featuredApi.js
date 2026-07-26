import api from './axiosInstance';

export const getFeaturedItems = async () => {
  const response = await api.get('/featured');
  return response.data;
};

export const setFeaturedItems = async (menuItemIds) => {
  const response = await api.post('/featured', { menuItemIds });
  return response.data;
};

export const addFeaturedItem = async (menuItemId) => {
  const response = await api.post('/featured/add', { menuItemId });
  return response.data;
};

export const removeFeaturedItem = async (id) => {
  const response = await api.delete(`/featured/${id}`);
  return response.data;
};

export const reorderFeaturedItems = async (itemIds) => {
  const response = await api.put('/featured/reorder', { itemIds });
  return response.data;
};
