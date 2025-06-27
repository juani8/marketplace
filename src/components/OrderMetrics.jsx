import PropTypes from 'prop-types';

export default function OrderMetrics({ orders }) {
  const estadosValidos = ['Pendiente', 'Aceptada', 'Rechazada', 'Cancelada', 'Listo', 'Finalizada'];

  const etiquetasEstado = {
    Pendiente: 'Órdenes Pendientes',
    Aceptada: 'Órdenes Aceptadas',
    Rechazada: 'Órdenes Rechazadas',
    Cancelada: 'Órdenes Canceladas',
    Listo: 'Órdenes Listas',
    Finalizada: 'Órdenes Finalizadas',
  };

  const coloresEstado = {
    Pendiente: '#facc15',
    Aceptada: '#4ade80',
    Rechazada: '#f87171',
    Cancelada: '#94a3b8',
    Listo: '#38bdf8',
    Finalizada: '#10b981',
  };

  const conteoPorEstado = estadosValidos.reduce((acc, estado) => {
    acc[estado] = 0;
    return acc;
  }, {});

  orders.forEach(order => {
    if (conteoPorEstado.hasOwnProperty(order.estado)) {
      conteoPorEstado[order.estado]++;
    }
  });

  const totalVentas = orders
  .filter(o => o.estado === 'Finalizada')
  .reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      {estadosValidos.map(estado => (
        <div
          key={estado}
          className="bg-white p-4 rounded shadow text-center border"
          style={{ borderColor: coloresEstado[estado], borderWidth: '2px' }}
        >
          <div className="text-gray-500 text-sm">{etiquetasEstado[estado]}</div>
          <div className="text-xl font-semibold">{conteoPorEstado[estado]}</div>
        </div>
      ))}

      <div className="bg-white p-4 rounded shadow text-center border border-gray-300">
        <div className="text-gray-500 text-sm">Volumen Total de Ventas</div>
        <div className="text-xl font-semibold">${totalVentas}</div>
      </div>
    </div>
  );
}

OrderMetrics.propTypes = {
  orders: PropTypes.array.isRequired,
};
