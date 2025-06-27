import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../apis/api_config';
import SuccessModal from '../components/SuccessModal';

export default function CreateCategoryPage() {
  const { rol } = useAuth();
  const navigate = useNavigate();

  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (rol !== 'admin') {
    return <div className="p-4 text-red-600">Acceso denegado. Solo administradores pueden crear categorías.</div>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await api.post('/categories', { nombre: nombre.trim(), descripcion: descripcion.trim() });
      setShowModal(true);
    } catch (err) {
      const mensaje = err.response?.data?.message || err.message || 'Error desconocido';
      setError(`❌ No se pudo crear la categoría: ${mensaje}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Crear Nueva Categoría</h1>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Nombre</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Descripción (opcional)</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
        >
          {isLoading ? 'Creando...' : 'Crear Categoría'}
        </button>
      </form>

      <SuccessModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          navigate('/products/create');
        }}
        successMessage="¡Categoría creada exitosamente!"
        redirectTo="/products/create"
        buttonText="Ir a crear producto"
      />
    </div>
  );
}
