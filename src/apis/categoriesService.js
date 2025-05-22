import api from './api_config';

export const getAllCategories = async () => {
  const res = await api.get('/git');
  return res.data; // El backend devuelve un array directo
};