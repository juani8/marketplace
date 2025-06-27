import api from './api_config';

export async function getOrdersByComercio(comercioId) {
  try {
    const response = await api.get(`/orders/${comercioId}`); // 👉 baseURL ya es '/api'
    console.log('Respuesta de backend:', response.data);

    const rawOrders = response?.data?.data;

    if (!Array.isArray(rawOrders)) {
      console.warn('No se recibió un array de órdenes');
      return [];
    }

    return rawOrders.map(order => ({
      id: order.orden_id,
      cliente: order.cliente_nombre,
      estado: capitalizar(order.estado),
      total: parseFloat(order.total),
      fecha: formatearFecha(order.fecha_creacion),
      detalles: `Pago: ${order.medios_pago}, Entrega: ${order.direccion_entrega}`
    }));
  } catch (error) {
    console.error('Error al obtener órdenes:', error);
    return [];
  }
}

// Helpers
function formatearFecha(fechaISO) {
  const date = new Date(fechaISO);
  return date.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

function capitalizar(texto) {
  return texto?.charAt(0).toUpperCase() + texto?.slice(1).toLowerCase();
}
