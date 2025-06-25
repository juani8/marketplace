import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTenant } from '../contexts/TenantContext';
import PromotionForm from '../components/PromotionForm';
import { createPromotion } from '../apis/promotionsService';
import SuccessModal from '../components/SuccessModal';

export default function CreatePromotionPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    tipo_promocion: '',
    valor_descuento: '',
    lista_productos: [],
    fecha_inicio: '',
    fecha_fin: '',
  });
  const [error, setError] = useState('');
  const [showErrors, setShowErrors] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { tenantId } = useTenant();

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError('');
    try {
      await createPromotion(formData, tenantId);
      setShowModal(true); // ✅ Muestra el modal
    } catch (err) {
      console.error('Error al crear la promoción', err);
      setError('Ocurrió un error al crear la promoción.');
    } finally {
      setIsLoading(false);
    }
  };  

  const isFormValid = () => {
    return (
      formData.nombre.trim() &&
      formData.tipo_promocion &&
      formData.valor_descuento > 0 &&
      formData.lista_productos.length > 0 &&
      formData.fecha_inicio &&
      formData.fecha_fin
    );
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Crear Promoción</h1>
      <PromotionForm
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        error={error}
        showErrors={showErrors}
        setShowErrors={setShowErrors}
        hasChanges={isFormValid()}
        isLoading={isLoading}
      />
      <SuccessModal
        isOpen={showModal}
        onClose={() => {
            setShowModal(false);
            navigate('/promociones');
        }}
        successMessage="¡Promoción creada exitosamente!"
        redirectTo="/promociones"
        buttonText="Volver al listado"
      />
    </div>
  );
}
