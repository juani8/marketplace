import api from './api_config';

// Crear producto
export const createProduct = async (tenantId, formData) => {
  const data = new FormData();

  data.append('nombre_producto', formData.nombre);
  data.append('descripcion', formData.descripcion);
  data.append('precio', formData.precio);
  data.append('cantidad_stock', formData.stock);
  data.append('categoria_id', formData.categoria); // debe ser el ID de categoría
  data.append('tenant_id', tenantId);

  formData.imagenes.forEach((imgFile) => {
    data.append('imagenes', imgFile); // deben ser File, no base64
  });

  const response = await api.post('/products', data);

  return response.data;
};

// Obtener todos los productos de un tenant
export const getAllProducts = async () => {
  const res = await api.get('/products');
  return res.data; // el array de productos viene directamente
};

// Obtener producto por Id
export const getProductById = async (productId) => {
  const response = await api.get(`/products/${productId}`);
  const p = response.data;

  return {
    id: parseInt(p.producto_id),
    nombre: p.nombre_producto,
    precio: p.precio,
    descripcion: p.descripcion,
    stock: p.cantidad_stock,
    categoria: p.categoria?.categoria_id || '',
    imagenes: p.imagenes || [],
  };
};


// Actualizar producto
export const updateProduct = async (tenantId, formData) => {
  const data = new FormData();

  data.append('nombre_producto', formData.nombre);
  data.append('descripcion', formData.descripcion);
  data.append('precio', formData.precio);
  data.append('cantidad_stock', formData.stock);
  data.append('categoria_id', formData.categoria);
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

