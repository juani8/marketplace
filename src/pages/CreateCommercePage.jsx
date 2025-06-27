import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SellerForm from '@/components/SellerForm';
import api from '@/apis/api_config';

export default function CreateCommercePage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [showErrors, setShowErrors] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isEditing] = useState(false); // este componente siempre crea, así que true

  // 🟡 Inicializar todos los días como inactivos
  const crearHorariosIniciales = () => {
    const dias = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];
    const horarios = {};
    dias.forEach(dia => {
      horarios[dia] = {
        activo: false,
        desde: '',
        hasta: ''
      };
    });
    return horarios;
  };

  const [formData, setFormData] = useState({
    nombre: '',
    calle: '',
    numero: '',
    ciudad: '',
    provincia: '',
    codigo_postal: '',
    configuracion_operativa: {
      horarios: crearHorariosIniciales()
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    // 🟡 Para los horarios (name incluye punto)
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

  const transformarHorarios = (horariosObj) => {
    return Object.entries(horariosObj).map(([dia, data]) => ({
      dia_semana: dia, // como string: 'lunes', 'martes', etc.
      hora_apertura: data.activo ? data.desde : null,
      hora_cierre: data.activo ? data.hasta : null,
      estado: 'activo'
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
        horarios: transformarHorarios(formData.configuracion_operativa.horarios),
      };
      console.log('Payload a enviar:', payload);

      await api.post('/sellers', payload);
      navigate('/sellers');
    } catch (err) {
      console.error(err);
      console.log('📩 Detalle del backend:', err.response?.data); // 👈 Agregá esto
      setError('Error al crear el comercio. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Crear Comercio</h1>
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
        isEditing={isEditing}
      />
    </div>
  );
}
