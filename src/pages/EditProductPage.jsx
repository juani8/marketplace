import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ProductForm from '../components/ProductForm';
import SuccessModal from '../components/SuccessModal';
import { getProductById, updateProduct } from '../apis/productsService';
import { getAllCategories } from '../apis/categoriesService';

export default function EditProductPage() {
  const { tenantId, productId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(null);
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [showErrors, setShowErrors] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [product, allCategories] = await Promise.all([
          getProductById(productId),
          getAllCategories()
        ]);

        if (!product) return navigate(`/products/catalogue/${tenantId}`);

        const formattedCategories = allCategories.map((cat) => ({
          value: String(cat.categoria_id),
          label: cat.nombre,
        }));

        setFormData({ ...product });
        setCategories(formattedCategories);
      } catch (err) {
        console.error('Error al cargar datos:', err);
        navigate(`/products/catalogue/${tenantId}`);
      }
    }

    fetchData();
  }, [tenantId, productId, navigate]);

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
    setIsLoading(true);
    setError('');

    try {
      const cleanFormData = { ...formData };
      delete cleanFormData.catalogo_id;

      await updateProduct(tenantId, cleanFormData);
      setShowModal(true);
    } catch (err) {
      console.error('Error actualizando producto:', err);
      setError('❌ Error al actualizar el producto');
    } finally {
      setIsLoading(false);
    }
  };

  if (!formData) return null;

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
        nextStep={() => setStep((s) => s + 1)}
        prevStep={() => setStep((s) => s - 1)}
        error={error}
        showErrors={showErrors}
        setShowErrors={setShowErrors}
        isLoading={isLoading}
        categories={categories}
      />

      <SuccessModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        successMessage="¡Producto modificado exitosamente!"
        redirectTo={`/products/catalogue/${tenantId}`}
        buttonText="Volver al Catálogo"
      />
    </div>
  );
}
