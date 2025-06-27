import api from './api_config';

/**
 * Obtener comercios disponibles para asignar (solo para el tenant del usuario admin).
 * Se asume que el backend filtra por el token del usuario logueado.
 */
export const getAllCommerces = async () => {
  const response = await api.get('/sellers');
  return response.data?.data || [];
};
/**
 * Registrar usuario interno (admin u operador).
 * @param {{
 *   nombre: string,
 *   email: string,
 *   password: string,
 *   rol: 'admin' | 'operador',
 *   comercios_autorizados_id?: number[]
 * }} payload
 */
export const registerInternalUser = async (payload) => {
  const response = await api.post('/auth/register-internal', payload);
  return response.data;
};
