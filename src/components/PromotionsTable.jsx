import PropTypes from 'prop-types';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

export default function PromotionsTable({ promotions, onEdit, onDelete }) {
  const { rol } = useAuth();

  if (promotions.length === 0) {
    return (
      <div className="text-center text-gray-600 py-20 text-lg">
        No hay promociones disponibles.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      {/* Tabla desktop con sticky header */}
      <div className="max-h-[70vh] overflow-auto rounded-md shadow hidden md:block">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr className="text-left">
              <th className="py-3 px-6 sticky top-0 z-10 bg-gray-100">Nombre</th>
              <th className="py-3 px-6 sticky top-0 z-10 bg-gray-100">Tipo</th>
              <th className="py-3 px-6 sticky top-0 z-10 bg-gray-100">Descuento</th>
              <th className="py-3 px-6 sticky top-0 z-10 bg-gray-100">Fecha Inicio</th>
              <th className="py-3 px-6 sticky top-0 z-10 bg-gray-100">Fecha Fin</th>
              <th className="py-3 px-6 sticky top-0 z-10 bg-gray-100"># Productos</th>
              <th className="py-3 px-6 sticky top-0 z-10 bg-gray-100">Productos con Descuento</th>
              {rol === 'admin' && (
                <th className="py-3 px-6 sticky top-0 z-10 bg-gray-100">Acciones</th>
              )}
            </tr>
          </thead>
          <tbody>
            {promotions.map((promo) => (
              <tr key={promo.promocion_id} className="border-t text-sm">
                <td className="py-3 px-6">{promo.nombre}</td>
                <td className="py-3 px-6 capitalize">{promo.tipo_promocion}</td>
                <td className="py-3 px-6">
                  {promo.tipo_promocion === 'porcentaje'
                    ? `${promo.valor_descuento}%`
                    : `$${promo.valor_descuento}`}
                </td>
                <td className="py-3 px-6">{promo.fecha_inicio?.split('T')[0]}</td>
                <td className="py-3 px-6">{promo.fecha_fin?.split('T')[0]}</td>
                <td className="py-3 px-6">{promo.productos?.length || 0}</td>
                <td className="py-3 px-6">
                  {promo.productos?.map((p) => p.nombre_producto).join(', ') || '—'}
                </td>
                {rol === 'admin' && (
                  <td className="py-3 px-6">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onEdit(promo)}
                        className="text-green-500 hover:text-green-700"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => onDelete(promo)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Vista mobile tipo tarjeta */}
      <div className="md:hidden space-y-4">
        {promotions.map((promo) => (
          <div key={promo.promocion_id} className="bg-white rounded-lg shadow p-4">
            <div className="mb-2">
              <span className="font-semibold">Nombre:</span> {promo.nombre}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Tipo:</span> {promo.tipo_promocion}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Descuento:</span>{' '}
              {promo.tipo_promocion === 'porcentaje'
                ? `${promo.valor_descuento}%`
                : `$${promo.valor_descuento}`}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Inicio:</span> {promo.fecha_inicio?.split('T')[0]}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Fin:</span> {promo.fecha_fin?.split('T')[0]}
            </div>
            <div className="mb-2">
              <span className="font-semibold"># Productos:</span> {promo.productos?.length || 0}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Productos:</span>{' '}
              {promo.productos?.map((p) => p.nombre_producto).join(', ') || '—'}
            </div>
            {rol === 'admin' && (
              <div className="flex justify-end gap-2 mt-2">
                <button
                  onClick={() => onEdit(promo)}
                  className="text-green-500 hover:text-green-700"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => onDelete(promo)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrash />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

PromotionsTable.propTypes = {
  promotions: PropTypes.array.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
