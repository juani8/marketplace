import PropTypes from 'prop-types';
import { useState } from 'react';

export default function ImageModal({ images, onClose, initialIndex = 0 }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const hasMultipleImages = images.length > 1;

  const prevImage = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="relative bg-black rounded shadow-lg w-[90vw] max-w-4xl h-[80vh] flex items-center justify-center overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón de cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-gray-700 text-white rounded-full hover:bg-gray-600 transition-colors"
          aria-label="Cerrar"
        >
          ✕
        </button>

        {/* Flecha izquierda */}
        {hasMultipleImages && (
          <button
            onClick={prevImage}
            className="absolute left-4 text-white hover:text-gray-400 text-7xl"
            aria-label="Anterior"
          >
            ‹
          </button>
        )}

        {/* Imagen */}
        <img
          src={images[currentIndex]}
          alt={`Imagen ${currentIndex + 1}`}
          className="max-h-full max-w-full object-contain"
        />

        {/* Flecha derecha */}
        {hasMultipleImages && (
          <button
            onClick={nextImage}
            className="absolute right-4 text-white hover:text-gray-400 text-7xl"
            aria-label="Siguiente"
          >
            ›
          </button>
        )}

        {/* Contador */}
        {hasMultipleImages && (
          <div className="absolute bottom-4 text-white text-sm bg-gray-800 bg-opacity-70 px-3 py-1 rounded">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>
    </div>
  );
}

ImageModal.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
  onClose: PropTypes.func.isRequired,
  initialIndex: PropTypes.number,
};
