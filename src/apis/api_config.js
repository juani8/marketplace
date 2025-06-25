import axios from 'axios';
console.log('API Base URL:', import.meta.env.VITE_API_BASE_URL); // útil para debug


const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

export default api;
