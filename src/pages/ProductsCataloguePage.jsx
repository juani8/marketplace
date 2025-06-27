import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllProductsByTenant, deleteProduct } from '../apis/productsService';
import ButtonAdd from '../components/ButtonAdd';
import SearchInput from '../components/SearchInput';
import ProductTable from '../components/ProductTable';
import ColumnSelector from '../components/ColumnSelector';
import SuccessModal from '../components/SuccessModal';
import ConfirmModal from '../components/ConfirmModal';
import UploadCSVModal from '../components/UploadCSVModal';
import { useAuth } from '../contexts/AuthContext';

export default function ProductsCataloguePage() {
  const navigate = useNavigate();
  const { tenantId, rol } = useAuth();

  const [productos, setProductos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleColumns, setVisibleColumns] = useState(() => {
    const base = ['imagenes', 'id', 'nombre', 'precio', 'categoria'];
    return rol === 'admin' ? [...base, 'acciones'] : base;
  });
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);


  const baseColumns = [
    'id',
    'imagenes',
    'nombre',
    'descripcion',
    'precio',
    'categoria',
    // 'acciones' la agregamos condicionalmente más abajo
  ];
  const allColumns = rol === 'admin' ? [...baseColumns, 'acciones'] : baseColumns;

  const fullLabels = {
    id: 'ID',
    imagenes: 'Imagen',
    nombre: 'Nombre',
    descripcion: 'Descripción',
    precio: 'Precio',
    precio_descuento: 'Precio con Descuento',
    categoria: 'Categoría',
    oferta: '¿En oferta?',
    acciones: 'Acciones',
  };
  const columnLabels = rol === 'admin'
    ? fullLabels
    : Object.fromEntries(Object.entries(fullLabels).filter(([key]) => key !== 'acciones'));

  useEffect(() => {
    const fetchProducts = async () => {
      if (!tenantId) return;

      try {
        const response = await getAllProductsByTenant(tenantId);
        console.log('Respuesta del backend:', response);
        const productosFormateados = response.map((p) => ({
          id: parseInt(p.producto_id),
          nombre: p.nombre_producto,
          descripcion: p.descripcion,
          precio: parseFloat(p.precio),
          categoria: typeof p.categoria === 'object' ? p.categoria?.nombre : p.categoria || '-',
          imagenes: p.imagenes || [],
        }));
        setProductos(productosFormateados);
        console.log('🧪 Productos formateados con categoría:', productosFormateados);

      } catch (err) {
        console.error('Error cargando productos:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [tenantId]);

  const filteredProducts = productos.filter((p) =>
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (product) => {
    navigate(`/products/edit/${product.id}`);
  };

  const confirmDelete = (producto) => {
    setProductToDelete(producto);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    setConfirmOpen(false);
    try {
      await deleteProduct(productToDelete.id);
      setProductos((prev) => prev.filter((p) => p.id !== productToDelete.id));
      setSuccessMessage(`"${productToDelete.nombre}" eliminado correctamente`);
      setShowModal(true);
    } catch (err) {
      console.error('Error al eliminar producto:', err);
      alert('❌ No se pudo eliminar el producto');
    }
  };


  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex flex-col items-center text-gray-600">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <div className="text-lg">Cargando productos...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0 mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Catálogo de Productos</h1>
        {rol === 'admin' && (
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <ButtonAdd
              onClick={() => navigate(`/products/create`)}
              text="Añadir Producto"
            />
            <ButtonAdd
              onClick={() => setShowUploadModal(true)}
              text="Cargar por CSV"
            />
            <ButtonAdd
              onClick={() => navigate(`/categories/create`)}
              text="Crear Categoría"
            />
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-4 items-center mb-4">
        <SearchInput
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar productos..."
        />
        <div className="relative">
          <button
            className="h-[42px] px-4 bg-white border rounded shadow flex items-center gap-2 text-sm"
            onClick={() => setShowColumnSelector((prev) => !prev)}
          >
            <span className="text-lg">⚙️</span> Opciones de columnas
          </button>

          {showColumnSelector && (
            <div className="absolute z-50 mt-2">
              <ColumnSelector
                allColumns={allColumns}
                visibleColumns={visibleColumns}
                onChange={setVisibleColumns}
                labelMap={columnLabels}
              />
            </div>
          )}
        </div>
      </div>

      <ProductTable
        products={filteredProducts}
        visibleColumns={visibleColumns}
        onEdit={handleEdit}
        onDelete={confirmDelete}
        selectable={rol === 'admin'}
        rol={rol}
      />

      {showUploadModal && (
        <UploadCSVModal
          onClose={() => setShowUploadModal(false)}
          onSuccess={(data) => {
            const nuevos = data?.data?.productos_creados?.map(p => p.producto);
            if (nuevos?.length > 0) {
              setProductos(prev => [...prev, ...nuevos.map(p => ({
                id: parseInt(p.producto_id),
                nombre: p.nombre_producto,
                descripcion: p.descripcion,
                precio: parseFloat(p.precio),
                categoria: p.categoria?.nombre || '-',
                imagenes: p.imagenes || [],
              }))]);
              setSuccessMessage(`${nuevos.length} producto(s) agregados exitosamente`);
              setShowModal(true);
            }
          }}
        />
      )}

      <SuccessModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        successMessage={successMessage}
        redirectTo={`/products`}
      />
      <ConfirmModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        message={`¿Estás seguro de que querés eliminar "${productToDelete?.nombre}"?`}
      />

    </div>
  );
}
