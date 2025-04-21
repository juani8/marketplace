import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const getAllTenants = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/tenants`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener tenants:', error);
    throw error;
  }
};