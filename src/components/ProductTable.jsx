import PropTypes from 'prop-types';
import { useState } from 'react';
import ImageModal from './ImageModal';
import TableActions from './TableActions';
import { useAuth } from '../contexts/AuthContext';

export default function ProductTable({
  products,
  visibleColumns = [],
  onEdit,
  onDelete,
}) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [mobileImageIndexes, setMobileImageIndexes] = useState({});
  const columns = visibleColumns || [];
  const { rol } = useAuth();

  const handleImageClick = (images, index) => {
    setSelectedImage({ images, index });
  };

  const closeModal = () => setSelectedImage(null);

  const handlePrevMobileImage = (productId, totalImages) => {
    setMobileImageIndexes((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) === 0 ? totalImages - 1 : (prev[productId] || 0) - 1,
    }));
  };

  const handleNextMobileImage = (productId, totalImages) => {
    setMobileImageIndexes((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) === totalImages - 1 ? 0 : (prev[productId] || 0) + 1,
    }));
  };

  if (!Array.isArray(products) || products.length === 0) {
    return (
      <div className="text-center text-gray-600 py-20 text-lg">
        No hay productos disponibles.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      {selectedImage && (
        <ImageModal images={selectedImage.images} initialIndex={selectedImage.index} onClose={closeModal} />
      )}

      {/* Tabla para desktop */}
      <div className="max-h-[90vh] overflow-auto rounded-md shadow hidden md:block">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr className="text-left">
              {columns.includes('id') && <th className="py-3 px-4 sticky top-0 z-10 bg-gray-100">ID</th>}
              {columns.includes('imagenes') && <th className="py-3 px-4 sticky top-0 z-10 bg-gray-100">Imagen</th>}
              {columns.includes('nombre') && <th className="py-3 px-4 sticky top-0 z-10 bg-gray-100">Nombre</th>}
              {columns.includes('descripcion') && <th className="py-3 px-4 sticky top-0 z-10 bg-gray-100">Descripción</th>}
              {columns.includes('precio') && <th className="py-3 px-4 sticky top-0 z-10 bg-gray-100">Precio</th>}
              {columns.includes('precio_descuento') && <th className="py-3 px-4 sticky top-0 z-10 bg-gray-100">Precio con Descuento</th>}
              {columns.includes('categoria') && <th className="py-3 px-4 sticky top-0 z-10 bg-gray-100">Categoría</th>}
              {columns.includes('oferta') && <th className="py-3 px-4 sticky top-0 z-10 bg-gray-100">¿En oferta?</th>}
              {columns.includes('fecha_creacion') && <th className="py-3 px-4 sticky top-0 z-10 bg-gray-100">Fecha de Creación</th>}
              {columns.includes('acciones') && rol === 'admin' && (<th className="py-3 px-4 sticky top-0 z-10 bg-gray-100">Acciones</th>)}
            </tr>
          </thead>
          <tbody>
            {products.map((producto) => (
              <tr key={producto.id} className="border-t text-sm">
                {columns.includes('id') && <td className="py-2 px-4">{producto.id}</td>}
                {columns.includes('imagenes') && (
                  <td className="py-2 px-4">
                    {producto.imagenes?.[0] ? (
                      <img
                        src={producto.imagenes[0]}
                        alt={producto.nombre}
                        className="w-16 h-16 object-cover rounded cursor-pointer hover:scale-110 transition-transform"
                        onClick={() => handleImageClick(producto.imagenes, 0)}
                      />
                    ) : (
                      <span className="text-gray-400 text-xs">Sin imágenes</span>
                    )}
                  </td>
                )}
                {columns.includes('nombre') && <td className="py-2 px-4">{producto.nombre}</td>}
                {columns.includes('descripcion') && <td className="py-2 px-4">{producto.descripcion}</td>}
                {columns.includes('precio') && <td className="py-2 px-4">${producto.precio.toFixed(2)}</td>}
                {columns.includes('precio_descuento') && (
                  <td className="py-2 px-4">
                    {producto.precio_descuento ? `$${producto.precio_descuento.toFixed(2)}` : '—'}
                  </td>
                )}
                {columns.includes('categoria') && (
                  <td className="py-2 px-4">
                    {producto.categoria?.trim() ? producto.categoria : <span className="text-gray-400 italic">Sin categoría</span>}
                  </td>
                )}
                {columns.includes('oferta') && (
                  <td className="py-2 px-4">{producto.oferta ? 'Sí' : 'No'}</td>
                )}
                {columns.includes('fecha_creacion') && (
                  <td className="py-2 px-4">{producto.fecha_creacion}</td>
                )}
                {columns.includes('acciones') && rol === 'admin' && (
                  <td className="py-2 px-4">
                    <TableActions onEdit={() => onEdit(producto)} onDelete={() => onDelete(producto)} />
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cards para mobile */}
      <div className="block md:hidden space-y-4">
        {products.map((producto) => (
          <div key={producto.id} className="border rounded-lg p-4 shadow">
            {columns.includes('imagenes') && producto.imagenes?.[0] && (
              <img
                src={producto.imagenes[0]}
                alt={producto.nombre}
                className="w-full h-48 object-cover rounded mb-2"
                onClick={() => handleImageClick(producto.imagenes, 0)}
              />
            )}
            <div className="space-y-1 text-sm">
              {columns.includes('nombre') && <div><strong>Nombre:</strong> {producto.nombre}</div>}
              {columns.includes('descripcion') && <div><strong>Descripción:</strong> {producto.descripcion}</div>}
              {columns.includes('precio') && <div><strong>Precio:</strong> ${producto.precio.toFixed(2)}</div>}
              {columns.includes('precio_descuento') && (
                <div><strong>Precio c/Descuento:</strong> {producto.precio_descuento ? `$${producto.precio_descuento.toFixed(2)}` : '—'}</div>
              )}
              {columns.includes('categoria') && (
                <div><strong>Categoría:</strong> {producto.categoria?.trim() ? producto.categoria : 'Sin categoría'}</div>
              )}
              {columns.includes('oferta') && (
                <div><strong>¿En oferta?</strong> {producto.oferta ? 'Sí' : 'No'}</div>
              )}
              {columns.includes('fecha_creacion') && (
                <div><strong>Creado:</strong> {producto.fecha_creacion}</div>
              )}
            </div>
            {columns.includes('acciones') && rol === 'admin' && (
              <div className="mt-1 flex justify-end">
                <TableActions onEdit={() => onEdit(producto)} onDelete={() => onDelete(producto)} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

ProductTable.propTypes = {
  products: PropTypes.array.isRequired,
  visibleColumns: PropTypes.arrayOf(PropTypes.string).isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};

ProductTable.defaultProps = {
  onEdit: () => {},
  onDelete: () => {},
};
