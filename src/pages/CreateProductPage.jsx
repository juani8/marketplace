import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductForm from '../components/ProductForm';
import SuccessModal from '../components/SuccessModal';
import { createProduct } from '../apis/productsService';
import { getAllCategories } from '../apis/categoriesService';
import { useAuth } from '../contexts/AuthContext';

export default function CreateProductPage() {
  const navigate = useNavigate();
  const { tenantId } = useAuth();

  const [formData, setFormData] = useState({
    nombre_producto: '',
    descripcion: '',
    categoria_id: '',
    precio: '',
    imagenes: [],
  });

  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [showErrors, setShowErrors] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await getAllCategories();
        const formatted = res.map((cat) => ({
          value: String(cat.categoria_id),
          label: cat.nombre,
        }));
        setCategories(formatted);
      } catch (err) {
        console.error('Error cargando categorías:', err);
      }
    }

    fetchCategories();
  }, []);

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

  if (!tenantId) {
    setError('❌ No hay comercio seleccionado');
    setIsLoading(false);
    return;
  }

  try {
    const { cantidad_stock: _, ...restFormData } = formData;

    const payload = {
      ...restFormData,
      tenant_id: tenantId,
      nombre_producto: formData.nombre_producto.trim(),
      descripcion: formData.descripcion.trim(),
      categoria_id: Number(formData.categoria_id),
      precio: Number(formData.precio),
      imagenes: formData.imagenes.length > 0 ? formData.imagenes : [],
    };

    console.log('tenantId desde contexto:', tenantId);
    console.log('Payload final:', payload);

    await createProduct(payload);
    setShowModal(true);
  } catch (err) {

      const mensaje =
        err.response?.data?.message || err.response?.data?.error || err.message || 'Error desconocido';

      console.error('❌ Error en createProduct:', mensaje);
      setError(`❌ Error al crear el producto: ${mensaje}`);
    }
};


  const isFormValid = () =>
    formData.nombre_producto.trim() &&
    formData.descripcion.trim() &&
    formData.categoria_id &&
    formData.precio > 0

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
        categories={categories}
        hasChanges={isFormValid()}
      />

      <div className="mt-4">
        <button
          type="button"
          onClick={() => navigate(`/products/`)}
          className="text-sm text-gray-500 hover:text-gray-700 underline"
        >
          Cancelar y volver al catálogo
        </button>
      </div>

      <SuccessModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          navigate(`/products`);
        }}
        successMessage="¡Producto creado exitosamente!"
        redirectTo={`/products`}
        buttonText="Volver al Catálogo"
      />
    </div>
  );
}
