// src/apis/sellersService.js
import api from './api_config';

// Crear seller
export const createSeller = async (formData) => {
  const response = await api.post('/sellers', formData);
  return response.data;
};

// Actualizar seller
export const updateSeller = async (id, formData) => {
  const response = await api.patch(`/sellers/${id}`, formData);
  return response.data;
};

// Obtener todos los sellers del tenant actual
export const getSellers = async () => {
  const response = await api.get('/sellers');
  return response.data;
};

// Obtener seller por ID
export const getSellerById = async (id) => {
  const response = await api.get(`/sellers/${id}`);
  return response.data;
};

// Eliminar seller
export const deleteSeller = async (id) => {
  const response = await api.delete(`/sellers/${id}`);
  return response.data;
};
