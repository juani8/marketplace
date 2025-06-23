import api from './api_config'; 

// Crear usuario interno (admin u operador)
export const createUser = async (userData) => {
  const response = await api.post('/auth/register-internal', userData);
  return response.data;
};

// Editar usuario (email, password, rol, comercios)
export const updateUser = async (userId, userData) => {
  const response = await api.patch(`/auth/${userId}`, userData);
  return response.data;
};

// Eliminar usuario
export const deleteUser = async (userId) => {
  const response = await api.delete(`/auth/${userId}`);
  return response.data;
};

// Obtener todos los usuarios de un tenant
export const getAllUsers = async () => {
  const tenantId = localStorage.getItem('tenant_id');
  if (!tenantId) throw new Error('No se encontró tenant_id');

  const response = await api.get(`/auth/users?tenant_id=${tenantId}`);
  return response.data;
};

// Obtener comercios disponibles para un usuario (usado al asignar a un operador)
export const getAllCommerces = async () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const usuario_id = user?.userId;
  if (!usuario_id) throw new Error('No se encontró userId en localStorage');

  const response = await api.post('/sellers', { usuario_id });
  return response.data;
};


/* 

MOCK

let mockUsers = [
  {
    id: 1,
    email: 'admin@deliver.ar',
    rol: 'admin',
    comercios: [],
  },
  {
    id: 2,
    email: 'operador@pizza.com',
    rol: 'operador',
    comercios: ['Pizza Nova', 'Café Central'],
  }
];

export const getUsersMock = () => Promise.resolve([...mockUsers]);

export const createUserMock = (newUser) => {
  const id = Date.now().toString();
  const user = { ...newUser, id };
  mockUsers.push(user);
  return Promise.resolve(user);
};

export const updateUserMock = (updatedUser) => {
  mockUsers = mockUsers.map((u) => (u.id === updatedUser.id ? updatedUser : u));
  return Promise.resolve(updatedUser);
};

export const deleteUserMock = (id) => {
  mockUsers = mockUsers.filter((u) => u.id !== id);
  return Promise.resolve({ success: true });
};


export async function getAllCommerces() {
  return [
    { id: '1', nombre: 'Pizza Loca', direccion: 'Calle 123' },
    { id: '2', nombre: 'Burger Place', direccion: 'Av. Siempreviva 742' },
  ];
}

export async function updateUser(id, data) {
  console.log('Mock updateUser:', id, data);
  return {
    id,
    email: data.email,
    rol: data.rol,
    comercios: data.comercioIds?.map((id) => ({
      id,
      nombre: `Comercio ${id}`,
      direccion: `Dirección ${id}`
    })) || []
  };
}

*/
