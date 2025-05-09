import axios from 'axios';

const api = axios.create({
  baseURL: 'https://marketplace-services-v8vn.onrender.com/api', // 
  withCredentials: true,
});

export default api;