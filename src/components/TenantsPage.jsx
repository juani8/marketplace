import { useEffect, useState } from 'react';
import { getAllTenants } from '@apis/tenantsService';


export default function TenantsPage() {
  const [tenants, setTenants] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const data = await getAllTenants();
        setTenants(data);

      } catch (err) {
        console.error(err);
        setError('Error al obtener los tenants');
      }
    };

    fetchTenants();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Lista de Comercios</h2>
      {error && <p className="text-red-500">{error}</p>}
      {tenants.length === 0 ? (
        <p>No hay comercios registrados.</p>
      ) : (
        <ul className="space-y-2">
          {tenants.map((t) => (
            <li key={t.tenant_id} className="bg-white p-4 shadow rounded">
              <strong>{t.nombre}</strong><br />
              {t.razon_social} — {t.estado}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}


