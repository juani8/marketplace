import PropTypes from 'prop-types';

export default function OrderDetailModal({ order, onClose }) {
  if (!order) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white rounded p-6 w-full max-w-md shadow-lg relative">
        <h2 className="text-xl font-bold mb-4">Detalle de Orden #{order.id}</h2>
        <p><strong>Cliente:</strong> {order.cliente}</p>
        <p><strong>Estado:</strong> {order.estado}</p>
        <p><strong>Fecha:</strong> {order.fecha}</p>
        <p><strong>Total:</strong> ${order.total}</p>
        <p className="mt-4"><strong>Detalles:</strong> {order.detalles}</p>
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          ✕
        </button>
      </div>
    </div>
  );
}

OrderDetailModal.propTypes = {
  order: PropTypes.object,
  onClose: PropTypes.func.isRequired,
};
