import api from './api_config';

// Obtener los comercios visibles para el usuario logueado (admin u operador)
export const getSellersByUsuario = async (usuario_id) => {
  const response = await api.post('/sellers/list', { usuario_id });
  return response.data.data;
};