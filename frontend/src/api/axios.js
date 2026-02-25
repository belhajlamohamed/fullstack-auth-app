import axios from 'axios';

const api = axios.create({
  // L'URL de ton backend FastAPI
  baseURL: 'http://127.0.0.1:8000', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Cet intercepteur ajoutera le token automatiquement plus tard
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;