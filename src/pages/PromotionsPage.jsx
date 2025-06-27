import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getAllPromotions, deletePromotion } from '../apis/promotionsService';
import ButtonAdd from '../components/ButtonAdd';
import PromotionsTable from '../components/PromotionsTable';
import SuccessModal from '../components/SuccessModal';
import ConfirmModal from '../components/ConfirmModal';

export default function PromotionsPage() {
  const [promociones, setPromociones] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [promoToDelete, setPromoToDelete] = useState(null);
  const navigate = useNavigate();
  const { tenantId, rol } = useAuth();

  useEffect(() => {
    async function fetchPromos() {
      if (!tenantId) return;
      try {
        const promos = await getAllPromotions(tenantId);
        setPromociones(promos);
      } catch (err) {
        console.error('Error al cargar promociones:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchPromos();
  }, [tenantId]); 

  const handleEdit = (promo) => {
    navigate(`/promociones/edit/${promo.promocion_id}`);
  };

  const confirmDelete = (promo) => {
    setPromoToDelete(promo);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    setConfirmOpen(false);
    try {
      await deletePromotion(promoToDelete.promocion_id);
      setPromociones((prev) =>
        prev.filter((p) => p.promocion_id !== promoToDelete.promocion_id)
      );
      setSuccessMessage(`"${promoToDelete.nombre}" eliminada correctamente`);
      setShowModal(true);
    } catch (err) {
      console.error('❌ Error al eliminar promoción:', err);
      alert('No se pudo eliminar la promoción');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex flex-col items-center text-gray-600">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <div className="text-lg">Cargando promociones...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0 mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Promociones</h1>
          {rol === 'admin' && (
            <ButtonAdd onClick={() => navigate(`/promociones/create`)} text="Añadir Promoción" />
          )}
      </div>

      <PromotionsTable
        promotions={promociones}
        onEdit={handleEdit}
        onDelete={confirmDelete}
      />

      <SuccessModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        successMessage={successMessage}
        redirectTo={`/promociones`}
      />
      <ConfirmModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        message={`¿Estás seguro de que querés eliminar la promoción "${promoToDelete?.nombre}"?`}
      />
    </div>
  );
}
