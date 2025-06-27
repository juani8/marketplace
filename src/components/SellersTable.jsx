import PropTypes from 'prop-types';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

// Orden deseado: lunes → domingo
const ORDEN_DIAS = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];

export default function SellersTable({ sellers, onEdit, onDelete }) {
  const { rol } = useAuth();

  if (!Array.isArray(sellers) || sellers.length === 0) {
    return (
      <div className="text-center text-gray-600 py-20 text-lg">
        No hay comercios disponibles.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      {/* Tabla desktop */}
      <div className="hidden md:block rounded-md shadow overflow-auto max-h-[90vh]">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-6 text-left sticky top-0 bg-gray-100 z-10">Nombre</th>
              <th className="py-3 px-6 text-left sticky top-0 bg-gray-100 z-10">Dirección</th>
              <th className="py-3 px-6 text-left sticky top-0 bg-gray-100 z-10">Horarios</th>
              {rol === 'admin' && (
                <th className="py-3 px-6 text-left sticky top-0 bg-gray-100 z-10">Acciones</th>
              )}
            </tr>
          </thead>
          <tbody>
            {sellers.map((s) => {
              const horariosOrdenados = [...s.horarios].sort(
                (a, b) => ORDEN_DIAS.indexOf(a.dia_semana) - ORDEN_DIAS.indexOf(b.dia_semana)
              );

              return (
                <tr key={s.comercio_id} className="border-t text-sm">
                  <td className="py-3 px-6">{s.nombre || '—'}</td>
                  <td className="py-3 px-6">
                    {s.calle && s.numero && s.ciudad && s.provincia
                      ? `${s.calle} ${s.numero}, ${s.ciudad}, ${s.provincia}`
                      : '—'}
                  </td>
                  <td className="py-3 px-6 whitespace-nowrap text-sm text-gray-700">
                    <ul className="space-y-1">
                      {horariosOrdenados.map((h, index) => (
                        <li
                          key={`${s.comercio_id}-${h.dia_semana}-${index}`}
                          className="flex justify-between"
                        >
                          <span className="capitalize w-24">
                            {h.dia_semana.charAt(0).toUpperCase() + h.dia_semana.slice(1)}
                          </span>
                          <span>
                            {h.hora_apertura && h.hora_cierre
                              ? `${h.hora_apertura.slice(0, 5)} - ${h.hora_cierre.slice(0, 5)}`
                              : 'Cerrado'}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </td>
                  {rol === 'admin' && (
                    <td className="py-3 px-6">
                      <div className="flex gap-2 items-center">
                        <button
                          onClick={() => onEdit(s.comercio_id)}
                          className="text-green-600 hover:text-green-800"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => onDelete(s.comercio_id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Vista mobile tipo tarjeta */}
      <div className="md:hidden space-y-4 mt-4">
        {sellers.map((s) => {
          const horariosOrdenados = [...s.horarios].sort(
            (a, b) => ORDEN_DIAS.indexOf(a.dia_semana) - ORDEN_DIAS.indexOf(b.dia_semana)
          );

          return (
            <div key={s.comercio_id} className="bg-white shadow rounded-lg p-4">
              <div className="mb-2">
                <span className="font-semibold">Nombre:</span> {s.nombre || '—'}
              </div>
              <div className="mb-2">
                <span className="font-semibold">Dirección:</span>{' '}
                {s.calle && s.numero && s.ciudad && s.provincia
                  ? `${s.calle} ${s.numero}, ${s.ciudad}, ${s.provincia}`
                  : '—'}
              </div>
              <div className="mb-2">
                <span className="font-semibold">Horarios:</span>
                <div className="mt-1 ml-2 text-sm text-gray-700">
                  {horariosOrdenados.map((h, index) => (
                    <div
                      key={`${s.comercio_id}-${h.dia_semana}-${index}`}
                      className="flex justify-between"
                    >
                      <span className="capitalize w-24">
                        {h.dia_semana.charAt(0).toUpperCase() + h.dia_semana.slice(1)}
                      </span>
                      <span>
                        {h.hora_apertura && h.hora_cierre
                          ? `${h.hora_apertura.slice(0, 5)} - ${h.hora_cierre.slice(0, 5)}`
                          : 'Cerrado'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              {rol === 'admin' && (
                <div className="flex justify-end gap-2 mt-2">
                  <button
                    onClick={() => onEdit(s.comercio_id)}
                    className="text-green-600 hover:text-green-800"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => onDelete(s.comercio_id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FaTrash />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

SellersTable.propTypes = {
  sellers: PropTypes.array.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
