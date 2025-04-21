import { useEffect, useState } from 'react';
import { getAllTenants } from '@apis/tenantsService';

// 🧪 MOCK opcional
const mockTenants = [
  {
    tenant_id: 1,
    nombre: 'Panadería La Moderna',
    razon_social: 'La Moderna S.A.',
    estado: 'activo',
  },
  {
    tenant_id: 2,
    nombre: 'Verdulería El Tano',
    razon_social: 'Verduras del Oeste SRL',
    estado: 'inactivo',
  },
];

export default function TenantsPage() {
  const [tenants, setTenants] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        // 🔄 OPCIÓN 1: Usar datos reales desde el backend
        //const data = await getAllTenants();
        setTenants(data);

        // 🔁 OPCIÓN 2: Usar datos mockeados para pruebas (descomentar si el backend no está listo)
        // setTenants(mockTenants);

      } catch (err) {
        console.error(err);
        setError('Error al obtener los tenants');

        // Si el backend falla, también podés forzar el mock temporalmente
        setTenants(mockTenants);
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


