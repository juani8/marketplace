import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

// Colores personalizados por estado
const ESTADO_COLORES = {
  pendiente: '#facc15',   // amarillo
  aceptada: '#4ade80',    // verde
  rechazada: '#f87171',   // rojo
  cancelada: '#94a3b8',   // violeta
  listo: '#38bdf8',       // celeste
  finalizada: '#10b981'   // verde más oscuro
};

export default function OrderStatusChart({ orders }) {
  const estadoCounts = orders.reduce((acc, order) => {
    const estado = order.estado?.toLowerCase();
    acc[estado] = (acc[estado] || 0) + 1;
    return acc;
  }, {});

  const total = orders.length;
  const chartData = Object.entries(estadoCounts).map(([estado, count]) => ({
    name: estado,
    value: count,
    percentage: ((count / total) * 100).toFixed(1)
  }));

  return (
    <div className="w-full h-96">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={110}
            label={({ name, percentage }) => `${name}: ${percentage}%`}
          >
            {chartData.map(({ name }) => (
              <Cell key={name} fill={ESTADO_COLORES[name] || '#ccc'} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `${value} órdenes`} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
