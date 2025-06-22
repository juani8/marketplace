import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getAllTenants } from '../apis/tenantsService';

export default function SelectTenantPage() {
  const [tenants, setTenants] = useState([]);
  const [selectedTenantId, setSelectedTenantId] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const tenantList = await getAllTenants();
        setTenants(tenantList);
      } catch (error) {
        console.error('Error al obtener los tenants:', error);
      }
    };

    fetchTenants();
  }, []);

  const handleSelect = () => {
    if (selectedTenantId) {
      navigate(`/products/catalogue/${selectedTenantId}`);
    }
  };

  return (
    <div className="min-h-screen bg-background p-5">
      <h1 className="text-2xl font-bold text-gray-800">Catálogo de Productos</h1>

      <div className="max-w-md">
        <label className="block text-lg font-medium text-neutral mb-2">
          Selecciona un comercio
        </label>
        <select
          className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4"
          value={selectedTenantId}
          onChange={(e) => setSelectedTenantId(e.target.value)}
        >
          <option value="">-- Selecciona un comercio --</option>
          {tenants.map((tenant) => (
            <option key={tenant.tenant_id} value={tenant.tenant_id}>
              {tenant.nombre}
            </option>
          ))}
        </select>

        <button
          onClick={handleSelect}
          disabled={!selectedTenantId}
          className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg disabled:opacity-50"
        >
          Ver productos
        </button>
      </div>
    </div>
  );
}
