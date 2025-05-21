import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import mockTenants from '../mocks/mockTenants';
import ButtonAdd from '../components/ButtonAdd';
import SearchInput from '../components/SearchInput';
import ProductTable from '../components/ProductTable';
import ColumnSelector from '../components/ColumnSelector';

export default function ProductsCatalogue() {
  const { tenantId } = useParams();
  const navigate = useNavigate();

  const [tenant, setTenant] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleColumns, setVisibleColumns] = useState([
    'imagenes',
    'id',
    'nombre',
    'precio',
    'precio_descuento',
    'categoria',
    'estado',
    'acciones',
  ]);
  const [showColumnSelector, setShowColumnSelector] = useState(false);

  const allColumns = [
    'id',
    'imagenes',
    'nombre',
    'descripcion',
    'precio',
    'precio_descuento',
    'stock',
    'categoria',
    'estado',
    'oferta',
    'destacado',
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
    destacado: '¿Destacado?',
    fecha_creacion: 'Fecha de Creación',
    fecha_actualizacion: 'Fecha de Actualización',
    acciones: 'Acciones',
  };
  
  useEffect(() => {
    const selected = mockTenants.find((t) => t.tenant_id === Number(tenantId));
    if (!selected) return navigate('/products/select-tenant');
    setTenant(selected);
  }, [tenantId, navigate]);

  const filteredProducts = tenant?.productos?.filter((p) =>
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleEdit = (product) => {
    navigate(`/products/edit/${tenant.tenant_id}/${product.id}`);
  };

  const handleDelete = (product) => {
    console.log('Eliminar', product);
  };

  const handleChangeTenant = () => navigate('/products/select-tenant');

  if (!tenant) return null;

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0 mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Catálogo de Productos</h1>
          <p className="text-sm text-gray-600">
            Comercio: <strong>{tenant.nombre}</strong> | ID: {tenant.tenant_id}
            <button
              onClick={handleChangeTenant}
              className="text-blue-600 text-sm ml-2 underline"
            >
              Cambiar
            </button>
          </p>
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
    </div>
  );
}
