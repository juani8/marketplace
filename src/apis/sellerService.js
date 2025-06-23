// 2.1 Obtener Comercios Cercanos (por lat/lon)
export const getNearbySellers = async (lat, lon) => {
  if (!lat || !lon) {
    throw new Error('Faltan coordenadas para obtener comercios cercanos');
  }
  const response = await api.get(`/sellers?lat=${lat}&lon=${lon}`);
  return response.data;
};

// 2.2 Listar Comercios del Tenant actual (requiere usuario_id en body TEMPORAL hasta tener JWT)
export const getSellersByTenant = async () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const usuarioId = user?.userId;

  if (!usuarioId) {
    throw new Error('No se encontró userId en localStorage');
  }

  const response = await api.post('/sellers', { usuario_id: usuarioId });
  return response.data;
};

// 2.3 Obtener Comercio Específico
export const getSellerById = async (id) => {
  const response = await api.get(`/sellers/${id}`);
  return response.data;
};

// 2.4 Crear nuevo Comercio
export const createSeller = async (formData) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const usuarioId = user?.userId;

  if (!usuarioId) {
    throw new Error('No se encontró userId en localStorage');
  }

  const payload = {
    ...formData,
    usuario_id: usuarioId
  };

  const response = await api.post('/sellers', payload);
  return response.data;
};

// 2.5 Actualizar Comercio
export const updateSeller = async (id, formData) => {
  const response = await api.patch(`/sellers/${id}`, formData);
  return response.data;
};

// 2.6 Eliminar Comercio
export const deleteSeller = async (id) => {
  const response = await api.delete(`/sellers/${id}`);
  return response.data;
};

// 3.1 Obtener productos con stock de un comercio
export const getProductsWithStock = async (sellerId) => {
  const response = await api.get(`/sellers/${sellerId}/products`);
  return response.data;
};

// 3.2 Obtener stock específico de un producto
export const getStockByProduct = async (sellerId, productId) => {
  const response = await api.get(`/sellers/${sellerId}/products/${productId}/stock`);
  return response.data;
};

// 3.3 Actualizar stock de un producto
export const updateProductStock = async (sellerId, productId, stockData) => {
  const response = await api.patch(`/sellers/${sellerId}/products/${productId}/stock`, stockData);
  return response.data;
};
