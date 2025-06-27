import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SellerForm from '@/components/SellerForm';
import { getSellerById, updateSeller } from '@/apis/sellersService';

export default function EditCommercePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [showErrors, setShowErrors] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState(null);

  // Util para transformar horarios del backend al formato del form
  const transformarHorariosDesdeBackend = (horariosArray) => {
    const obj = {};
    horariosArray.forEach((h) => {
      obj[h.dia_semana] = {
        activo: h.hora_apertura && h.hora_cierre,
        desde: h.hora_apertura || '',
        hasta: h.hora_cierre || ''
      };
    });
    return obj;
  };

  // Util para transformar al payload del backend
  const transformarHorariosParaBackend = (horariosObj) => {
    return Object.entries(horariosObj).map(([dia, data]) => ({
      dia_semana: dia,
      hora_apertura: data.activo ? data.desde : null,
      hora_cierre: data.activo ? data.hasta : null,
      estado: 'activo'
    }));
  };

  useEffect(() => {
    async function fetchSeller() {
      try {
        const data = await getSellerById(id);

        setFormData({
          nombre: data.nombre || '',
          calle: data.calle || '',
          numero: data.numero || '',
          ciudad: data.ciudad || '',
          provincia: data.provincia || '',
          codigo_postal: data.codigo_postal || '',
          configuracion_operativa: {
            horarios: transformarHorariosDesdeBackend(data.horarios || [])
          }
        });
      } catch (err) {
        console.error('Error al cargar comercio:', err);
        setError('No se pudo cargar el comercio.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchSeller();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes('configuracion_operativa.horarios')) {
      setFormData((prev) => ({
        ...prev,
        configuracion_operativa: {
          ...prev.configuracion_operativa,
          horarios: value
        }
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const payload = {
        nombre: formData.nombre,
        calle: formData.calle,
        numero: formData.numero,
        ciudad: formData.ciudad,
        provincia: formData.provincia,
        codigo_postal: formData.codigo_postal,
        horarios: transformarHorariosParaBackend(formData.configuracion_operativa.horarios)
      };

      await updateSeller(id, payload);
      navigate('/sellers');
    } catch (err) {
      console.error(err);
      console.log('📩 Detalle del backend:', err.response?.data);
      setError('Error al actualizar el comercio.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !formData) {
    return <div className="text-center py-10">Cargando datos del comercio...</div>;
  }

  return (
    <div className="py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Editar Comercio</h1>
      <SellerForm
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        step={step}
        setStep={setStep}
        nextStep={() => setStep((prev) => prev + 1)}
        prevStep={() => setStep((prev) => prev - 1)}
        error={error}
        showErrors={showErrors}
        setShowErrors={setShowErrors}
        isLoading={isLoading}
        isEditing={true}
      />
    </div>
  );
}
