export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
  HISTORY: '/history',
  SETTINGS: '/settings'
};

export const STORAGE_KEYS = {
  USER: 'user',
  TOKEN: 'token'
};