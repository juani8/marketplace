import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllSellers, deleteSeller } from '../apis/sellersService';
import SellersTable from '../components/SellersTable';
import ButtonAdd from '../components/ButtonAdd';
import SuccessModal from '../components/SuccessModal';
import ConfirmModal from '../components/ConfirmModal';
import { useAuth } from '../contexts/AuthContext';

export default function SellersPage() {
  const { rol } = useAuth();
  const navigate = useNavigate();

  const [sellers, setSellers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [sellerToDelete, setSellerToDelete] = useState(null);


  useEffect(() => {
    async function fetchSellers() {
      try {
        const data = await getAllSellers();
        setSellers(data);
      } catch (err) {
        console.error('Error al obtener los comercios:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSellers();
  }, []);

  const handleEdit = (sellerId) => {
    navigate(`/sellers/edit/${sellerId}`);
  };

  const confirmDelete = (sellerId) => {
    setSellerToDelete(sellerId);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    setConfirmOpen(false);
    try {
      await deleteSeller(sellerToDelete);
      setSellers((prev) => prev.filter((s) => s.comercio_id !== sellerToDelete));
      setSuccessMessage('Comercio eliminado correctamente');
      setShowModal(true);
    } catch (err) {
      console.error('Error al eliminar comercio:', err);
      alert('❌ No se pudo eliminar el comercio');
    }
  };


    return (
    <div className="p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0 mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Mis Comercios</h1>
          {rol === 'admin' && (
              <ButtonAdd onClick={() => navigate('/sellers/create')} text="Añadir Comercio" />
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center min-h-screen">
            <div className="flex flex-col items-center text-gray-600">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
              <div className="text-lg">Cargando comercios...</div>
            </div>
          </div>
        ) : (
          <SellersTable
            sellers={sellers}
            onEdit={handleEdit}
            onDelete={confirmDelete}
          />
        )}
        <SuccessModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        successMessage={successMessage}
        redirectTo="/sellers"
        />
        <ConfirmModal
          isOpen={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          onConfirm={handleConfirmDelete}
          message="¿Estás seguro de que querés eliminar este comercio?"
        />
    </div>
    );

}
