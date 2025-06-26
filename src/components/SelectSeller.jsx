import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { getSellersByUsuario } from '../apis/sellersService';
import { useTenant } from '../contexts/TenantContext';

export default function SelectSeller({ onSelect }) {
  const { userId } = useTenant();
  const [sellers, setSellers] = useState([]);
  const [selectedSellerId, setSelectedSellerId] = useState('');

  useEffect(() => {
    if (!userId) return;

    const fetchSellers = async () => {
      try {
        const sellersList = await getSellersByUsuario(userId); 
        setSellers(sellersList);
      } catch (error) {
        console.error('Error al obtener los comercios:', error);
      }
    };

    fetchSellers();
  }, [userId]);

  const handleSelect = () => {
    if (selectedSellerId) {
      const seller = sellers.find(s => s.comercio_id === Number(selectedSellerId));
      if (onSelect) onSelect(seller);
    }
  };

  return (
    <div className="max-w-md">
      <label className="block text-lg font-medium text-neutral mb-2">
        Selecciona un comercio
      </label>
      <select
        className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4"
        value={selectedSellerId}
        onChange={(e) => setSelectedSellerId(e.target.value)}
      >
        <option value="">-- Selecciona un comercio --</option>
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
        Cargar comercio
      </button>
    </div>
  );
}

SelectSeller.propTypes = {
  onSelect: () => {}, 
};
