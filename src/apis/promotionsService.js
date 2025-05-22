import api from './api_config';

export const createPromotion = async (formData) => {
  const payload = {
    nombre: formData.nombre,
    tipo_promocion: formData.tipo_promocion,
    valor_descuento: formData.valor_descuento,
    productos_incluidos: formData.productos_incluidos,
  };

  const response = await api.post('/promociones', payload); // Asegurate que esta sea la ruta en tu back
  return response.data;
};
