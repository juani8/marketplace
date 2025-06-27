// src/pages/DashboardPage.jsx
import { useState, useEffect } from 'react';
import OrderTable from '../components/OrderTable';
import OrderMetrics from '../components/OrderMetrics';
import OrderDetailModal from '../components/OrderDetailModal';
import OrderStatusChart from '../components/OrderStatusChart';
import { getOrdersByComercio } from '../apis/ordersService';
import SelectSeller from '../components/SelectSeller';
import { useAuth } from '../contexts/AuthContext';

export default function DashboardPage() {
  const { rol, userId } = useAuth(); 
  const [selectedSeller, setSelectedSeller] = useState(null);

  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [filters, setFilters] = useState({
    estado: '',
    cliente: '',
    desde: '',
    hasta: ''
  });

  useEffect(() => {
    if (!selectedSeller?.comercio_id) {
      setOrders([]);
      setFilteredOrders([]);
      return;
    }

    const fetchOrders = async () => {
      try {
        const data = await getOrdersByComercio(selectedSeller.comercio_id);
        setOrders(data);
        setFilteredOrders(data);
      } catch (error) {
        console.error('Error al obtener órdenes:', error);
      }
    };

    fetchOrders();
  }, [selectedSeller]);

  useEffect(() => {
    const filtered = orders.filter(order => {
      const matchEstado = filters.estado ? order.estado === filters.estado : true;
      const matchCliente = filters.cliente
        ? order.cliente?.toLowerCase().includes(filters.cliente.toLowerCase())
        : true;
      const matchDesde = filters.desde ? new Date(order.fecha) >= new Date(filters.desde) : true;
      const matchHasta = filters.hasta ? new Date(order.fecha) <= new Date(filters.hasta) : true;

      return matchEstado && matchCliente && matchDesde && matchHasta;
    });

    setFilteredOrders(filtered);
  }, [filters, orders]);

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard de Órdenes</h1>

      {/* Selector de comercio */}
      <div className="mb-6">
        <SelectSeller onSelect={setSelectedSeller} />
      </div>

      {/* Solo mostramos el dashboard si hay un comercio seleccionado */}
      {selectedSeller ? (
        <>
        <h2 className="text-lg font-semibold mb-2">Distribución por Estado</h2>
          <div className="flex flex-col lg:flex-row gap-6 mb-6">
            <div className="flex-1">
              
              <OrderStatusChart orders={orders} />
            </div>
                        <div className="flex-1">
              <OrderMetrics orders={orders} />
            </div>
          </div>
          
          <OrderTable
            orders={filteredOrders}
            filters={filters}
            setFilters={setFilters}
            onSelectOrder={setSelectedOrder}
          />
          {selectedOrder && (
            <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
          )}
        </>
      ) : (
        <p className="text-gray-500 italic">Seleccioná un comercio para ver sus órdenes.</p>
      )}
    </div>
  );
}
