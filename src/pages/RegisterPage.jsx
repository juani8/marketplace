import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { register, login } from '../apis/authService'; // real
// import { getSellers } from '../apis/sellerService'; // real
import { getAllTenants } from '@/apis/tenantsService'; // mock

export default function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: '',
    password: '',
    rol: 'admin',
    comercioIds: [],
  });

  const [comercios, setComercios] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (form.rol === 'operador') {
      getAllTenants()
        .then((data) => {
          const activos = data.filter((t) => t.estado === 'activo');
          setComercios(activos);
        })
        .catch(() => setError('Error al cargar los comercios'));
    } else {
      setComercios([]); // sacar si se cambia a admin
    }
  }, [form.rol]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      comercioIds: checked
        ? [...prev.comercioIds, value]
        : prev.comercioIds.filter((id) => id !== value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      setError('Email y contraseña son obligatorios');
      return;
    }

    if (form.rol === 'operador' && form.comercioIds.length === 0) {
      setError('Seleccioná al menos un comercio');
      return;
    }

    try {
      console.log('⚠️ Registro mockeado:', form);

      const res = {
        token: 'mock-token-123',
        user: {
          id: 'mock-user-id',
          email: form.email,
          rol: form.rol,
          tenantId: 'mock-tenant-id',
        },
      };

      console.log('Login OK (mock):', res);
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res.user));

      navigate(form.rol === 'admin' ? '/crear-tenant' : '/perfil');

    } catch (err) {
      console.error(err);
      setError('Error al registrar. Intentá más tarde.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-blue-600 mb-6 text-center">Registrarse</h2>

        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={form.email}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2 mb-4"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2 mb-4"
            required
          />

          <label className="block text-sm font-medium mb-1">Rol</label>
          <select
            name="rol"
            value={form.rol}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2 mb-4"
          >
            <option value="admin">Administrador</option>
            <option value="operador">Operador</option>
          </select>

          {form.rol === 'operador' && (
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Comercios asignados</label>
              <div className="flex flex-col gap-1 max-h-40 overflow-y-auto border p-2 rounded-md">
                {comercios.length === 0 ? (
                  <p className="text-sm text-gray-500">No hay comercios disponibles</p>
                ) : (
                  comercios.map((comercio) => (
                    <label key={comercio.tenant_id} className="text-sm flex gap-2 items-center">
                      <input
                        type="checkbox"
                        value={comercio.tenant_id}
                        checked={form.comercioIds.includes(comercio.tenant_id)}
                        onChange={handleCheckboxChange}
                      />
                      {comercio.nombre} ({comercio.direccion})
                    </label>
                  ))
                )}
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold transition"
          >
            Registrarse
          </button>
        </form>
      </div>
    </div>
  );
}

