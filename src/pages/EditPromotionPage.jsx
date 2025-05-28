import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PromotionForm from '../components/PromotionForm';
import SuccessModal from '../components/SuccessModal';
import { getAllPromotions, updatePromotion } from '../apis/promotionsService';

export default function EditPromotionPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showErrors, setShowErrors] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [originalFormData, setOriginalFormData] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const fetchPromotion = async () => {
        try {
          const allPromos = await getAllPromotions();
          const promo = allPromos.find(p => p.promocion_id === parseInt(id));
          if (!promo) {
            setError('Promoción no encontrada.');
            return;
          }
      
          const promotionData = {
            nombre: promo.nombre,
            tipo_promocion: promo.tipo_promocion,
            valor_descuento: parseFloat(promo.valor_descuento),
            lista_productos: promo.productos?.map(p => String(p.producto_id)) || [],
            fecha_inicio: promo.fecha_inicio?.split('T')[0] || '',
            fecha_fin: promo.fecha_fin?.split('T')[0] || '',
          };
      
          setFormData(promotionData);
          setOriginalFormData(promotionData);
        } catch (err) {
          console.error('Error al cargar promoción:', err);
          setError('No se pudo cargar la promoción.');
        } finally {
          setIsLoading(false);
        }
      };      

    fetchPromotion();
  }, [id]);

  useEffect(() => {
    if (formData && originalFormData) {
      const changed = JSON.stringify(formData) !== JSON.stringify(originalFormData);
      setHasChanges(changed);
    }
  }, [formData, originalFormData]);
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError('');
    try {
      await updatePromotion(id, formData);
      setOriginalFormData({ ...formData });
      setShowModal(true);
    } catch (err) {
      console.error('Error al actualizar la promoción:', err);
      setError('Ocurrió un error al actualizar la promoción.');
    } finally {
      setIsLoading(false);
    }
  };
  

  if (isLoading || !formData) {
    return (
        <div className="flex justify-center items-center min-h-screen">
        <div className="flex flex-col items-center text-gray-600">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <div className="text-lg">Cargando promoción...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Editar Promoción</h1>
      <PromotionForm
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        error={error}
        showErrors={showErrors}
        setShowErrors={setShowErrors}
        isLoading={isLoading}
        hasChanges={hasChanges}
        editingPromotionId={parseInt(id)}
      />
      <SuccessModal
        isOpen={showModal}
        onClose={() => {
            setShowModal(false);
            navigate('/promociones');
        }}
        successMessage="¡Promoción actualizada exitosamente!"
        redirectTo="/promociones"
        buttonText="Volver a listado"
       />
    </div>
  );
}
