import api from './axiosInstance';

// Public API
export const getMenuItemReviews = (menuItemId) =>
  api.get(`/reviews/menu-item/${menuItemId}`);

export const getMenuItemAverageRating = (menuItemId) =>
  api.get(`/reviews/menu-item/${menuItemId}/average`);

// Authenticated API
export const createReview = (data) =>
  api.post('/reviews', data);

export const getUserReviews = () =>
  api.get('/reviews/my-reviews');

export const getOrderReviews = (orderId) =>
  api.get(`/reviews/order/${orderId}`);

export const updateReview = (id, data) =>
  api.put(`/reviews/${id}`, data);

export const deleteReview = (id) =>
  api.delete(`/reviews/${id}`);
