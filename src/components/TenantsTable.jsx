// src/components/TenantsTable.jsx
import PropTypes from 'prop-types';
import { FaEdit, FaTrash } from 'react-icons/fa';
import  StateBadge from './StateBadge';

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
      <table className="min-w-full bg-white rounded-lg shadow hidden md:table">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="py-3 px-6">Nombre</th>
            <th className="py-3 px-6">Dirección</th>
            <th className="py-3 px-6">Email</th>
            <th className="py-3 px-6">Estado</th>
            <th className="py-3 px-6">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {tenants.map((tenant) => (
            <tr key={tenant.tenant_id} className="border-t">
              <td className="py-3 px-6">{tenant.nombre}</td>
              <td className="py-3 px-6">{tenant.posee_direccion ? tenant.direccion : '-'}</td>
              <td className="py-3 px-6">{tenant.datos_contacto?.email || '-'}</td>
              <td className="py-3 px-6">
                <StateBadge estado={tenant.estado} />
              </td>
              <td className="py-3 px-6">
                <div className="flex items-center gap-2">
                  <button onClick={() => onEdit(tenant.tenant_id)} className="text-green-500 hover:text-green-700">
                    <FaEdit />
                  </button>
                  <button onClick={() => onDelete(tenant)} className="text-red-500 hover:text-red-700">
                    <FaTrash />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile view */}
      <div className="md:hidden space-y-4">
        {tenants.map((tenant) => (
          <div key={tenant.tenant_id} className="bg-white rounded-lg shadow p-4">
            <div className="mb-2">
              <span className="font-semibold">Nombre:</span> {tenant.nombre}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Dirección:</span> {tenant.posee_direccion ? tenant.direccion : '-'}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Email:</span> {tenant.datos_contacto?.email || '-'}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Estado:</span> <StateBadge estado={tenant.estado} />
            </div>
            <div className="flex justify-end gap-2 mt-2">
              <button onClick={() => onEdit(tenant.tenant_id)} className="text-green-500 hover:text-green-700">
                <FaEdit />
              </button>
              <button onClick={() => onDelete(tenant)} className="text-red-500 hover:text-red-700">
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
