import PropTypes from 'prop-types';
import { FaEdit, FaTrash } from 'react-icons/fa';
import StateBadge from './StateBadge';

export default function TenantsTable({ tenants, onEdit, onDelete }) {
  if (tenants.length === 0) {
    return (
      <div className="text-center text-gray-600 py-20 text-lg">
        No hay comercios disponibles.
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
              <th className="py-3 px-6 sticky top-0 z-10 bg-gray-100">Dirección</th>
              <th className="py-3 px-6 sticky top-0 z-10 bg-gray-100">Email</th>
              <th className="py-3 px-6 sticky top-0 z-10 bg-gray-100">Estado</th>
              <th className="py-3 px-6 sticky top-0 z-10 bg-gray-100">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {tenants.map((tenant) => (
              <tr key={tenant.tenant_id} className="border-t text-sm">
                <td className="py-3 px-6">{tenant.nombre}</td>
                <td className="py-3 px-6">{tenant.calle
                  ? `${tenant.calle} ${tenant.numero}, ${tenant.ciudad}, ${tenant.provincia}`
                  : '-'}
                </td>
                <td className="py-3 px-6">{tenant.datos_contacto?.email || '-'}</td>
                <td className="py-3 px-6">
                  <StateBadge estado={tenant.estado} />
                </td>
                <td className="py-3 px-6">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEdit(tenant.tenant_id)}
                      className="text-green-500 hover:text-green-700"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => onDelete(tenant)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Vista mobile tipo tarjeta */}
      <div className="md:hidden space-y-4">
        {tenants.map((tenant) => (
          <div key={tenant.tenant_id} className="bg-white rounded-lg shadow p-4">
            <div className="mb-2">
              <span className="font-semibold">Nombre:</span> {tenant.nombre}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Dirección:</span>{' '}
              {tenant.calle
            ? `${tenant.calle} ${tenant.numero}, ${tenant.ciudad}, ${tenant.provincia}`
            : '-'}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Email:</span>{' '}
              {tenant.datos_contacto?.email || '-'}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Estado:</span>{' '}
              <StateBadge estado={tenant.estado} />
            </div>
            <div className="flex justify-end gap-2 mt-2">
              <button
                onClick={() => onEdit(tenant.tenant_id)}
                className="text-green-500 hover:text-green-700"
              >
                <FaEdit />
              </button>
              <button
                onClick={() => onDelete(tenant)}
                className="text-red-500 hover:text-red-700"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

TenantsTable.propTypes = {
  tenants: PropTypes.array.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
