import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

// Mock para fallback
const mockTenants = [
  {
    tenant_id: 1,
    nombre: "Panadería La Moderna",
    razon_social: "La Moderna S.A.",
    estado: "activo"
  },
  {
    tenant_id: 2,
    nombre: "Verdulería El Tano",
    razon_social: "Verduras del Oeste SRL",
    estado: "inactivo"
  }
];

export const getAllTenants = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/tenants`);
    return response.data;
  } catch (error) {
    console.warn('⚠️ Error al obtener tenants del backend, usando mock:', error.message);
    return mockTenants;
  }
};
