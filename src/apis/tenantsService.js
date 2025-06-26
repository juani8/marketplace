import api from './api_config'; 

// Obtener todos los tenants
export const getAllTenants = async () => {
  const res = await api.get('/tenants'); // 
  console.log('Respuesta del backend:', res.data);
  return res.data.data;
};

// Obtener tenant por ID
export const getTenantById = async () => {
  const res = await api.get('/tenants');
  const tenants = res.data.data;

  if (!Array.isArray(tenants) || tenants.length === 0) {
    throw new Error('No hay tenants disponibles.');
  }

  return tenants[0]; // toma el primero
};

// Crear un nuevo tenant
export const createTenant = async (newTenant) => {
  const response = await api.post('/tenants', newTenant);
  return response.data;
};

// Modificar tenant
export const updateTenant = async (updatedTenant) => {
  const response = await api.patch(`/tenants/${updatedTenant.tenant_id}`, updatedTenant);
  return response.data;
};

// Eliminar tenant
export const deleteTenant = async (id) => {
  await api.delete(`/tenants/${id}`);
};
