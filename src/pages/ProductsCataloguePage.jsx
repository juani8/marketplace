import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllProducts, deleteProduct } from '../apis/productsService';
import ButtonAdd from '../components/ButtonAdd';
import SearchInput from '../components/SearchInput';
import ProductTable from '../components/ProductTable';
import ColumnSelector from '../components/ColumnSelector';
import SuccessModal from '../components/SuccessModal';

export default function ProductsCatalogue() {
  const navigate = useNavigate();

  const [tenant, setTenant] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleColumns, setVisibleColumns] = useState([
    'imagenes',
    'id',
    'nombre',
    'precio',
    'categoria',
    'estado',
    'acciones',
  ]);
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const allColumns = [
    'id',
    'imagenes',
    'nombre',
    'descripcion',
    'precio',
    'stock',
    'categoria',
    'estado',
    'fecha_creacion',
    'fecha_actualizacion',
    'acciones',
  ];

  const columnLabels = {
    id: 'ID',
    imagenes: 'Imagen',
    nombre: 'Nombre',
    descripcion: 'Descripción',
    precio: 'Precio',
    precio_descuento: 'Precio con Descuento',
    stock: 'Stock',
    categoria: 'Categoría',
    estado: 'Estado',
    oferta: '¿En oferta?',
    fecha_creacion: 'Fecha de Creación',
    fecha_actualizacion: 'Fecha de Actualización',
    acciones: 'Acciones',
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await getAllProducts();
        setTenant({
          tenant_id: 1,
          productos: products.map((p) => ({
            id: parseInt(p.producto_id),
            nombre: p.nombre_producto,
            descripcion: p.descripcion,
            precio: p.precio,
            stock: p.cantidad_stock,
            categoria: p.categoria|| null,
            imagenes: p.imagenes || [],
            fecha_creacion: '',
            fecha_actualizacion: '',
          })),
        });
      } catch (err) {
        console.error('Error cargando productos:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = tenant?.productos?.filter((p) =>
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleEdit = (product) => {
    navigate(`/products/edit/${tenant.tenant_id}/${product.id}`);
  };

  const handleDelete = async (producto) => {
    const confirm = window.confirm(`¿Estás seguro que querés eliminar "${producto.nombre}"?`);
    if (!confirm) return;
  
    try {
      await deleteProduct(producto.id);
      setTenant((prev) => ({
        ...prev,
        productos: prev.productos.filter((p) => p.id !== producto.id),
      }));
      setSuccessMessage(`"${producto.nombre}" eliminado correctamente`);
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
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Catálogo de Productos</h1>
        </div>
        <ButtonAdd
          onClick={() => navigate(`/products/create/${tenant.tenant_id}`)}
          text="Añadir Producto"
        />
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
        onDelete={handleDelete}
      />
      <SuccessModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        successMessage={successMessage}
        redirectTo="/products"
      />
    </div>
  );
}
