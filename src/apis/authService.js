import api from './api_config';

/**
 * Registra un nuevo tenant junto con el usuario administrador.
 * 
 * @param {Object} form - Datos del formulario de registro.
 * @returns {Object} - Datos devueltos por el backend (user, tenant_id, tokens).
 */
export const registerTenantWithAdmin = async (form) => {
  console.log('payload que se manda a la API:', form);
  const response = await api.post('/auth/register-tenant', {
    nombre_tenant: form.nombre,
    razon_social: form.razon_social,
    cuenta_bancaria: form.cuenta_bancaria,
    email: form.email,
    nombre_usuario: form.nombre_admin,
    password: form.password
  });

  return response.data;
};

/**
 * Inicia sesión de usuario.
 * 
 * @param {string} email 
 * @param {string} password 
 * @returns {Object} - { accessToken, user }
 */
export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });

  console.log('Respuesta completa del backend:', response.data);

  const { user, tokens } = response.data;
  const { accessToken, refreshToken } = tokens;

  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
  localStorage.setItem('sessionInfo', JSON.stringify(user));

  return { user, tokens };
};
