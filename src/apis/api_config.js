// src/api/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://marketplace-services-v8vn.onrender.com', // Reemplaza por tu backend real
  withCredentials: true
});

export default api;
