import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllUsers, deleteUser } from '@/apis/usersService';
import Button from '@/components/Button';
import { Pencil, Trash2, UserPlus } from 'lucide-react';
import RegisterUserModal from './RegisterUserPage';
import EditUserModal from './EditUserPage';

export default function EditUserPage() {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);

  const tenant_id = localStorage.getItem('tenant_id');

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const users = await getAllUsers(tenant_id);
        setUsuarios(users);
      } catch (err) {
        console.error(err);
        setError('❌ Error al cargar usuarios');
      }
    };
    fetchUsuarios();
  }, [tenant_id]);

  const handleDelete = async (id) => {
    try {
      await deleteUser(id);
      setUsuarios((prev) => prev.filter((u) => u.id !== id));
      setConfirmDelete(null);
    } catch (err) {
      console.error(err);
      setError('❌ No se pudo eliminar el usuario');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Usuarios Registrados</h1>
        <Button icon={UserPlus} onClick={() => setShowModal(true)}>
          Añadir Usuario
        </Button>
      </div>

      {error && (
        <div className="bg-red-100 text-red-800 border border-red-300 p-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Rol</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Comercios</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {usuarios.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">{user.rol}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.rol === 'operador' && user.comercios?.length > 0
                    ? user.comercios.map((c) => c.nombre).join(', ')
                    : user.rol === 'operador'
                    ? 'Sin asignar'
                    : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex gap-3">
                    <button onClick={() => setEditUser(user)}>
                      <Pencil className="text-blue-600 hover:text-blue-800" />
                    </button>
                    <button onClick={() => setConfirmDelete(user.id)}>
                      <Trash2 className="text-red-600 hover:text-red-800" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg text-center">
            <p className="mb-4">¿Estás seguro de que querés eliminar este usuario?</p>
            <div className="flex justify-center gap-4">
              <Button onClick={() => handleDelete(confirmDelete)}>Sí, eliminar</Button>
              <Button variant="secondary" onClick={() => setConfirmDelete(null)}>
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <RegisterUserModal
          onClose={() => setShowModal(false)}
          onSuccess={(nuevoUsuario) => {
            setUsuarios((prev) => [...prev, nuevoUsuario]);
            setShowModal(false);
          }}
        />
      )}

      {editUser && (
        <EditUserModal
          user={editUser}
          onClose={() => setEditUser(null)}
          onSuccess={(updatedUser) => {
            setUsuarios((prev) =>
              prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
            );
            setEditUser(null);
          }}
        />
      )}
    </div>
  );
}




