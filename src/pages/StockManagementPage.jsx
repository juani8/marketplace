import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getAllSellers } from '@/apis/sellersService';
import { getProductsByComercioId, updateProductStock } from '@/apis/productsService';
import Button from '@/components/Button';
import Spinner from '@/components/Spinner';
import InputField from '@/components/InputField';
import { Pencil, Save, X } from 'lucide-react';

export default function StockManagementPage() {
  const navigate = useNavigate();
  const { rol, comercios } = useAuth();

  const [sellers, setSellers] = useState([]);
  const [selectedSellerId, setSelectedSellerId] = useState(null);
  const [productos, setProductos] = useState([]);
  const [editMode, setEditMode] = useState({});
  const [stockChanges, setStockChanges] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (rol !== 'operador') {
      navigate('/');
    }
  }, [rol, navigate]);

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const all = await getAllSellers();
        const comercioIds = comercios.map(c => c.comercio_id);
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
    setSuccessMessage('');
    try {
      const response = await getProductsByComercioId(comercioId);
      setProductos(response.productos || []);
      setStockChanges({});
    } catch (err) {
      console.error('Error obteniendo productos del comercio:', err);
      setError('No se pudieron cargar los productos.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestión de Stock</h1>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Seleccionar comercio</label>
        <select
          value={selectedSellerId}
          onChange={(e) => {
            const id = parseInt(e.target.value, 10);
            setSelectedSellerId(id);
            fetchProductos(id);
          }}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2"
        >
          <option value="">-- Seleccionar --</option>
          {sellers.map(s => (
            <option key={s.comercio_id} value={s.comercio_id}>{s.nombre}</option>
          ))}
        </select>
      </div>

      {successMessage && <div className="mb-4 text-green-600 font-medium">✅ {successMessage}</div>}

      {isLoading ? (
        <Spinner />
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-md">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-4 py-2 border-b">ID</th>
                <th className="text-left px-4 py-2 border-b">Producto</th>
                <th className="text-left px-4 py-2 border-b">Stock</th>
                <th className="text-left px-4 py-2 border-b">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map(producto => {
                const isEditing = editMode[producto.producto_id] || false;
                const currentStock = stockChanges[producto.producto_id] ?? producto.cantidad_stock;

                return (
                  <tr key={producto.producto_id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-700">{producto.producto_id}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">{producto.nombre_producto}</td>
                    <td className="px-4 py-3">
                      <InputField
                        type="number"
                        value={currentStock}
                        onChange={(e) => setStockChanges(prev => ({ ...prev, [producto.producto_id]: e.target.value }))}
                        disabled={!isEditing}
                        className={isEditing ? 'border-blue-500 ring-2 ring-blue-200' : ''}
                      />
                    </td>
                    <td className="px-4 py-3 flex items-center gap-2">
                      {!isEditing ? (
                        <Button
                          variant="secondary"
                          icon={Pencil}
                          onClick={() => setEditMode(prev => ({ ...prev, [producto.producto_id]: true }))}
                        >
                          Editar
                        </Button>
                      ) : (
                        <>
                          <Button
                            icon={Save}
                            onClick={async () => {
                              const cantidad_stock = Number(stockChanges[producto.producto_id]);
                              if (isNaN(cantidad_stock)) return;
                              try {
                                await updateProductStock(selectedSellerId, producto.producto_id, { cantidad_stock });
                                await fetchProductos(selectedSellerId);
                                setEditMode(prev => ({ ...prev, [producto.producto_id]: false }));
                                setSuccessMessage('Stock actualizado correctamente.');
                              } catch (err) {
                                console.error('Error al actualizar stock:', err);
                                alert('Hubo un error al guardar el stock');
                              }
                            }}
                          >
                            Guardar
                          </Button>
                          <Button
                            variant="danger"
                            icon={X}
                            onClick={() => {
                              setEditMode(prev => ({ ...prev, [producto.producto_id]: false }));
                              setStockChanges(prev => ({
                                ...prev,
                                [producto.producto_id]: producto.cantidad_stock
                              }));
                            }}
                          >
                            Cancelar
                          </Button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}

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
