import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getSellersByUsuario } from '../apis/sellersService';
import { useTenant } from '../contexts/TenantContext';

export default function SelectSellerPage() {
  const [sellers, setSellers] = useState([]);
  const [selectedSellerId, setSelectedSellerId] = useState('');
  const navigate = useNavigate();
  const { setSelectedSeller } = useTenant();

  useEffect(() => {
    const fetchSellers = async () => {
      const usuarioId = parseInt(localStorage.getItem('usuario_id'), 10);
      if (!usuarioId) return;

      try {
        const sellersList = await getSellersByUsuario(usuarioId);
        setSellers(sellersList);
      } catch (error) {
        console.error('Error al obtener los comercios:', error);
      }
    };

    fetchSellers();
  }, []);

const handleSelect = () => {
  if (selectedSellerId) {
    const seller = sellers.find(s => s.comercio_id === Number(selectedSellerId));
    localStorage.setItem('selectedSeller', JSON.stringify(seller)); // ⬅️ esto es clave
    setSelectedSeller(seller);
    navigate(`/products/${selectedSellerId}`);
  }
};

  return (
    <div className="min-h-screen bg-background p-5">
      <h1 className="text-2xl font-bold text-gray-800">Catálogo de Productos</h1>

      <div className="max-w-md">
        <label className="block text-lg font-medium text-neutral mb-2">
          Selecciona un seller
        </label>
        <select
          className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4"
          value={selectedSellerId}
          onChange={(e) => setSelectedSellerId(e.target.value)}
        >
          <option value="">-- Selecciona un seller --</option>
          {sellers.map((seller) => (
            <option key={seller.comercio_id} value={seller.comercio_id}>
              {seller.nombre}
            </option>
          ))}
        </select>

        <button
          onClick={handleSelect}
          disabled={!selectedSellerId}
          className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg disabled:opacity-50"
        >
          Ver productos
        </button>
      </div>
    </div>
  );
}
