import axios from 'axios';

const api = axios.create({
  baseURL: "http://localhost:3000/api", // 'https://marketplace-services-v8vn.onrender.com/api'
  withCredentials: true,
});

export default api;