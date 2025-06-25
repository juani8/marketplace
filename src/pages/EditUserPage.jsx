import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getAllCommerces, updateUser } from '@/apis/usersService';
import Button from '@/components/Button';

export default function EditUserModal({ user, onClose, onSuccess, usuario_id }) {
  const [form, setForm] = useState({
    email: user.email,
    password: '',
    rol: user.rol,
    comercioIds: user.comercios?.map((c) => c.id) || [],
  });

  const [comercios, setComercios] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchComercios = async () => {
      try {
        const data = await getAllCommerces(usuario_id);
        setComercios(data);
      } catch (err) {
        console.error(err);
        setError('Error al cargar los comercios');
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

    if (!form.email) {
      setError('El email es obligatorio');
      return;
    }

    if (form.rol === 'operador' && form.comercioIds.length === 0) {
      setError('Seleccioná al menos un comercio');
      return;
    }

    const payload = {
      email: form.email,
      password: form.password || undefined, // no lo mandamos si está vacío
      rol: form.rol,
      comercios_ids: form.rol === 'operador' ? form.comercioIds : [],
    };

    try {
      const updatedUser = await updateUser(user.id, payload);
      onSuccess(updatedUser);
      onClose();
    } catch (err) {
      console.error(err);
      setError('Error al actualizar el usuario');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-xl font-bold text-blue-600 mb-4 text-center">Editar Usuario</h2>

        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2 mb-4"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Nueva contraseña (opcional)"
            value={form.password}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2 mb-4"
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
                {comercios.map((comercio) => (
                  <label key={comercio.id} className="text-sm flex gap-2 items-center">
                    <input
                      type="checkbox"
                      value={comercio.id}
                      checked={form.comercioIds.includes(comercio.id)}
                      onChange={handleCheckboxChange}
                    />
                    {comercio.nombre} ({comercio.direccion})
                  </label>
                ))}
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
              Guardar cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

EditUserModal.propTypes = {
  user: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
  usuario_id: PropTypes.number.isRequired, //para obtener los comercios
};

