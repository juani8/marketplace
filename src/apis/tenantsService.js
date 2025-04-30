import mockTenants from '../mocks/mockTenants';

// Obtener todos los tenants
export const getAllTenants = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockTenants);
    }, 500);
  });
};

// Obtener tenant por ID
export const getTenantById = async (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const tenant = mockTenants.find((t) => t.tenant_id === parseInt(id));
      resolve(tenant || null);
    }, 500);
  });
};

// Crear un nuevo tenant
export const createTenant = async (newTenant) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newId = mockTenants.length > 0 ? Math.max(...mockTenants.map((t) => t.tenant_id)) + 1 : 1;
      const tenantWithId = { ...newTenant, tenant_id: newId };
      mockTenants.push(tenantWithId);
      resolve(tenantWithId);
    }, 500);
  });
};

// Modificar tenant
export const updateTenant = async (updatedTenant) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockTenants.findIndex((t) => t.tenant_id === updatedTenant.tenant_id);
      if (index !== -1) {
        mockTenants[index] = updatedTenant;
        resolve(updatedTenant);
      } else {
        reject(new Error('Tenant no encontrado'));
      }
    }, 500);
  });
};

// Eliminar un tenant
export const deleteTenant = async (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockTenants.findIndex((t) => t.tenant_id === id);
      if (index !== -1) {
        mockTenants.splice(index, 1);
        resolve();
      } else {
        reject(new Error('Tenant no encontrado'));
      }
    }, 500);
  });
};
