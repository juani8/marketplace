import PropTypes from 'prop-types';
import Modal from './Modal';

export default function OrderDetailModal({ order, onClose }) {
  return (
    <Modal onClose={onClose}>
      <h2 className="text-xl font-bold mb-4">Detalle de Orden #{order.id}</h2>

      <div className="space-y-2 text-sm">
        <p><strong>Cliente:</strong> {order.cliente}</p>
        <p><strong>Medio de pago:</strong> {order.detalles?.includes('Pago:') ? order.detalles.split(',')[0].split(':')[1].trim() : '-'}</p>
        <p><strong>Dirección de entrega:</strong> {order.detalles?.includes('Entrega:') ? order.detalles.split(',')[1].split(':')[1].trim() : '-'}</p>
        <p><strong>Estado:</strong> {order.estado}</p>
        <p><strong>Total:</strong> ${order.total}</p>
        <p><strong>Fecha de creación:</strong> {order.fecha}</p>
      </div>
    </Modal>
  );
}

OrderDetailModal.propTypes = {
  order: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired
};
