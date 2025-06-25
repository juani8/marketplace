import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/apis/api_config';

export default function CreateTenantPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre_tenant: '',
    razon_social: '',
    direccion: '',
    cuenta_bancaria: '',
    email: '',
    password: '',
    nombre_admin: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const tenantRes = await api.post('/tenants', {
        nombre: form.nombre_tenant,
        razon_social: form.razon_social,
        direccion: form.direccion,
        cuenta_bancaria: form.cuenta_bancaria,
        configuracion_operativa: {
          horario_apertura: '09:00',
          horario_cierre: '18:00'
        }
      });

      const tenantId = tenantRes.data.tenant_id;

      const userRes = await api.post('/auth/register-internal', {
        tenant_id: tenantId,
        nombre: form.nombre_admin,
        email: form.email,
        password: form.password,
        rol: 'admin'
      });

      localStorage.setItem('user', JSON.stringify(userRes.data));
      localStorage.setItem('tenant_id', tenantId);

      navigate('/crear-comercio', {
        state: {
          tenantId,
          email: form.email
        }
      });
    } catch (err) {
      console.error(err);
      setError('No se pudo registrar el tenant.');
    } finally {
      setIsLoading(false);
    }
  };

  const tenantId = localStorage.getItem('tenant_id');

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      {tenantId && (
        <div className="absolute top-4 right-6 text-sm text-gray-600">
          Tenant ID: <span className="font-mono font-semibold">{tenantId}</span>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-xl font-bold text-center mb-6">Crear Cuenta Tenant</h2>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <input
          type="text"
          name="nombre_tenant"
          placeholder="Nombre del tenant"
          value={form.nombre_tenant}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
          required
        />

        <input
          type="text"
          name="razon_social"
          placeholder="Razón social"
          value={form.razon_social}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
        />

        <input
          type="text"
          name="direccion"
          placeholder="Dirección"
          value={form.direccion}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
        />

        <input
          type="text"
          name="cuenta_bancaria"
          placeholder="Cuenta bancaria"
          value={form.cuenta_bancaria}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
        />

        <input
          type="text"
          name="nombre_admin"
          placeholder="Nombre del admin"
          value={form.nombre_admin}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={form.email}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={handleChange}
          className="w-full mb-6 p-2 border rounded"
          required
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {isLoading ? 'Registrando...' : 'Crear Tenant'}
        </button>
      </form>
    </div>
  );
}
