// ─────────────────────────────────────────────────────────────
//  api/axios.js — Configured Axios instance
//  Auto-attaches Bearer token to every request
// ─────────────────────────────────────────────────────────────
import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 15000, // 15 second timeout
});

// ── Request interceptor: attach JWT token ─────────────────────
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('sf_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor: handle 401 globally ─────────────────
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // If token expired/invalid, clear storage and redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem('sf_token');
      localStorage.removeItem('sf_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default API;
