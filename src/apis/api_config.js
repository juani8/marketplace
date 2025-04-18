// src/api/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
  // baseURL:'http://localhost:3000', // Para pruebas locales
  withCredentials: true
});

export default api;