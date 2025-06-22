import PropTypes from 'prop-types';

export default function OrderMetrics({ orders }) {
  // Estados válidos (en singular)
  const estadosValidos = ['Pendiente', 'Entregada', 'Cancelada'];

  // Mapea a etiquetas legibles en plural
  const etiquetasEstado = {
    Pendiente: 'Órdenes Pendientes',
    Entregada: 'Órdenes Entregadas',
    Cancelada: 'Órdenes Canceladas',
  };

  // Inicializa conteo
  const conteoPorEstado = estadosValidos.reduce((acc, estado) => {
    acc[estado] = 0;
    return acc;
  }, {});

  // Cuenta las órdenes por estado
  orders.forEach(order => {
    if (conteoPorEstado.hasOwnProperty(order.estado)) {
      conteoPorEstado[order.estado]++;
    }
  });

  const totalVentas = orders.reduce((sum, o) => sum + o.total, 0);
  const promedioEntrega = 2; // Lógica futura

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      {estadosValidos.map(estado => (
        <div key={estado} className="bg-white p-4 rounded shadow text-center border">
          <div className="text-gray-500 text-sm">{etiquetasEstado[estado]}</div>
          <div className="text-xl font-semibold">{conteoPorEstado[estado]}</div>
        </div>
      ))}

      <div className="bg-white p-4 rounded shadow text-center border">
        <div className="text-gray-500 text-sm">Volumen Total de Ventas</div>
        <div className="text-xl font-semibold">${totalVentas}</div>
      </div>

    </div>
  );
}

OrderMetrics.propTypes = {
  orders: PropTypes.array.isRequired,
};
