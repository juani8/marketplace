import api from './api_config';

export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', {
      email,
      password,
    });

    return response.data; // debe incluir token y user (con userId, role, tenantId, tipoUsuario)
  } catch (error) {
    if (error.response && error.response.status === 401) {
      throw new Error('Credenciales inválidas');
    } else {
      throw new Error('Error al intentar iniciar sesión');
    }
  }
};


export const register = async (form) => {
  const { email, password, rol, comercioIds } = form;

  // Si es operador, tiene para seleccionar comercios ya creados
  if (rol === 'operador') {
    const payload = {
      email,
      password,
      rol,
      comercioIds, // array de IDs seleccionados
    };

    const response = await api.post('/auth/register', payload);
    return response.data;
  }

  // si es admin, crea el comercio y puede acceder a todos
  const payload = {
    email,
    password,
    rol,
    nombreComercio: form.nombreComercio,
    tipoComercio: form.tipoComercio,
  };

  const response = await api.post('/auth/register', payload);
  return response.data;
};

export const registerInternalAdmin = async ({ tenant_id, email, password, nombre }) => {
  const payload = {
    tenant_id,
    email,
    password,
    nombre,
    rol: 'admin'
  };

  const response = await api.post('/auth/register-internal', payload);
  return response.data;
};


