import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TenantForm from '../components/TenantForm';
import SuccessModal from '../components/SuccessModal';
import { getTenantById, updateTenant } from '../apis/tenantsService';

export default function ModifyTenantPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState(null);
  const [originalFormData, setOriginalFormData] = useState(null);
  const [showErrors, setShowErrors] = useState(false);
  const [noChangesNotice, setNoChangesNotice] = useState(false);

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
        configuracion_operativa: {
          ...prev.configuracion_operativa,
          [key]: value,
        },
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
    setIsLoading(true);

    try {
      const hasChanges = JSON.stringify(formData) !== JSON.stringify(originalFormData);

      if (hasChanges) {
        await updateTenant(formData);
        setShowModal(true);
        setTimeout(() => {
          setShowModal(false);
          navigate('/tenants');
        }, 1500);
      } else {
        setNoChangesNotice(true);
        setTimeout(() => setNoChangesNotice(false), 3000);
      }
    } catch (err) {
      console.error(err);
      setError('❌ Error al modificar el comercio');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchTenant = async () => {
      try {
        const found = await getTenantById(id);
        if (found) {
          setFormData(found);
          setOriginalFormData(found);
        } else {
          setError('❌ No se encontró el comercio.');
        }
      } catch (err) {
        setError('❌ Error al buscar el comercio.');
      }
    };
    fetchTenant();
  }, [id]);

  if (!formData && !error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex flex-col items-center text-gray-600">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <div className="text-lg">Cargando comercio...</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">Modificar Comercio</h1>

      {noChangesNotice && (
        <div className="text-yellow-600 bg-yellow-100 border border-yellow-300 p-3 rounded mb-4">
          No realizaste cambios.
        </div>
      )}

      {error ? (
        <div className="text-red-500 font-semibold">{error}</div>
      ) : (
        <TenantForm
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          step={step}
          nextStep={nextStep}
          prevStep={prevStep}
          error={error}
          isLoading={isLoading}
          showErrors={showErrors}
          setShowErrors={setShowErrors}
        />
      )}

      <div className="mt-4 flex">
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
        successMessage="¡Comercio modificado exitosamente!"
        redirectTo="/tenants"
      />
    </div>
  );
}
