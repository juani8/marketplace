import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import AuthForm from '../components/AuthForm';
import { useAuth } from '../contexts/AuthContext';
import { login } from '../apis/authService'; // Endpoint real
import { checkBackendStatus } from '@apis/api_EJEMPLO'; // Opcional

export default function LoginPage() {
  const navigate = useNavigate();
  const { setSessionInfo } = useAuth();

  const [error, setError] = useState('');
  const [backendStatus, setBackendStatus] = useState(null);

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
    try {
      const response = await login(email, password);
      const { user, tokens } = response;
      const { accessToken, refreshToken } = tokens;

      // Guardar tokens por separado
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      // Sesión principal
      const sessionInfo = {
        usuarioId: user.usuario_id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
        tenantId: user.tenant_id,
        assignedSellers: user.assigned_sellers || [],
        accessToken,
        refreshToken
      };

      localStorage.setItem('sessionInfo', JSON.stringify(sessionInfo));
      setSessionInfo(sessionInfo);

      // Redirigir según el rol
      if (user.rol === 'admin') {
        navigate('/sellers');
      } else {
        navigate('/products');
      }

    } catch (err) {
      console.error(err);
      setError('Credenciales incorrectas. Por favor, verificá e intentá de nuevo.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <AuthForm
        title="Iniciar sesión"
        submitButtonText="Iniciar sesión"
        onSubmit={handleLogin}
        showForgotPassword={true}
        error={error}
      />
      {backendStatus && (
        <div className="mt-4 text-center text-green-600">
          Backend status: {JSON.stringify(backendStatus)}
        </div>
      )}
    </div>
  );
}
