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
  const [originalFormData, setOriginalFormData] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [noChangesNotice, setNoChangesNotice] = useState(false);

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
          navigate(`/products/catalogue/${tenantId}`);
          return;
        }

        const formattedCategories = allCategories.map((cat) => ({
          value: String(cat.categoria_id),
          label: cat.nombre,
        }));

        setFormData({ ...product });
        setOriginalFormData({ ...product });
        setCategories(formattedCategories);
      } catch (err) {
        console.error('Error al cargar producto:', err);
        setError('No se pudo cargar el producto.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [tenantId, productId, navigate]);

  useEffect(() => {
    if (formData && originalFormData) {
      const isDifferent = JSON.stringify(formData) !== JSON.stringify(originalFormData);
      setHasChanges(isDifferent);
    }
  }, [formData, originalFormData]);

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
      if (!hasChanges) {
        setNoChangesNotice(true);
        setTimeout(() => setNoChangesNotice(false), 3000);
        return;
      }

      const cleanFormData = { ...formData };
      delete cleanFormData.catalogo_id;

      await updateProduct(tenantId, cleanFormData);
      setShowModal(true);
      setOriginalFormData({ ...formData }); // actualiza referencia
    } catch (err) {
      console.error('Error actualizando producto:', err);
      setError('❌ Error al actualizar el producto');
    } finally {
      setIsLoading(false);
    }
  };

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

      {noChangesNotice && (
        <div className="bg-yellow-100 text-yellow-800 border border-yellow-300 p-3 rounded mb-4">
          No realizaste cambios.
        </div>
      )}

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
        hasChanges={hasChanges}
      />

      <SuccessModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          navigate('/products');
      }}
        successMessage="¡Producto modificado exitosamente!"
        redirectTo={`/products`}
        buttonText="Volver al Catálogo"
      />
    </div>
  );
}
