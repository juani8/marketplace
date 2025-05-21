import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

export default function SuccessModal({ isOpen, onClose, successMessage = "¡Operación exitosa!", redirectTo = "/", buttonText = "Volver a Portal de Comercios" }) {
  const navigate = useNavigate();

  if (!isOpen) return null; // Si no está abierto, no renderiza nada

  const handleRedirect = () => {
    onClose(); // Cerramos el modal
    navigate(redirectTo); // Redirigimos a la página que nos indiquen
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg text-center w-11/12 max-w-md">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800">
          {successMessage}
        </h2>
        
        <button
          onClick={handleRedirect}
          className="bg-primary hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition mt-4"
        >
          {buttonText}
        </button>
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
}