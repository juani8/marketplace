import PropTypes from 'prop-types';

export default function LogoutConfirmModal({ isOpen, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl text-center w-11/12 max-w-sm">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          ¿Estás segura/o de cerrar sesión?
        </h2>
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={onCancel}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
}

LogoutConfirmModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};