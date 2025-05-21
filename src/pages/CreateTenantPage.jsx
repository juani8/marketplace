import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TenantForm from '../components/TenantForm';
import SuccessModal from '../components/SuccessModal';
import { createTenant } from '../apis/tenantsService';

export default function CreateTenantPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    nombre: '',
    razon_social: '',
    cuenta_bancaria: '',
    datos_contacto: { email: '', tel: '' },
    posee_direccion: false,
    direccion: '',
    configuracion_operativa: {
      horarios: {
        lunes: { activo: false, desde: '', hasta: '' },
        martes: { activo: false, desde: '', hasta: '' },
        miércoles: { activo: false, desde: '', hasta: '' },
        jueves: { activo: false, desde: '', hasta: '' },
        viernes: { activo: false, desde: '', hasta: '' },
        sábado: { activo: false, desde: '', hasta: '' },
        domingo: { activo: false, desde: '', hasta: '' },
      },
      tipo_servicio: 'envio',
    },
    catalogo_id: '',
    estado: 'activo',
  });

  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [showErrors, setShowErrors] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value },
      }));
    } else if (name === 'configuracion_operativa.horarios') {
      setFormData((prev) => ({
        ...prev,
        configuracion_operativa: {
          ...prev.configuracion_operativa,
          horarios: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await createTenant(formData);
      setShowModal(true);
    } catch (err) {
      console.error(err);
      setError('❌ Error al crear el comercio');
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  return (
    <div className="p-5">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Añadir Comercio</h1>
      </div>

      <TenantForm
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        step={step}
        nextStep={nextStep}
        prevStep={prevStep}
        error={error}
        showErrors={showErrors}
        setShowErrors={setShowErrors}
        isLoading={isLoading}
      />

      <div className="mt-4">
        <button
          type="button"
          onClick={() => setShowModal(false) || navigate('/tenants')}
          className="text-sm text-gray-500 hover:text-gray-700 underline"
        >
          Cancelar y volver al listado
        </button>
      </div>

      <SuccessModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        successMessage="¡Comercio creado exitosamente!"
        redirectTo={`/tenants`}
        buttonText="Volver al Portal de Tenants"
      />
    </div>
  );
}
