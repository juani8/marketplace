import api from './api_config';

// Obtener los comercios visibles para el usuario logueado (admin u operador)
export const getSellersByUsuario = async (usuarioId) => {
  const response = await api.post('/sellers/list', { usuario_id: usuarioId });
  return response.data.data;
};