import api from './api_config';

export const getAllCategories = async () => {
  const response = await api.get('/categories');
  return response.data;
};
