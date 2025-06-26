// src/contexts/TenantContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const TenantContext = createContext();

export function TenantProvider({ children }) {
  // Cargar datos de usuario desde localStorage
  const storedUserInfo = localStorage.getItem('userInfo');
  const initialUserInfo = storedUserInfo
    ? JSON.parse(storedUserInfo)
    : {
        userId: null,
        rol: null,
        tenantId: null,
        assignedSellers: [],
      };

  const [userId, setUserId] = useState(initialUserInfo.userId);
  const [rol, setRol] = useState(initialUserInfo.rol);
  const [tenantId, setTenantId] = useState(initialUserInfo.tenantId);
  const [assignedSellers, setAssignedSellers] = useState(initialUserInfo.assignedSellers || []);

  // Persistir automáticamente cuando cambia cualquier dato de sesión
  useEffect(() => {
    const userInfo = { userId, rol, tenantId, assignedSellers };
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
  }, [userId, rol, tenantId, assignedSellers]);

  // Setter para sesión
  const setUserInfo = ({ userId, rol, tenantId, assignedSellers }) => {
    setUserId(userId);
    setRol(rol);
    setTenantId(tenantId);
    setAssignedSellers(assignedSellers || []);
  };

  // (opcional) Limpiar sesión completa
  const logout = () => {
    localStorage.removeItem('userInfo');
    setUserId(null);
    setRol(null);
    setTenantId(null);
    setAssignedSellers([]);
  };

  return (
    <TenantContext.Provider
      value={{
        userId,
        rol,
        tenantId,
        assignedSellers,
        setUserInfo,
        logout,
      }}
    >
      {children}
    </TenantContext.Provider>
  );
}

export const useTenant = () => useContext(TenantContext);
