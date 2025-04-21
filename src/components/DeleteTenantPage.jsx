import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DeleteTenantPage = () => {
  const [tenants, setTenants] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/tenants`);
        setTenants(response.data);
      } catch (err) {
        console.error(err);
        setError('Error al obtener la lista de comercios');
      }
    };
    fetchTenants();
  }, []);

  const handleDelete = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/tenants/${selectedId}`);
      setSuccess('Comercio eliminado correctamente ✅');
      setTenants((prev) => prev.filter((t) => t.tenant_id !== selectedId));
      setSelectedId('');
    } catch (err) {
      console.error(err);
      setError('Error al eliminar el comercio ❌');
    }
  };

  return (
    <div className="min-h-screen bg-background flex justify-center items-center px-4 py-10">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl">
        <h2 className="text-2xl font-bold text-primary mb-4">Baja de Comercio</h2>

        {success && <p className="text-green-600 mb-4">{success}</p>}
        {error && <p className="text-red-600 mb-4">{error}</p>}

        <label className="block mb-2 font-medium">Seleccioná el comercio a eliminar:</label>
        <select
          className="w-full border rounded px-3 py-2 mb-6"
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
        >
          <option value="">-- Seleccionar --</option>
          {tenants.map((t) => (
            <option key={t.tenant_id} value={t.tenant_id}>
              {t.nombre} ({t.razon_social})
            </option>
          ))}
        </select>

        <button
          disabled={!selectedId}
          onClick={handleDelete}
          className={`w-full py-2 rounded font-semibold text-white transition ${
            selectedId ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          Eliminar comercio
        </button>
      </div>
    </div>
  );
};

export default DeleteTenantPage;