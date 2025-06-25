// src/pages/LoginPage.jsx
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { checkBackendStatus } from '@apis/api_EJEMPLO';
import AuthForm from '../components/AuthForm';
import { useTenant } from '../contexts/TenantContext'; // ✅ IMPORTANTE

export default function LoginPage() {
  const navigate = useNavigate();
  const [backendStatus, setBackendStatus] = useState(null);
  const [error, setError] = useState(null);
  const { setUserInfo } = useTenant(); // ✅ USAMOS EL CONTEXTO

  useEffect(() => {
    const fetchBackendStatus = async () => {
      try {
        const status = await checkBackendStatus();
        setBackendStatus(status);
      } catch (err) {
        setError('No se pudo conectar al backend');
      }
    };
    fetchBackendStatus();
  }, []);

  const handleLogin = ({ email, password }) => {
    console.log('Login con:', email, password);

    // HARDCODEADO TEMPORAL mientras no tenga autenticación real
    const mockSession = {
      userId: 1,
      rol: 'admin',
      tenantId: 1,
      assignedSellers: [],
    };

    localStorage.setItem('usuario_id', mockSession.userId.toString());
    localStorage.setItem('userInfo', JSON.stringify(mockSession));
    setUserInfo(mockSession); // ✅ carga el contexto

    navigate('/perfil');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <AuthForm
        title="Iniciar sesión"
        submitButtonText="Iniciar sesión"
        onSubmit={handleLogin}
        showForgotPassword={true}
      />
      <div style={{ marginTop: 16, textAlign: 'center' }}>
        {error && <span style={{ color: 'red', display: 'block' }}>{error}</span>}
        {backendStatus && (
          <span style={{ color: 'green', display: 'block' }}>
            Backend status: {JSON.stringify(backendStatus)}
          </span>
        )}
      </div>
    </div>
  );
}
