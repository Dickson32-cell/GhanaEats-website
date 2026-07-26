import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      // Clear the invalid token — let React Router handle the redirect
      // via ProtectedRoute/AdminRoute instead of a hard browser redirect
      const hadToken = localStorage.getItem('token');
      localStorage.removeItem('token');
      // Only redirect if we're NOT already on login/signup and we had a token
      // (meaning the session expired, not that we're just browsing unauthenticated)
      if (hadToken && !window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/signup')) {
        // Use a soft redirect that preserves the current path for return-after-login
        const currentPath = window.location.pathname + window.location.search;
        window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
      }
    }
    return Promise.reject(err);
  }
);

export default api;
