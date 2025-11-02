export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user'
};

export const ROUTES = {
  LOGIN: '/login',
  SIGNUP: '/signup', 
  DASHBOARD: '/dashboard',
  HISTORY: '/history',
  SETTINGS: '/settings'
};