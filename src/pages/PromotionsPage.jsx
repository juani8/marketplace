import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllProducts } from '../apis/productsService';
import ButtonAdd from '../components/ButtonAdd';

export default function PromotionsPage() {
  const [promociones, setPromociones] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchPromos() {
      try {
        const productos = await getAllProducts();

        const promosUnicas = [];
        productos.forEach((p) => {
          p.promociones.forEach((promo) => {
            if (!promosUnicas.some((x) => x.promocion_id === promo.promocion_id)) {
              promosUnicas.push(promo);
            }
          });
        });

        setPromociones(promosUnicas);
      } catch (err) {
        console.error('Error al cargar promociones:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPromos();
  }, []);

  // ⏳ Mostrar loading mientras se cargan
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
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Promociones</h1>
        <ButtonAdd
          onClick={() => navigate(`/promociones/create`)}
          text="Añadir Producto"
        />
      </div>

      <div className="grid gap-4">
        {promociones.map((promo) => (
          <div key={promo.promocion_id} className="bg-white p-4 rounded shadow">
            <p><strong>Nombre:</strong> {promo.nombre}</p>
            <p><strong>Tipo:</strong> {promo.tipo_promocion}</p>
            <p><strong>Descuento:</strong> {promo.valor_descuento}</p>
            <p><strong>Productos:</strong> {promo.productos_incluidos.join(', ')}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
