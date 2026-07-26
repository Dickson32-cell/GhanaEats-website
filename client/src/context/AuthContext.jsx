import { createContext, useContext, useState, useEffect } from 'react';
import * as authApi from '../api/authApi';

const AuthContext = createContext(null);

// Decode JWT payload without verification (client-side fallback only).
// Used when getMe() fails due to network issues — the token may still be valid.
const decodeToken = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return { id: payload.id, role: payload.role, name: 'User', email: '' };
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      authApi.getMe()
        .then((res) => setUser(res.data.data))
        .catch(() => {
          // On network errors (timeout, cold start), keep the token and
          // use the decoded JWT as a fallback user so the session survives.
          // The axios interceptor handles 401 (invalid token) separately.
          const fallback = decodeToken(token);
          if (fallback) setUser(fallback);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await authApi.login({ email, password });
    const { user, token } = res.data.data;
    localStorage.setItem('token', token);
    setUser(user);
    return user;
  };

  const register = async (name, email, password) => {
    const res = await authApi.register({ name, email, password });
    const { user, token } = res.data.data;
    localStorage.setItem('token', token);
    setUser(user);
    return user;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin: user?.role === 'ADMIN' }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
