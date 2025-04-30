import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';

import ConfirmationModal from '../components/ConfirmationModal';
import SearchInput from '../components/SearchInput';
import TenantsTable from '../components/TenantsTable';

import { getAllTenants, deleteTenant } from '../apis/tenantsService';

export default function TenantsPage() {
  const navigate = useNavigate();

  const [tenants, setTenants] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [tenantToDelete, setTenantToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deletionMessage, setDeletionMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchTenants = async () => {
      setIsLoading(true);
      const tenantsData = await getAllTenants();
      setTenants(tenantsData);
      setIsLoading(false);
    };
    fetchTenants();
  }, []);

  const handleAddTenant = () => {
    navigate('/tenants/create');
  };

  const handleEditTenant = (tenantId) => {
    navigate(`/tenants/edit/${tenantId}`);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const openDeleteModal = (tenant) => {
    setTenantToDelete(tenant);
    setModalOpen(true);
  };

  const closeDeleteModal = () => {
    setTenantToDelete(null);
    setModalOpen(false);
  };

  const confirmDelete = async () => {
    if (tenantToDelete) {
      try {
        await deleteTenant(tenantToDelete.tenant_id);
        const updatedTenants = await getAllTenants();
        setTenants(updatedTenants);
        setDeletionMessage(`¡Comercio "${tenantToDelete.nombre}" eliminado exitosamente!`);
        closeDeleteModal();
        setTimeout(() => setDeletionMessage(''), 3000);
      } catch (error) {
        console.error('Error al eliminar el comercio:', error);
      }
    }
  };

  const filteredTenants = tenants.filter((tenant) =>
    tenant.nombre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Comercios</h1>

        <button
          onClick={handleAddTenant}
          className="flex items-center gap-2 border border-primary text-primary px-4 py-2 rounded-lg hover:bg-primary hover:text-white transition"
        >
          <FaPlus />
          Añadir Comercio
        </button>
      </div>

      {deletionMessage && (
        <div className="bg-green-100 text-green-800 border border-green-400 p-3 rounded mb-6">
          {deletionMessage}
        </div>
      )}

      <SearchInput
        value={searchQuery}
        onChange={handleSearchChange}
        placeholder="Buscar por nombre de comercio..."
      />

      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-600">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <div className="text-lg">Cargando comercios...</div>
          </div>
        ) : (
          <TenantsTable
            tenants={filteredTenants}
            onEdit={handleEditTenant}
            onDelete={openDeleteModal}
          />
        )}
      </div>

      <ConfirmationModal
        isOpen={modalOpen}
        title="Eliminar Comercio"
        message={`¿Estás seguro de eliminar a ${tenantToDelete?.nombre}?`}
        onCancel={closeDeleteModal}
        onConfirm={confirmDelete}
        confirmText="Eliminar"
        cancelText="Cancelar"
      />
    </div>
  );
}
