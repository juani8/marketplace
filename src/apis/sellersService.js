import api from './api_config';

// GET /sellers → devuelve comercios del usuario (filtrados por el backend)
export const getAllSellers = async () => {
  const response = await api.get('/sellers');
  return response.data.data; // 
};

// GET /sellers/:id → obtener un comercio específico
export const getSellerById = async (id) => {
  const response = await api.get(`/sellers/${id}`);
  return response.data.data;
};


// POST /sellers → crear nuevo comercio
export const createSeller = async (sellerData) => {
  const response = await api.post('/sellers', sellerData);
  return response.data;
};

// PATCH /sellers/:id → actualizar comercio existente
export const updateSeller = async (id, updateData) => {
  const response = await api.patch(`/sellers/${id}`, updateData);
  return response.data;
};

// DELETE /sellers/:id → eliminar comercio
export const deleteSeller = async (id) => {
  const response = await api.delete(`/sellers/${id}`);
  return response.data;
};
