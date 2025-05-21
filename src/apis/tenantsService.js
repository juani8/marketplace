import api from './api_config'; // nuevo

// Obtener todos los tenants
export const getAllTenants = async () => {
  const res = await api.get('/tenants'); // 
  console.log('Respuesta del backend:', res.data);
  return res.data.data;
};

// Obtener tenant por ID
export const getTenantById = async (id) => {
  const response = await api.get(`/tenants/${id}`);
  return response.data;
};

// Crear un nuevo tenant
export const createTenant = async (newTenant) => {
  const response = await api.post('/tenants', newTenant);
  return response.data;
};

// Modificar tenant
export const updateTenant = async (updatedTenant) => {
  const response = await api.put(`/tenants/${updatedTenant.tenant_id}`, updatedTenant);
  return response.data;
};

// Eliminar tenant
export const deleteTenant = async (id) => {
  await api.delete(`/tenants/${id}`);
};