import api from './api_config';

/**
 * Registra un nuevo tenant junto con el usuario administrador.
 * 
 * @param {Object} form - Datos del formulario de registro.
 * @returns {Object} - Datos devueltos por el backend (user, tenant_id, tokens).
 */
export const registerTenantWithAdmin = async (form) => {
  console.log('Payload que se manda a la API:', form);

  const response = await api.post('/auth/register-tenant', {
    nombre_usuario: form.nombre_admin,
    password: form.password,
    nombre: form.nombre,
    razon_social: form.razon_social,
    cuenta_bancaria: form.cuenta_bancaria,
    email: form.email,
    telefono: form.telefono,
    calle: form.calle,
    numero: form.numero,
    ciudad: form.ciudad,
    provincia: form.provincia,
    codigo_postal: form.codigo_postal,
    sitio_web: form.sitio_web || undefined,
    instagram: form.instagram || undefined
  });

  return response.data;
};

/**
 * Inicia sesión de usuario.
 * 
 * @param {string} email 
 * @param {string} password 
 * @returns {Object} - { user, tokens }
 */
export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });

  console.log('Respuesta completa del backend:', response.data);

  const { tokens } = response.data;
  const { accessToken, refreshToken } = tokens;

  // 🔍 Decodificar el JWT para sacar los datos del usuario
  const payloadBase64 = accessToken.split('.')[1];
  const payload = JSON.parse(atob(payloadBase64));

  const user = {
    usuario_id: payload.usuario_id,
    nombre: payload.nombre,
    email: payload.email,
    rol: payload.rol,
    tenant_id: payload.tenant_id,
    comercios: payload.comercios || [] // ✅ Ahora sí vienen los comercios
  };

  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
  localStorage.setItem('sessionInfo', JSON.stringify(user));

  return { user, tokens };
};
