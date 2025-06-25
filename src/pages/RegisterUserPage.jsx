import { useState, useEffect } from 'react';
import { createUser, getAllCommerces } from '@/apis/usersService'; 

export default function RegisterUserModal({ onClose, onSuccess, usuario_id, tenant_id }) {
  const [form, setForm] = useState({
    email: '',
    password: '',
    rol: 'admin',
    comercioIds: [],
  });

  const [comercios, setComercios] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchComercios = async () => {
      try {
        const response = await getAllCommerces(usuario_id);
        setComercios(response);
      } catch (err) {
        console.error('Error al obtener comercios', err);
        setComercios([]);
      }
    };

    if (form.rol === 'operador') {
      fetchComercios();
    } else {
      setComercios([]);
    }
  }, [form.rol, usuario_id]);

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
  setError('');

  if (!form.email || !form.password) {
    setError('Email y contraseña son obligatorios');
    return;
  }

  if (form.rol === 'operador' && form.comercioIds.length === 0) {
    setError('Seleccioná al menos un comercio');
    return;
  }

  const userData = {
  email: form.email,
  password: form.password,
  rol: form.rol,
  tenant_id, 
  comercios: form.rol === 'operador' ? form.comercioIds : [],
};

  try {
    const nuevoUsuario = await createUser(userData);
    onSuccess(nuevoUsuario);
    onClose();
  } catch (err) {
    console.error(err);
    setError('Hubo un problema al crear el usuario');
  }
};

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-xl font-bold text-blue-600 mb-4 text-center">Crear Usuario</h2>

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
                    <label key={comercio.id} className="text-sm flex gap-2 items-center">
                      <input
                        type="checkbox"
                        value={comercio.id}
                        checked={form.comercioIds.includes(comercio.id)}
                        onChange={handleCheckboxChange}
                      />
                      {comercio.nombre} ({comercio.direccion})
                    </label>
                  ))
                )}
              </div>
            </div>
          )}

          <div className="flex justify-between gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="w-full bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Crear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
