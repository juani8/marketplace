// src/pages/LoginPage.jsx
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import AuthForm from '../components/AuthForm';
import { useTenant } from '../contexts/TenantContext';
// import { login } from '../apis/authService'; // login real si lo activan luego
import { checkBackendStatus } from '@apis/api_EJEMPLO'; // opcional si lo querés dejar

export default function LoginPage() {
  const navigate = useNavigate();
  const { setUserInfo } = useTenant();

  const [error, setError] = useState('');
  const [backendStatus, setBackendStatus] = useState(null); // opcional si querés el ping al backend

  useEffect(() => {
    const fetchBackendStatus = async () => {
      try {
        const status = await checkBackendStatus();
        setBackendStatus(status);
      } catch {
        setBackendStatus(null);
      }
    };
    fetchBackendStatus();
  }, []);

  const handleLogin = async ({ email, password }) => {
    setError('');
    console.log('👉 Se ejecutó handleLogin con:', email, password);

    try {
      // 🔁 LOGIN MOCKEADO COMBINADO
      const isAdmin = email.includes('admin');
      const mockSession = {
        userId: 1,
        rol: isAdmin ? 'admin' : 'operador',
        tenantId: 1,
        assignedSellers: [],
        email,
      };
      const token = 'mock-token-123';

      // Si usaran login real:
      // const { token, user } = await login(email, password);

      // Guardar en localStorage y contexto
      localStorage.setItem('token', token);
      localStorage.setItem('usuario_id', mockSession.userId.toString());
      localStorage.setItem('userInfo', JSON.stringify(mockSession));
      setUserInfo(mockSession);

      // Redirección por rol
      if (mockSession.rol === 'admin') {
        navigate('/crear-tenant');
      } else {
        navigate('/perfil');
      }

    } catch (err) {
      console.error(err);
      setError('Credenciales incorrectas. Por favor, verificá e intentá de nuevo.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <AuthForm
        title="Iniciar sesión"
        submitButtonText="Iniciar sesión"
        onSubmit={handleLogin}
        showForgotPassword={true}
        error={error}
      />
      {backendStatus && (
        <div style={{ marginTop: 16, textAlign: 'center', color: 'green' }}>
          Backend status: {JSON.stringify(backendStatus)}
        </div>
      )}
    </div>
  );
}
