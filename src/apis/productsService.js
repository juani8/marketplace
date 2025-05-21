import mockTenants from '../mocks/mockTenants';

// Crear producto
export const createProduct = async (tenantId, newProduct) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const tenant = mockTenants.find((t) => t.tenant_id === parseInt(tenantId));
      if (!tenant) {
        reject(new Error('Tenant no encontrado'));
        return;
      }

      const productos = tenant.productos || [];
      const newId = productos.length > 0 ? Math.max(...productos.map(p => p.id)) + 1 : 1;

      const productoConId = {
        ...newProduct,
        id: newId,
        fecha_creacion: new Date().toISOString().split('T')[0],
        fecha_actualizacion: new Date().toISOString().split('T')[0],
      };

      tenant.productos.push(productoConId);
      resolve(productoConId);
    }, 500);
  });
};

// Obtener todos los productos de un tenant
export const getProductsByTenant = async (tenantId) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const tenant = mockTenants.find((t) => t.tenant_id === parseInt(tenantId));
      if (tenant) {
        resolve(tenant.productos || []);
      } else {
        reject(new Error('Tenant no encontrado'));
      }
    }, 500);
  });
};

// Obtener un producto por ID dentro de un tenant
export const getProductById = async (tenantId, productId) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const tenant = mockTenants.find((t) => t.tenant_id === parseInt(tenantId));
      if (!tenant) return reject(new Error('Tenant no encontrado'));

      const producto = tenant.productos.find((p) => p.id === parseInt(productId));
      resolve(producto || null);
    }, 500);
  });
};

// Actualizar producto
export const updateProduct = async (tenantId, updatedProduct) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const tenant = mockTenants.find((t) => t.tenant_id === parseInt(tenantId));
      if (!tenant) return reject(new Error('Tenant no encontrado'));

      const index = tenant.productos.findIndex((p) => p.id === updatedProduct.id);
      if (index === -1) return reject(new Error('Producto no encontrado'));

      tenant.productos[index] = {
        ...updatedProduct,
        fecha_actualizacion: new Date().toISOString().split('T')[0],
      };

      resolve(tenant.productos[index]);
    }, 500);
  });
};

// Eliminar producto
export const deleteProduct = async (tenantId, productId) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const tenant = mockTenants.find((t) => t.tenant_id === parseInt(tenantId));
      if (!tenant) return reject(new Error('Tenant no encontrado'));

      const index = tenant.productos.findIndex((p) => p.id === parseInt(productId));
      if (index === -1) return reject(new Error('Producto no encontrado'));

      tenant.productos.splice(index, 1);
      resolve();
    }, 500);
  });
};
