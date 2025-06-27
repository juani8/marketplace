import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerTenantWithAdmin } from '@/apis/authService';
import Button from '@/components/Button';
import PropTypes from 'prop-types';

export default function RegisterTenantPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: '',
    razon_social: '',
    cuenta_bancaria: '',
    email: '',
    telefono: '',
    calle: '',
    numero: '',
    ciudad: '',
    provincia: '',
    codigo_postal: '',
    sitio_web: '',
    instagram: '',
    password: '',
    nombre_admin: '', // será usado como 'nombre_usuario'
    });

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'nombre':
      case 'razon_social':
      case 'nombre_admin':
        if (!value.trim()) error = 'Este campo es obligatorio';
        break;
      case 'cuenta_bancaria':
        if (!value.trim()) error = 'Este campo es obligatorio';
        else if (!/^\d{22}$/.test(value)) error = 'La CBU debe tener exactamente 22 dígitos';
        break;
      case 'email':
        if (!value.trim()) error = 'El correo es obligatorio';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Correo inválido';
        break;
      case 'password':
        if (!value.trim()) error = 'La contraseña es obligatoria';
        else if (value.length < 6) error = 'Debe tener al menos 6 caracteres';
        break;
      default:
        break;
    }
    return error;
  };

  const validateForm = () => {
    const newErrors = {};
    Object.entries(form).forEach(([key, value]) => {
      const error = validateField(key, value);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    const numericFields = ['cuenta_bancaria'];
    if (numericFields.includes(name)) {
      const cleanedValue = value.replace(/\D/g, '');
      setForm((prev) => ({ ...prev, [name]: cleanedValue }));
      setErrors((prev) => ({ ...prev, [name]: validateField(name, cleanedValue) }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { user, tenant_id, tokens } = await registerTenantWithAdmin(form);

      // Guardar datos en localStorage
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('tenant_id', tenant_id);

      if (tokens?.accessToken) {
        localStorage.setItem('accessToken', tokens.accessToken);
        localStorage.setItem('refreshToken', tokens.refreshToken);
      }

      navigate('/sellers');
    } catch (err) {
      console.error(err);
      setError('Ocurrió un error al registrar el tenant');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-12 relative">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-10 rounded-lg shadow-lg w-full max-w-xl"
      >
        <h2 className="text-2xl font-bold text-blue-600 mb-6 text-center">
          Registrar Tenant
        </h2>

      <InputGroup
        sections={[
          {
            title: 'Datos del Negocio',
            fields: [
              { name: 'nombre', label: 'Nombre del negocio' },
              { name: 'razon_social', label: 'Razón social' },
              { name: 'cuenta_bancaria', label: 'Cuenta bancaria' },
              { name: 'email', label: 'Correo electrónico', type: 'email' },
              { name: 'telefono', label: 'Teléfono' },
            ],
          },
          {
            title: 'Datos del Administrador',
            fields: [
              { name: 'nombre_admin', label: 'Nombre de usuario (admin)' },
              { name: 'password', label: 'Contraseña', type: 'password' },
            ],
          },
          {
            title: 'Dirección y Contacto',
            fields: [
              { name: 'calle', label: 'Calle' },
              { name: 'numero', label: 'Número' },
              { name: 'ciudad', label: 'Ciudad' },
              { name: 'provincia', label: 'Provincia' },
              { name: 'codigo_postal', label: 'Código postal' },
              { name: 'sitio_web', label: 'Sitio web (opcional)' },
              { name: 'instagram', label: 'Instagram (opcional)' },
            ],
          },
        ]}
        form={form}
        handleChange={handleChange}
        errors={errors}
      />


        <div className="mt-8">
          <Button
            type="submit"
            loading={isLoading}
            disabled={isLoading || Object.keys(errors).some((k) => errors[k])}
            className="w-full justify-center"
          >
            {isLoading ? 'Registrando…' : 'Registrarse'}
          </Button>
        </div>
      </form>

      {error && (
        <div className="absolute top-4 right-4 bg-red-100 text-red-700 px-4 py-2 rounded shadow">
          {error}
        </div>
      )}
    </div>
  );
}

function InputGroup({ sections, form, handleChange, errors }) {
  return (
    <div className="space-y-8">
      {sections.map(({ title, fields }) => (
        <div key={title}>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">{title}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map(({ name, label, type = 'text' }) => (
              <div key={name}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {label}
                </label>
                <input
                  type={name === 'cuenta_bancaria' ? 'tel' : type}
                  inputMode={name === 'cuenta_bancaria' ? 'numeric' : undefined}
                  pattern={name === 'cuenta_bancaria' ? '\\d*' : undefined}
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  className={`w-full border rounded-lg px-3 py-2 text-sm text-left focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                    errors[name] ? 'border-red-500' : ''
                  }`}
                />
                {errors[name] && (
                  <p className="text-red-500 text-xs mt-1">{errors[name]}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

InputGroup.propTypes = {
  sections: PropTypes.array.isRequired,
  form: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  errors: PropTypes.object,
};
