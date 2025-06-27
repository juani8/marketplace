import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // ✅ Leer sesión desde localStorage
  const storedSessionInfo = localStorage.getItem('sessionInfo');
  const storedAccessToken = localStorage.getItem('accessToken');
  const storedRefreshToken = localStorage.getItem('refreshToken');

  const initialSession = storedSessionInfo
    ? JSON.parse(storedSessionInfo)
    : {
        usuarioId: null,
        nombre: '',
        email: '',
        rol: null,
        tenantId: null,
        assignedSellers: [],
      };

  const [usuarioId, setUsuarioId] = useState(initialSession.usuarioId);
  const [nombre, setNombre] = useState(initialSession.nombre);
  const [email, setEmail] = useState(initialSession.email);
  const [rol, setRol] = useState(initialSession.rol);
  const [tenantId, setTenantId] = useState(initialSession.tenantId);
  const [assignedSellers, setAssignedSellers] = useState(initialSession.assignedSellers || []);
  const [accessToken, setAccessToken] = useState(storedAccessToken || null);
  const [refreshToken, setRefreshToken] = useState(storedRefreshToken || null);

  // ✅ Guardar en localStorage cuando cambia algo
  useEffect(() => {
    const sessionInfo = {
      usuarioId,
      nombre,
      email,
      rol,
      tenantId,
      assignedSellers
    };
    localStorage.setItem('sessionInfo', JSON.stringify(sessionInfo));
    if (accessToken) localStorage.setItem('accessToken', accessToken);
    if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
  }, [usuarioId, nombre, email, rol, tenantId, assignedSellers, accessToken, refreshToken]);

  // ✅ Setter global de sesión
  const setSessionInfo = ({
    usuarioId,
    nombre,
    email,
    rol,
    tenantId,
    assignedSellers,
    accessToken,
    refreshToken
  }) => {
    if (usuarioId !== undefined) setUsuarioId(usuarioId);
    if (nombre !== undefined) setNombre(nombre);
    if (email !== undefined) setEmail(email);
    if (rol !== undefined) setRol(rol);
    if (tenantId !== undefined) setTenantId(tenantId);
    if (assignedSellers !== undefined) setAssignedSellers(assignedSellers || []);
    if (accessToken) setAccessToken(accessToken);
    if (refreshToken) setRefreshToken(refreshToken);
  };

  // ✅ Logout
  const logout = () => {
    localStorage.clear();
    setUsuarioId(null);
    setNombre('');
    setEmail('');
    setRol(null);
    setTenantId(null);
    setAssignedSellers([]);
    setAccessToken(null);
    setRefreshToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        usuarioId,
        nombre,
        email,
        rol,
        tenantId,
        assignedSellers,
        accessToken,
        refreshToken,
        setSessionInfo,
        setAccessToken,
        setRefreshToken,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
export { AuthContext };
