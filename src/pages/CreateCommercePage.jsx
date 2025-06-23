import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { createSeller } from '@/apis/sellerService'; 

export default function CreateCommercePage() {
  const location = useLocation();
  const navigate = useNavigate();

  // si no llega desde location.state, lo toma de localStorage
  const tenantId = location.state?.tenantId || localStorage.getItem('tenant_id');
  const nombreTenant = location.state?.nombreTenant || JSON.parse(localStorage.getItem('user'))?.nombre;

  const [form, setForm] = useState({
    nombre: '',
    calle: '',
    numero: '',
    ciudad: '',
    provincia: '',
    codigo_postal: '',
    lat: '',
    lon: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const payload = {
        ...form,
        lat: parseFloat(form.lat),
        lon: parseFloat(form.lon),
      };

      await createSeller(payload); // ya incluye `usuario_id` internamente

      setSuccess(true);
      setTimeout(() => navigate('/perfil'), 2000);
    } catch (err) {
      console.error(err);
      setError('Error al crear el comercio.');
    }
  };

return (
    <div className="pl-[220px] min-h-screen flex items-center justify-center bg-gray-100 relative">
      {tenantId && (
        <div className="absolute top-4 right-6 text-sm text-gray-500">
          Tenant: <span className="font-mono">{tenantId}</span>
        </div>
      )}

      <div className="w-full max-w-2xl p-8 bg-white rounded shadow-md -translate-x-12">
        <h2 className="text-xl font-semibold mb-4">Registrar nuevo comercio</h2>

        {error && <p className="text-red-500 mb-3">{error}</p>}
        {success && <p className="text-green-600 mb-3">¡Comercio creado con éxito!</p>}


      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
          placeholder="Nombre del comercio"
          required
        />
        <input
          type="text"
          name="calle"
          value={form.calle}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
          placeholder="Calle"
          required
        />
        <input
          type="text"
          name="numero"
          value={form.numero}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
          placeholder="Número"
          required
        />
        <input
          type="text"
          name="ciudad"
          value={form.ciudad}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
          placeholder="Ciudad"
          required
        />
        <input
          type="text"
          name="provincia"
          value={form.provincia}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
          placeholder="Provincia"
          required
        />
        <input
          type="text"
          name="codigo_postal"
          value={form.codigo_postal}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
          placeholder="Código Postal"
          required
        />
        <div className="flex gap-4 mb-3">
          <input
            type="text"
            name="lat"
            value={form.lat}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Latitud"
            required
          />
          <input
            type="text"
            name="lon"
            value={form.lon}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Longitud"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full mt-2 bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Crear Comercio
        </button>
      </form>
    </div>
  </div>
);
}

