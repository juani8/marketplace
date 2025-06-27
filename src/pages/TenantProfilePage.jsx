import { useState, useEffect } from 'react';
import TenantForm from '../components/SellerForm';
import SuccessModal from '../components/SuccessModal';
import Button from '../components/Button';
import { Pencil } from 'lucide-react';

export default function TenantProfilePage() {

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(null);
  const [originalFormData, setOriginalFormData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [noChangesNotice, setNoChangesNotice] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
  
    try {
      if (!formData.tenant_id) {
        setError('No se encontró el ID del tenant. No se puede actualizar.');
        setIsLoading(false);
        return;
      }
  
      const hasChanges = JSON.stringify(formData) !== JSON.stringify(originalFormData);
  
      if (hasChanges) {
        // 💡 Aplanamos datos_contacto y direccion
        const payload = {
          ...formData,
          calle: formData.calle,
          numero: formData.numero,
          ciudad: formData.ciudad,
          provincia: formData.provincia,
          codigo_postal: formData.codigo_postal,
          lat: formData.lat,
          lon: formData.lon,
        };
  
        // Eliminamos los anidados que no existen como columnas
        delete payload.datos_contacto;
        delete payload.direccion;
  
        await updateTenant(payload);
        setShowModal(true);
        setOriginalFormData(formData);
        setIsEditing(false);
      } else {
        setNoChangesNotice(true);
        setTimeout(() => setNoChangesNotice(false), 3000);
      }
    } catch (err) {
      console.error(err);
      setError('❌ Error al guardar los cambios');
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    const fetchTenant = async () => {
      try {
        const tenant = await getTenantById(); // Simula el tenant logueado
        const transformedTenant = {
          tenant_id: tenant.tenant_id,
          nombre: tenant.nombre,
          razon_social: tenant.razon_social,
          cuenta_bancaria: tenant.cuenta_bancaria,
          estado: tenant.estado,
          horario_apertura: tenant.horario_apertura || '12:00',
          horario_cierre: tenant.horario_cierre || '22:00',
          datos_contacto: {
            email: tenant.email || '',
            tel: tenant.telefono || '',
          },
          calle: tenant.calle || '',
          numero: tenant.numero || '',
          ciudad: tenant.ciudad || '',
          provincia: tenant.provincia || '',
          codigo_postal: tenant.codigo_postal || '',
          lat: tenant.lat || '',
          lon: tenant.lon || '',
        };
        
        setFormData(transformedTenant);
        setOriginalFormData(transformedTenant);
      } catch (err) {setError('❌ Error al cargar los datos del comercio');}
    };
    fetchTenant();
  }, []);

  if (!formData && !error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex flex-col items-center text-gray-600">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <div className="text-lg">Cargando tus datos...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Mi Perfil</h1>

      {noChangesNotice && (
        <div className="bg-yellow-100 text-yellow-800 border border-yellow-300 p-3 rounded mb-4">
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
          setStep={setStep}
          nextStep={() => setStep(step + 1)}
          prevStep={() => setStep(step - 1)}
          error={error}
          isLoading={isLoading}
          showErrors={showErrors}
          setShowErrors={setShowErrors}
          isEditing={isEditing}
        />
      )}

      {/* Botones de acción */}
      {formData && !error && (
        <div className="flex gap-4 mt-6">
          {isEditing ? (
            <>
              <Button
                type="button"
                onClick={handleSubmit}
                loading={isLoading}
                disabled={isLoading}
              >
                Guardar
              </Button>

              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setFormData(originalFormData);
                  setIsEditing(false);
                  setShowErrors(false);
                }}
              >
                Cancelar
              </Button>
            </>
          ) : (
            <Button icon={Pencil} onClick={() => setIsEditing(true)}>
              Editar
            </Button>
          )}
        </div>
      )}

      <SuccessModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        successMessage="¡Datos actualizados exitosamente!"
        redirectTo="/sellers"
        buttonText="Volver a Mi Perfil"
      />
    </div>
  );
}
