import PropTypes from 'prop-types';
import SearchInput from './SearchInput';

export default function OrderTable({ orders, filters, setFilters, onSelectOrder }) {
  return (
    <>
      <div className="overflow-x-auto rounded-md shadow bg-white mb-4">
        {/* Filtros */}
        <div className="flex gap-4 mb-4 p-4 flex-wrap items-center">
          <SearchInput
            value={filters.cliente}
            onChange={(e) => setFilters({ ...filters, cliente: e.target.value })}
            placeholder="Buscar cliente..."
          />

          <select
            value={filters.estado}
            onChange={(e) => setFilters({ ...filters, estado: e.target.value })}
            className="border rounded px-3 py-2 text-sm"
          >
            <option value="">Todos los estados</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Aceptada">Aceptada</option>
            <option value="Rechazada">Rechazada</option>
            <option value="Cancelada">Cancelada</option>
            <option value="Listo">Listo</option>
            <option value="Finalizada">Finalizada</option>
          </select>

          <input
            type="date"
            value={filters.desde}
            onChange={(e) => setFilters({ ...filters, desde: e.target.value })}
            className="border rounded px-3 py-2 text-sm"
          />
          <input
            type="date"
            value={filters.hasta}
            onChange={(e) => setFilters({ ...filters, hasta: e.target.value })}
            className="border rounded px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-md shadow bg-white">
        {/* Tabla */}
        <div className="max-h-[70vh] overflow-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr className="text-left text-gray-600">
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Fecha</th>
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr
                  key={order.id}
                  className={`border-t hover:bg-blue-50 cursor-pointer ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  }`}
                  onClick={() => onSelectOrder(order)}
                >
                  <td className="px-4 py-2">{order.id}</td>
                  <td className="px-4 py-2">{order.fecha}</td>
                  <td className="px-4 py-2">{order.cliente}</td>
                  <td className="px-4 py-2">{order.estado}</td>
                  <td className="px-4 py-2">${order.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

OrderTable.propTypes = {
  orders: PropTypes.array.isRequired,
  filters: PropTypes.object.isRequired,
  setFilters: PropTypes.func.isRequired,
  onSelectOrder: PropTypes.func.isRequired,
};
