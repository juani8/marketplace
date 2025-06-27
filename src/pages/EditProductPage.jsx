import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ProductForm from '../components/ProductForm';
import SuccessModal from '../components/SuccessModal';
import { getProductById, updateProduct } from '../apis/productsService';
import { getAllCategories } from '../apis/categoriesService';
import { useAuth } from '../contexts/AuthContext';

export default function EditProductPage() {
  const { productId } = useParams();
  const { tenantId } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(null);
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [showErrors, setShowErrors] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [product, allCategories] = await Promise.all([
          getProductById(productId),
          getAllCategories()
        ]);

        if (!product) {
          navigate('/products');
          return;
        }

        const formattedCategories = allCategories.map((cat) => ({
          value: String(cat.categoria_id),
          label: cat.nombre,
        }));

        setFormData({
          ...product,
          categoria_id: String(product.categoria_id),
          precio: String(product.precio),
        });

        setCategories(formattedCategories);
      } catch (err) {
        console.error('Error al cargar producto:', err);
        setError('No se pudo cargar el producto.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [productId, navigate]);

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

      await updateProduct(tenantId, payload);
      setShowModal(true);
    } catch (err) {
      const mensaje =
        err.response?.data?.message || err.response?.data?.error || err.message || 'Error desconocido';
      console.error('❌ Error en updateProduct:', mensaje);
      setError(`❌ Error al actualizar el producto: ${mensaje}`);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = () =>
    formData?.nombre_producto?.trim() &&
    formData?.descripcion?.trim() &&
    formData?.categoria_id &&
    formData?.precio > 0;

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  if (isLoading || !formData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex flex-col items-center text-gray-600">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <div className="text-lg">Cargando producto...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Editar Producto</h1>
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
          navigate(`/products`);
        }}
        successMessage="¡Producto modificado exitosamente!"
        redirectTo={`/products`}
        buttonText="Volver al Catálogo"
      />
    </div>
  );
}
