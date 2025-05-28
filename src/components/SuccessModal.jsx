import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

export default function SuccessModal({
  isOpen,
  onClose,
  successMessage = "¡Operación exitosa!",
  redirectTo = "/",
  buttonText = "Volver"
}) {
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose(); // Cierra el modal
        navigate(redirectTo);
        setTimeout(() => window.location.reload(), 100);
      }, 2000); // ⏱ Espera 2 segundos

      return () => clearTimeout(timer); // Limpia si se desmonta antes
    }
  }, [isOpen, navigate, onClose, redirectTo]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg text-center w-11/12 max-w-md">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800">
          {successMessage}
        </h2>
        <p className="text-sm text-gray-600">Redirigiendo...</p>
      </div>
    </div>
  );
}

SuccessModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  successMessage: PropTypes.string,
  redirectTo: PropTypes.string,
  buttonText: PropTypes.string,
};
