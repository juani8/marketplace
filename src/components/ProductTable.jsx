import PropTypes from 'prop-types';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useState } from 'react';
import ImageModal from './ImageModal';
import StateBadge from './StateBadge';
import TableActions from './TableActions';

export default function ProductTable({ products, visibleColumns, onEdit, onDelete }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [mobileImageIndexes, setMobileImageIndexes] = useState({});

  const handleImageClick = (images, index) => {
    setSelectedImage({ images, index });
  };
  
  const closeModal = () => setSelectedImage(null);

  const handlePrevMobileImage = (productId, totalImages) => {
    setMobileImageIndexes(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) === 0 ? totalImages - 1 : (prev[productId] || 0) - 1
    }));
  };

  const handleNextMobileImage = (productId, totalImages) => {
    setMobileImageIndexes(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) === totalImages - 1 ? 0 : (prev[productId] || 0) + 1
    }));
  };

  return (
    <div className="overflow-x-auto">
      {/* Modal */}
      {selectedImage && (
        <ImageModal
          images={selectedImage.images}
          initialIndex={selectedImage.index}
          onClose={closeModal}
        />
      )}
      {/* Tabla para desktop */}
      <div className="max-h-[70vh] overflow-auto rounded-md shadow hidden md:block">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr className="text-left">
              {visibleColumns.includes('imagenes') && (<th className="py-3 px-4 sticky top-0 z-10 bg-gray-100">Imagen</th>)}
              {visibleColumns.includes('id') && (<th className="py-3 px-4 sticky top-0 z-10 bg-gray-100">ID</th>)}
              {visibleColumns.includes('nombre') && (<th className="py-3 px-4 sticky top-0 z-10 bg-gray-100">Nombre</th>)}
              {visibleColumns.includes('descripcion') && (<th className="py-3 px-4 sticky top-0 z-10 bg-gray-100">Descripción</th>)}
              {visibleColumns.includes('precio') && (<th className="py-3 px-4 sticky top-0 z-10 bg-gray-100">Precio</th>)}
              {visibleColumns.includes('precio_descuento') && (<th className="py-3 px-4 sticky top-0 z-10 bg-gray-100">Precio con Descuento</th>)}
              {visibleColumns.includes('categoria') && (<th className="py-3 px-4 sticky top-0 z-10 bg-gray-100">Categoría</th>)}
              {visibleColumns.includes('estado') && (<th className="py-3 px-4 sticky top-0 z-10 bg-gray-100">Estado</th>)}
              {visibleColumns.includes('stock') && (<th className="py-3 px-4 sticky top-0 z-10 bg-gray-100">Stock</th>)}
              {visibleColumns.includes('oferta') && (<th className="py-3 px-4 sticky top-0 z-10 bg-gray-100">¿En oferta?</th>)}
              {visibleColumns.includes('destacado') && (<th className="py-3 px-4 sticky top-0 z-10 bg-gray-100">¿Destacado?</th>)}
              {visibleColumns.includes('fecha_creacion') && (<th className="py-3 px-4 sticky top-0 z-10 bg-gray-100">Creación</th>)}
              {visibleColumns.includes('fecha_actualizacion') && (<th className="py-3 px-4 sticky top-0 z-10 bg-gray-100">Actualización</th>)}
              {visibleColumns.includes('acciones') && (<th className="py-3 px-4 sticky top-0 z-10 bg-gray-100">Acciones</th>)}
            </tr>
          </thead>
          <tbody>
            {products.map((producto) => (
              <tr key={producto.id} className="border-t text-sm">
                {visibleColumns.includes('imagenes') && (
                  <td className="py-2 px-4">
                    {producto.imagenes[0] ? (
                      <img
                        src={producto.imagenes[0]}
                        alt={producto.nombre}
                        className="w-16 h-16 object-cover rounded cursor-pointer hover:scale-110 transition-transform"
                        onClick={() => handleImageClick(producto.imagenes, 0)}
                      />
                    ) : (
                      <span className="text-gray-400 text-xs">Sin imagenes</span>
                    )}
                  </td>
                )}
                {visibleColumns.includes('id') && <td className="py-2 px-4">{producto.id}</td>}
                {visibleColumns.includes('nombre') && <td className="py-2 px-4">{producto.nombre}</td>}
                {visibleColumns.includes('descripcion') && (<td className="py-2 px-4">{producto.descripcion}</td>)}
                {visibleColumns.includes('precio') && (<td className="py-2 px-4">${producto.precio.toFixed(2)}</td>)}
                {visibleColumns.includes('precio_descuento') && (
                  <td className="py-2 px-4">
                    {producto.precio_descuento ? `$${producto.precio_descuento.toFixed(2)}` : '—'}
                  </td>
                )}
                {visibleColumns.includes('categoria') && (<td className="py-2 px-4">{producto.categoria}</td>)}
                {visibleColumns.includes('estado') && (
                  <td className="py-2 px-4">
                    <StateBadge estado={producto.stock > 0 ? 'disponible' : 'no_disponible'} tipo="producto" />
                  </td>
                )}
                {visibleColumns.includes('stock') && (<td className="py-2 px-4">{producto.stock}</td>)}
                {visibleColumns.includes('oferta') && (<td className="py-2 px-4">{producto.oferta ? 'Sí' : 'No'}</td>)}
                {visibleColumns.includes('destacado') && (<td className="py-2 px-4">{producto.destacado ? 'Sí' : 'No'}</td>)}
                {visibleColumns.includes('fecha_creacion') && (<td className="py-2 px-4">{producto.fecha_creacion}</td>)}
                {visibleColumns.includes('fecha_actualizacion') && (<td className="py-2 px-4">{producto.fecha_actualizacion}</td>)}
                {visibleColumns.includes('acciones') && (
                  <td className="py-2 px-4">
                    <TableActions
                      onEdit={() => onEdit(producto)}
                      onDelete={() => onDelete(producto)}
                    />
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Vista mobile tipo tarjeta */}
      <div className="md:hidden space-y-4">
        {products.map((producto) => {
          const currentImageIndex = mobileImageIndexes[producto.id] || 0;
          const hasMultipleImages = producto.imagenes.length > 1;

          return (
            <div key={producto.id} className="bg-white rounded-md shadow p-4">
              {visibleColumns.includes('imagenes') && producto.imagenes[0] && (
                <div className="relative w-full mb-3">
                  <img
                    src={producto.imagenes[currentImageIndex]}
                    alt={producto.nombre}
                    className="w-full h-48 object-cover rounded-md shadow-sm"
                  />
                  {hasMultipleImages && (
                    <>
                      <button
                        className="absolute top-1/2 left-2 transform -translate-y-1/2 text-black text-2xl bg-white bg-opacity-70 rounded-full w-8 h-8 flex items-center justify-center"
                        onClick={() => handlePrevMobileImage(producto.id, producto.imagenes.length)}
                        aria-label="Anterior"
                      >
                        ‹
                      </button>
                      <button
                        className="absolute top-1/2 right-2 transform -translate-y-1/2 text-black text-2xl bg-white bg-opacity-70 rounded-full w-8 h-8 flex items-center justify-center"
                        onClick={() => handleNextMobileImage(producto.id, producto.imagenes.length)}
                        aria-label="Siguiente"
                      >
                        ›
                      </button>
                      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
                        {producto.imagenes.map((_, idx) => (
                          <span
                            key={idx}
                            className={`w-2 h-2 rounded-full ${idx === currentImageIndex ? 'bg-black' : 'bg-gray-400'} transition-all`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

              {visibleColumns.includes('nombre') && (
                <div className="mb-2">
                  <span className="font-semibold">Nombre:</span> {producto.nombre}
                </div>
              )}
              {visibleColumns.includes('descripcion') && (
                <div className="mb-2">
                  <span className="font-semibold">Descripción:</span> {producto.descripcion}
                </div>
              )}
              {visibleColumns.includes('precio') && (
                <div className="mb-2">
                  <span className="font-semibold">Precio:</span> ${producto.precio.toFixed(2)}
                </div>
              )}
              {visibleColumns.includes('precio_descuento') && producto.precio_descuento && (
                <div className="mb-2">
                  <span className="font-semibold">Precio con Descuento:</span> ${producto.precio_descuento.toFixed(2)}
                </div>
              )}
              {visibleColumns.includes('categoria') && (
                <div className="mb-2">
                  <span className="font-semibold">Categoría:</span> {producto.categoria}
                </div>
              )}
              {visibleColumns.includes('estado') && (
                <div className="mb-2">
                  <span className="font-semibold">Estado:</span>{' '}
                  <StateBadge estado={producto.stock > 0 ? 'disponible' : 'no_disponible'} tipo="producto" />
                </div>
              )}
              {visibleColumns.includes('stock') && (
                <div className="mb-2">
                  <span className="font-semibold">Stock:</span> {producto.stock}
                </div>
              )}
              {visibleColumns.includes('oferta') && (
                <div className="mb-2">
                  <span className="font-semibold">Oferta:</span> {producto.oferta ? 'Sí' : 'No'}
                </div>
              )}
              {visibleColumns.includes('destacado') && (
                <div className="mb-2">
                  <span className="font-semibold">Destacado:</span> {producto.destacado ? 'Sí' : 'No'}
                </div>
              )}
              {visibleColumns.includes('fecha_creacion') && (
                <div className="mb-2">
                  <span className="font-semibold">Creación:</span> {producto.fecha_creacion}
                </div>
              )}
              {visibleColumns.includes('fecha_actualizacion') && (
                <div className="mb-2">
                  <span className="font-semibold">Actualización:</span> {producto.fecha_actualizacion}
                </div>
              )}
              {visibleColumns.includes('acciones') && (
                <div className="flex justify-end gap-2 mt-2">
                  <TableActions
                    onEdit={() => onEdit(producto)}
                    onDelete={() => onDelete(producto)}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

ProductTable.propTypes = {
  products: PropTypes.array.isRequired,
  visibleColumns: PropTypes.arrayOf(PropTypes.string).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
