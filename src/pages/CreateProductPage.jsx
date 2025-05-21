import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ProductForm from '../components/ProductForm';
import SuccessModal from '../components/SuccessModal';
import { createProduct } from '../apis/productsService';

export default function CreateProductPage() {
  const navigate = useNavigate();
  const { tenantId } = useParams();

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    categoria: '',
    precio: '',
    precio_descuento: '',
    stock: '',
    oferta: false,
    destacado: false,
    imagenes: [],
  });
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [showErrors, setShowErrors] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
  
    const parsedValue =
      type === 'radio'
        ? value === 'true'
        : type === 'number'
        ? Number(value)
        : value;
  
    setFormData((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));
  };  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await createProduct(tenantId, formData);
      setShowModal(true);
    } catch (err) {
      console.error(err);
      setError('❌ Error al crear el producto');
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  return (
    <div className="p-5">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Añadir Producto</h1>
      </div>

      <ProductForm
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        step={step}
        setStep={setStep}
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
          onClick={() => navigate(`/products/catalogue/${tenantId}`)}
          className="text-sm text-gray-500 hover:text-gray-700 underline"
        >
          Cancelar y volver al catálogo
        </button>
      </div>

      <SuccessModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        successMessage="¡Producto creado exitosamente!"
        redirectTo={`/products/catalogue/${tenantId}`}
        buttonText="Volver al Catálogo"
      />
    </div>
  );
}
