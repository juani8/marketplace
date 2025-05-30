import AuthForm from '../components/AuthForm';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { checkBackendStatus } from '@apis/api_EJEMPLO';

export default function LoginPage() {
  const navigate = useNavigate();
  const [backendStatus, setBackendStatus] = useState(null);
  const [error, setError] = useState(null);

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

    // validar credenciales y redirigir
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
        {backendStatus && <span style={{ color: 'green', display: 'block' }}>Backend status: {backendStatus}</span>}
      </div>
    </div>
  );
}