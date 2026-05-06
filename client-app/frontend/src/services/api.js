import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor — on 401 redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isGuestPath = window.location.pathname.includes('/login') || window.location.pathname.includes('/register');
    if (error.response?.status === 401 && !isGuestPath) {
      // Clear any local state and redirect
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
