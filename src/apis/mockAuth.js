export const registerTenantMock = async (formData) => {
  console.log('Mock tenant creado con:', formData);

  return {
    token: 'mock-token-tenant',
    user: {
      id: 'mock-user-id',
      email: formData.email,
      rol: 'admin',
      tenantId: 'mock-tenant-id',
    },
  };
};