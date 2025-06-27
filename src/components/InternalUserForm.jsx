import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getAllCommerces, registerInternalUser } from '@/apis/internalUsersService';
import SuccessModal from '@/components/SuccessModal';
import Input from './Input';
import InputRowGrid from './InputRowGrid';
import Button from './Button';

export default function InternalUserForm({ onSuccess }) {
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    password: '',
    rol: 'operador',
    comercioIds: [],
  });

  const [comercios, setComercios] = useState([]);
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchComercios = async () => {
      try {
        const data = await getAllCommerces();
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
  }, [form.rol]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    const parsedValue = Number(value);
    setForm((prev) => ({
      ...prev,
      comercioIds: checked
        ? [...prev.comercioIds, parsedValue]
        : prev.comercioIds.filter((id) => id !== parsedValue),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowErrors(true);
    setError('');
    setIsLoading(true);

    if (!form.nombre || !form.email || !form.password) {
      setError('Nombre, email y contraseña son obligatorios');
      setIsLoading(false);
      return;
    }

    if (form.rol === 'operador' && form.comercioIds.length === 0) {
      setError('Seleccioná al menos un comercio');
      setIsLoading(false);
      return;
    }

    const payload = {
      nombre: form.nombre,
      email: form.email,
      password: form.password,
      rol: form.rol,
      comercios_autorizados_id: form.rol === 'operador' ? form.comercioIds : [],
    };

    try {
      await registerInternalUser(payload);
      setShowSuccessModal(true);
      onSuccess();
    } catch (err) {
      console.error(err);
      if (
        err?.response?.data?.message?.includes('email') ||
        err?.response?.data?.error?.includes('email')
      ) {
        setError('Ya existe un usuario con ese email.');
      } else {
        setError('Error al crear el usuario');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded shadow space-y-6 w-full max-w-4xl mx-auto"
    >
      {showErrors && error && (
        <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded">
          <p>{error}</p>
        </div>
      )}

      <InputRowGrid>
        <Input
          label="Nombre"
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          hasError={showErrors && !form.nombre}
        />
        <Input
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          hasError={showErrors && !form.email}
        />
        <Input
          label="Contraseña"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          hasError={showErrors && !form.password}
        />
      </InputRowGrid>

      <div>
        <label className="block text-sm font-medium mb-1">Rol</label>
        <select
          name="rol"
          value={form.rol}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2"
        >
          <option value="admin">Administrador</option>
          <option value="operador">Operador</option>
        </select>
      </div>

      {form.rol === 'operador' && (
        <div>
          <label className="block text-sm font-medium mb-2">Comercios asignados</label>
          <div className="flex flex-col gap-1 max-h-40 overflow-y-auto border p-2 rounded-md">
            {comercios.length === 0 ? (
              <p className="text-sm text-gray-500 italic">No hay comercios disponibles para asignar</p>
            ) : (
              comercios.map((comercio) => (
                <label key={comercio.comercio_id} className="text-sm flex gap-2 items-center">
                  <input
                    type="checkbox"
                    value={comercio.comercio_id}
                    checked={form.comercioIds.includes(Number(comercio.comercio_id))}
                    onChange={handleCheckboxChange}
                  />
                  {comercio.nombre} ({comercio.direccion})
                </label>
              ))
            )}
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <Button type="submit" loading={isLoading}>
          Crear Usuario
        </Button>
      </div>

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => window.location.reload()}
        successMessage="¡Usuario creado correctamente!"
        redirectTo="/usuarios"
      />
    </form>
  );
}

InternalUserForm.propTypes = {
  onSuccess: PropTypes.func.isRequired,
};
