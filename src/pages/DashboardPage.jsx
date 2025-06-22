import { useState, useEffect } from 'react';
import OrderTable from '../components/OrderTable';
import OrderMetrics from '../components/OrderMetrics';
import OrderDetailModal from '../components/OrderDetailModal';
import { mockOrders } from '../mocks/mockOrders';

export default function DashboardPage() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filters, setFilters] = useState({ estado: '', cliente: '', desde: '', hasta: '' });

  useEffect(() => {
    // Simula fetch desde backend
    setOrders(mockOrders);
    setFilteredOrders(mockOrders);
  }, []);

  useEffect(() => {
    const filtered = orders.filter(order => {
      const matchEstado = filters.estado ? order.estado === filters.estado : true;
      const matchCliente = filters.cliente ? order.cliente.toLowerCase().includes(filters.cliente.toLowerCase()) : true;
      const matchDesde = filters.desde ? new Date(order.fecha) >= new Date(filters.desde) : true;
      const matchHasta = filters.hasta ? new Date(order.fecha) <= new Date(filters.hasta) : true;
      return matchEstado && matchCliente && matchDesde && matchHasta;
    });
    setFilteredOrders(filtered);
  }, [filters, orders]);

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Dashboard de Órdenes</h1>
      <OrderMetrics orders={orders} />
      <OrderTable
        orders={filteredOrders}
        filters={filters}
        setFilters={setFilters}
        onSelectOrder={setSelectedOrder}
      />
      {selectedOrder && (
        <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}
    </div>
  );
}
