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
      // Clear the invalid token — React Router handles redirects via
      // AdminRoute / ProtectedRoute which pass the current location
      // to the login page so the user returns after re-authenticating.
      // NEVER do a hard window.location redirect here — it bypasses
      // React Router and causes the admin page to lose context.
      const hadToken = localStorage.getItem('token');
      localStorage.removeItem('token');
      // No redirect at all — just reject the promise.
      // AuthContext will set user=null, AdminRoute/ProtectedRoute
      // will handle the redirect via React Router <Navigate>.
    }
    return Promise.reject(err);
  }
);

export default api;
