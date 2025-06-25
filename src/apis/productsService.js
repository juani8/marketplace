import api from './api_config';

// Crear producto
export const createProduct = async (formData) => {
  const data = new FormData();

  data.append('nombre_producto', formData.nombre_producto);
  data.append('descripcion', formData.descripcion);
  data.append('precio', formData.precio);
  data.append('categoria_id', Number(formData.categoria_id));

  formData.imagenes.forEach((imgFile) => {
    data.append('imagenes', imgFile);
  });

  const response = await api.post('/products', data, {
    headers: {
      'x-tenant-id': formData.tenant_id, // header
    },
  });

  return response.data;
};

// ✅ Obtener todos los productos de un comercio
export const getAllProducts = async (comercioId) => {
  const res = await api.get(`/sellers/${comercioId}/products`);
  return res.data.data; // ✅ esto incluye { comercio, productos }
};

// ✅ Obtener todos los productos de un tenant (sin filtrar por comercio)
export const getAllProductsByTenant = async (tenantId) => {
  const response = await api.get('/products', {
    headers: {'x-tenant-id': tenantId,},
  });
  return response.data;
};

// Obtener producto por Id
export const getProductById = async (productId) => {
  const response = await api.get(`/products/${productId}`);
  const p = response.data;

  return {
    id: parseInt(p.producto_id),
    nombre_producto: p.nombre_producto,
    precio: p.precio,
    descripcion: p.descripcion,
    cantidad_stock: p.cantidad_stock,
    categoria_id: p.categoria?.categoria_id || '',
    imagenes: p.imagenes || [],
  };
};

// Actualizar producto
export const updateProduct = async (tenantId, formData) => {
  const data = new FormData();

  data.append('nombre_producto', formData.nombre_producto);
  data.append('descripcion', formData.descripcion);
  data.append('precio', formData.precio);
  data.append('categoria_id', formData.categoria_id);
  data.append('tenant_id', tenantId);

  // ✅ Solo se mandan imágenes nuevas (archivos)
  const nuevasImagenes = formData.imagenes.filter((img) => img instanceof File);
  if (nuevasImagenes.length > 0) {
    nuevasImagenes.forEach((file) => {
      data.append('imagenes', file);
    });
  }

  const response = await api.patch(`/products/${formData.id}`, data);
  return response.data;
};

// Eliminar producto
export const deleteProduct = async (productId) => {
  const response = await api.delete(`/products/${productId}`);
  return response.data;
};
