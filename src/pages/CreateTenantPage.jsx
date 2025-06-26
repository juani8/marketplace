import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/apis/api_config';
import Button from '@/components/Button';
import PropTypes from 'prop-types';

export default function CreateTenantPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre_tenant: '',
    razon_social: '',
    cuenta_bancaria: '',
    calle: '',
    numero: '',
    ciudad: '',
    provincia: '',
    codigo_postal: '',
    email: '',
    telefono: '',
    sitio_web: '',
    instagram: '',
    password: '',
    nombre_admin: ''
  });

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'nombre_tenant':
      case 'razon_social':
      case 'cuenta_bancaria':
      case 'calle':
      case 'numero':
      case 'ciudad':
      case 'provincia':
      case 'codigo_postal':
      case 'telefono':
      case 'nombre_admin':
        if (!value.trim()) error = 'Este campo es obligatorio';
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
      if (!['sitio_web', 'instagram'].includes(key)) {
        const error = validateField(key, value);
        if (error) newErrors[key] = error;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      const tenantRes = await api.post('/tenants', {
        nombre: form.nombre_tenant,
        razon_social: form.razon_social,
        cuenta_bancaria: form.cuenta_bancaria,
        calle: form.calle,
        numero: form.numero,
        ciudad: form.ciudad,
        provincia: form.provincia,
        codigo_postal: form.codigo_postal,
        email: form.email,
        telefono: form.telefono,
        sitio_web: form.sitio_web || null,
        instagram: form.instagram || null
      });

      const tenantId = tenantRes.data.tenant_id;

      const userRes = await api.post('/auth/register-internal', {
        tenant_id: tenantId,
        nombre: form.nombre_admin,
        email: form.email,
        password: form.password,
        rol: 'admin'
      });

      const user = {
        usuario_id: userRes.data.usuario_id,
        tenant_id: tenantId,
        nombre: form.nombre_admin,
        email: form.email,
        rol: 'admin'
      };

      localStorage.setItem('user', JSON.stringify(user));
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-12">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-10 rounded-lg shadow-lg w-full max-w-2xl"
      >
        <h2 className="text-2xl font-bold text-blue-600 mb-6 text-center">
          Registrar nuevo Tenant
        </h2>

        {error && (
          <p className="text-red-500 text-sm mb-6 text-center">{error}</p>
        )}

        <SectionTitle title="Datos del negocio" />
        <InputGroup fields={[
          { name: 'nombre_tenant', label: 'Nombre del negocio' },
          { name: 'razon_social', label: 'Razón social' },
          { name: 'cuenta_bancaria', label: 'Cuenta bancaria' }
        ]} form={form} handleChange={handleChange} errors={errors} />

        <SectionTitle title="Dirección" />
        <InputGroup fields={[
          { name: 'calle', label: 'Calle' },
          { name: 'numero', label: 'Número' },
          { name: 'ciudad', label: 'Ciudad' },
          { name: 'provincia', label: 'Provincia' },
          { name: 'codigo_postal', label: 'Código postal' }
        ]} form={form} handleChange={handleChange} errors={errors} />

        <SectionTitle title="Datos de contacto" />
        <InputGroup fields={[
          { name: 'telefono', label: 'Teléfono' },
          { name: 'sitio_web', label: 'Sitio web (opcional)' },
          { name: 'instagram', label: 'Instagram (opcional)' }
        ]} form={form} handleChange={handleChange} errors={errors} />

        <SectionTitle title="Credenciales de acceso" />
        <InputGroup fields={[
          { name: 'nombre_admin', label: 'Nombre del administrador' },
          { name: 'email', label: 'Correo electrónico', type: 'email' },
          { name: 'password', label: 'Contraseña', type: 'password' }
        ]} form={form} handleChange={handleChange} errors={errors} />

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
    </div>
  );
}

function SectionTitle({ title }) {
  return (
    <h3 className="text-lg font-semibold text-gray-700 mt-8 mb-3 border-b pb-1">
      {title}
    </h3>
  );
}

function InputGroup({ fields, form, handleChange, errors }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {fields.map(({ name, label, type = 'text' }) => (
        <div key={name}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
          <input
            type={type}
            name={name}
            value={form[name]}
            onChange={handleChange}
            className={`w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 ${errors[name] ? 'border-red-500' : ''}`}
            required={!label.toLowerCase().includes('(opcional)')}
          />
          {errors[name] && (
            <p className="text-red-500 text-xs mt-1">{errors[name]}</p>
          )}
        </div>
      ))}
    </div>
  );
}

SectionTitle.propTypes = {
  title: PropTypes.string.isRequired
};

InputGroup.propTypes = {
  fields: PropTypes.array.isRequired,
  form: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  errors: PropTypes.object
};
