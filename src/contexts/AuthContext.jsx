import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
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
        comercios: [],
      };

  const [usuarioId, setUsuarioId] = useState(initialSession.usuarioId);
  const [nombre, setNombre] = useState(initialSession.nombre);
  const [email, setEmail] = useState(initialSession.email);
  const [rol, setRol] = useState(initialSession.rol);
  const [tenantId, setTenantId] = useState(initialSession.tenantId);
  const [comercios, setComercios] = useState(initialSession.comercios || []);
  const [accessToken, setAccessToken] = useState(storedAccessToken || null);
  const [refreshToken, setRefreshToken] = useState(storedRefreshToken || null);

  useEffect(() => {
    const sessionInfo = {
      usuarioId,
      nombre,
      email,
      rol,
      tenantId,
      comercios
    };
    localStorage.setItem('sessionInfo', JSON.stringify(sessionInfo));
    if (accessToken) localStorage.setItem('accessToken', accessToken);
    if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
  }, [usuarioId, nombre, email, rol, tenantId, comercios, accessToken, refreshToken]);

  const setSessionInfo = ({
    usuarioId,
    nombre,
    email,
    rol,
    tenantId,
    comercios,
    accessToken,
    refreshToken
  }) => {
    if (usuarioId !== undefined) setUsuarioId(usuarioId);
    if (nombre !== undefined) setNombre(nombre);
    if (email !== undefined) setEmail(email);
    if (rol !== undefined) setRol(rol);
    if (tenantId !== undefined) setTenantId(tenantId);
    if (comercios !== undefined) setComercios(comercios || []);
    if (accessToken) {
      setAccessToken(accessToken);
      try {
        console.log('🧾 Token decodificado:', JSON.parse(atob(accessToken.split('.')[1])));
      } catch (err) {
        console.error('❌ Error al decodificar el token:', err);
      }
    }
    if (refreshToken) setRefreshToken(refreshToken);
  };

  const logout = () => {
    localStorage.clear();
    setUsuarioId(null);
    setNombre('');
    setEmail('');
    setRol(null);
    setTenantId(null);
    setComercios([]);
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
        comercios,
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
