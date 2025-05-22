import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PromotionForm from '../components/PromotionForm';
import { createPromotion } from '../apis/promotionsService';

export default function CreatePromotionPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    tipo_promocion: '',
    valor_descuento: '',
    productos_incluidos: [],
  });
  const [error, setError] = useState('');
  const [showErrors, setShowErrors] = useState(false);

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
      await createPromotion(formData);
      navigate('/promociones');
    } catch (err) {
      console.error('Error al crear la promoción', err);
      setError('Ocurrió un error al crear la promoción.');
    } finally {
      setIsLoading(false);
    }
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
        isLoading={isLoading}
      />
    </div>
  );
}
