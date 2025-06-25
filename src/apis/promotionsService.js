import api from './api_config';

// Obtener promociones
export const getAllPromotions = async (tenantId) => {
  const response = await api.get('/promotions', {
    headers: {'x-tenant-id': tenantId,},
  });
  return response.data;
};

// Crear promoción
export const createPromotion = async (formData, tenantId) => {
  const payload = {
    nombre: formData.nombre,
    tipo_promocion: formData.tipo_promocion,
    valor_descuento: formData.valor_descuento,
    lista_productos: formData.lista_productos,
    fecha_inicio: formData.fecha_inicio,
    fecha_fin: formData.fecha_fin,
  };

  const response = await api.post('/promotions', payload, {
    headers: {'x-tenant-id': tenantId},
  });

  return response.data;
};

  // Actualizar promoción
  export const updatePromotion = async (promotionId, formData) => {
    const payload = {
      nombre: formData.nombre,
      tipo_promocion: formData.tipo_promocion,
      valor_descuento: formData.valor_descuento,
      fecha_inicio: formData.fecha_inicio,
      fecha_fin: formData.fecha_fin,
      lista_productos: formData.lista_productos,
    };
  
    const response = await api.patch(`/promotions/${promotionId}`, payload);
    return response.data;
  };

  // Eliminar promoción
export const deletePromotion = async (promotionId) => {
    const response = await api.delete(`/promotions/${promotionId}`);
    return response.data;
  };
