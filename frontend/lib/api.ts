import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  signup: (data: { email: string; password: string; name: string }) =>
    api.post('/auth/signup', data),
  
  verifyOTP: (data: { email: string; otp: string }) =>
    api.post('/auth/verify-otp', data),
  
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  
  getProfile: () =>
    api.get('/user/profile'),
};

export const stockAPI = {
  predict: (symbol: string) =>
    api.post('/stocks/predict', { symbol }),
  
  getHistory: (symbol: string, period: string = '1mo') =>
    api.get(`/stocks/history?symbol=${symbol}&period=${period}`),
  
  search: (query: string) =>
    api.get(`/stocks/search?q=${query}`),
};

export const portfolioAPI = {
  getPortfolio: () =>
    api.get('/portfolio'),
  
  trade: (data: { symbol: string; action: string; quantity: number; price: number }) =>
    api.post('/portfolio/trade', data),
  
  getTransactions: () =>
    api.get('/transactions'),
};

export default api;
