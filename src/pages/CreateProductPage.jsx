import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductForm from '../components/ProductForm';
import SuccessModal from '../components/SuccessModal';
import { createProduct } from '../apis/productsService';
import { getAllCategories } from '../apis/categoriesService';

export default function CreateProductPage() {
  const navigate = useNavigate();
  const tenantId = 1;


  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    categoria: '',
    precio: '',
    stock: '',
    imagenes: [],
  });
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [showErrors, setShowErrors] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [categories, setCategories] = useState([]);

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

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await getAllCategories(); // suponiendo que esto devuelve el array
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

  const isFormValid = () => {
    return (
      formData.nombre.trim() &&
      formData.descripcion.trim() &&
      formData.categoria &&
      formData.precio > 0 &&
      formData.stock >= 0
    );
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
        categories={categories}
        hasChanges={isFormValid()}
      />

      <div className="mt-4">
        <button
          type="button"
          onClick={() => navigate(`/products`)}
          className="text-sm text-gray-500 hover:text-gray-700 underline"
        >
          Cancelar y volver al catálogo
        </button>
      </div>

      <SuccessModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          navigate('/productos');
      }}
        successMessage="¡Producto creado exitosamente!"
        redirectTo={`/products`}
        buttonText="Volver al Catálogo"
      />
    </div>
  );
}
