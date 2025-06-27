import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getAllSellers } from '@/apis/sellersService';
import { getProductsByComercioId, updateProductStock } from '@/apis/productsService';
import Button from '@/components/Button';
import Spinner from '@/components/Spinner';
import InputField from '@/components/Inputfield';

export default function StockManagementPage() {
  const navigate = useNavigate();
  const { rol, comercios } = useAuth(); // ✅ usamos 'comercios'

  const [sellers, setSellers] = useState([]);
  const [selectedSellerId, setSelectedSellerId] = useState('');
  const [productos, setProductos] = useState([]);
  const [stockUpdates, setStockUpdates] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Solo operadores pueden acceder
  useEffect(() => {
    if (rol !== 'operador') {
      navigate('/');
    }
  }, [rol, navigate]);

  // Traer comercios asignados
  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const all = await getAllSellers();
        const comercioIds = comercios.map(c => c.comercio_id);
        console.log('📋 IDs asignados:', comercioIds);
        const filtrados = all.filter(seller => comercioIds.includes(seller.comercio_id));
        setSellers(filtrados);
      } catch (err) {
        console.error('Error al obtener comercios:', err);
        setError('No se pudieron cargar los comercios.');
      }
    };
    fetchSellers();
  }, [comercios]);

  const fetchProductos = async (comercioId) => {
    setIsLoading(true);
    setError('');
    try {
      const response = await getProductsByComercioId(comercioId);
      setProductos(response.productos || []);
      setStockUpdates({});
    } catch (err) {
      console.error('Error obteniendo productos del comercio:', err);
      setError('No se pudieron cargar los productos.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStockChange = (productoId, value) => {
    setStockUpdates(prev => ({
      ...prev,
      [productoId]: value
    }));
  };

  const handleSave = async (productoId) => {
    const cantidad_stock = Number(stockUpdates[productoId]);
    if (isNaN(cantidad_stock)) return;

    try {
      await updateProductStock(selectedSellerId, productoId, { cantidad_stock });
      await fetchProductos(selectedSellerId); // refrescar
    } catch (err) {
      console.error('Error al actualizar stock:', err);
      alert('Hubo un error al guardar el stock');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestión de Stock</h1>

      {/* Select de comercios */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Seleccionar comercio</label>
        <select
          value={selectedSellerId}
          onChange={(e) => {
            setSelectedSellerId(e.target.value);
            fetchProductos(e.target.value);
          }}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2"
        >
          <option value="">-- Seleccionar --</option>
          {sellers.map(s => (
            <option key={s.comercio_id} value={s.comercio_id}>
              {s.nombre}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <Spinner />
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-md">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-4 py-2 border-b">Producto</th>
                <th className="text-left px-4 py-2 border-b">Stock actual</th>
                <th className="text-left px-4 py-2 border-b">Nuevo stock</th>
                <th className="text-left px-4 py-2 border-b">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map(producto => (
                <tr key={producto.producto_id} className="border-t">
                  <td className="px-4 py-2">{producto.nombre_producto}</td>
                  <td className="px-4 py-2">{producto.cantidad_stock}</td>
                  <td className="px-4 py-2">
                    <InputField
                      type="number"
                      value={stockUpdates[producto.producto_id] || ''}
                      onChange={(e) => handleStockChange(producto.producto_id, e.target.value)}
                    />
                  </td>
                  <td className="px-4 py-2">
                    <Button
                      onClick={() => handleSave(producto.producto_id)}
                      disabled={!stockUpdates[producto.producto_id]}
                    >
                      Guardar
                    </Button>
                  </td>
                </tr>
              ))}
              {productos.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-gray-500">
                    No hay productos disponibles
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
