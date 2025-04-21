import React, { useState } from 'react';

const CreateTenantPage = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    nombre: '',
    razon_social: '',
    cuenta_bancaria: '',
    datos_contacto: { email: '', tel: '' },
    direccion: '',
    configuracion_operativa: { horarios: '', tipo_servicio: 'envio' },
    catalogo_id: '',
    estado: 'activo',
  });

  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith('datos_contacto.')) {
      const key = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        datos_contacto: { ...prev.datos_contacto, [key]: value },
      }));
    } else if (name.startsWith('configuracion_operativa.')) {
      const key = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        configuracion_operativa: { ...prev.configuracion_operativa, [key]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
  
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/tenants`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) throw new Error();
  
      setSuccess('✅ Comercio creado exitosamente');
      setFormData({
        nombre: '', razon_social: '', cuenta_bancaria: '',
        datos_contacto: { email: '', tel: '' },
        direccion: '', configuracion_operativa: { horarios: '', tipo_servicio: 'envio' },
        catalogo_id: '', estado: 'activo',
      });
      setStep(1);
    } catch (err) {
      setError('❌ Error al crear el comercio');
      console.error('Error al enviar al backend:', err);
    }
  };

  return (
    <div className="min-h-screen bg-background flex justify-center items-center px-4 py-10">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-primary mb-6">Creación de Comercio</h2>

        {success && <p className="text-green-600 mb-4">{success}</p>}
        {error && <p className="text-red-600 mb-4">{error}</p>}

        {step === 1 && (
          <>
            <Step title="Datos Básicos">
              <Input label="Nombre" name="nombre" value={formData.nombre} onChange={handleChange} />
              <Input label="Razón Social" name="razon_social" value={formData.razon_social} onChange={handleChange} />
              <Input label="Cuenta Bancaria" name="cuenta_bancaria" value={formData.cuenta_bancaria} onChange={handleChange} />
            </Step>
            <StepNavigation nextStep={nextStep} />
          </>
        )}

        {step === 2 && (
          <>
            <Step title="Contacto y Dirección">
              <Input label="Email" name="datos_contacto.email" value={formData.datos_contacto.email} onChange={handleChange} type="email" />
              <Input label="Teléfono" name="datos_contacto.tel" value={formData.datos_contacto.tel} onChange={handleChange} />
              <Input label="Dirección" name="direccion" value={formData.direccion} onChange={handleChange} />
            </Step>
            <StepNavigation nextStep={nextStep} prevStep={prevStep} />
          </>
        )}

        {step === 3 && (
          <>
            <Step title="Configuración y Finalización">
              <Input label="Horarios" name="configuracion_operativa.horarios" value={formData.configuracion_operativa.horarios} onChange={handleChange} />
              <Select label="Tipo de Servicio" name="configuracion_operativa.tipo_servicio" value={formData.configuracion_operativa.tipo_servicio} onChange={handleChange} options={['envio', 'retiro', 'ambos']} />
              <Input label="Catálogo ID" name="catalogo_id" value={formData.catalogo_id} onChange={handleChange} />
              <Select label="Estado" name="estado" value={formData.estado} onChange={handleChange} options={['activo', 'inactivo']} />
            </Step>
            <StepNavigation prevStep={prevStep} isLast />
          </>
        )}
      </form>
    </div>
  );
};

const Step = ({ title, children }) => (
  <div className="mb-6">
    <h3 className="text-lg font-semibold mb-4 text-neutral">{title}</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
  </div>
);

const Input = ({ label, name, value, onChange, type = 'text' }) => (
  <div>
    <label className="block mb-1 font-medium">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full border rounded px-3 py-2"
      required
    />
  </div>
);

const Select = ({ label, name, value, onChange, options }) => (
  <div>
    <label className="block mb-1 font-medium">{label}</label>
    <select name={name} value={value} onChange={onChange} className="w-full border rounded px-3 py-2">
      {options.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
);

const StepNavigation = ({ nextStep, prevStep, isLast = false }) => (
  <div className="flex justify-between mt-6">
    {prevStep ? (
      <button
        type="button"
        onClick={prevStep}
        className="bg-gray-300 hover:bg-gray-400 text-neutral py-2 px-4 rounded"
      >
        Anterior
      </button>
    ) : <div />}

    {isLast ? (
      <button
        type="submit"
        className="bg-primary hover:bg-blue-700 text-white py-2 px-4 rounded"
      >
        Finalizar
      </button>
    ) : (
      <button
        type="button"
        onClick={nextStep}
        className="bg-primary hover:bg-blue-700 text-white py-2 px-4 rounded"
      >
        Siguiente
      </button>
    )}
  </div>
);

export default CreateTenantPage;
