import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
// import { login } from '../apis/authService'; // login real

export default function LoginPage() {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleLogin = async ({ email, password }) => {
    console.log('👉 Se ejecutó handleLogin con:', email, password);
    setError('');

    try {
      // 🔁 LOGIN MOCKEADO
      const isAdmin = email.includes('admin');
      const user = {
        id: 'mock-user-id',
        email,
        rol: isAdmin ? 'admin' : 'operador',
        tenantId: 'mock-tenant-id',
      };

      const token = 'mock-token-123';

      // LOGIN REAL
      /*
      const { token, user } = await login(email, password);
      */

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      console.log('Login exitoso:', user);

      // 🔁 Redirección basada en el rol
      if (user.rol === 'admin') {
        navigate('/crear-tenant'); // crear tenant si sos admin
      } else {
        navigate('/perfil'); // tenant asignado del operador
      }

    } catch (err) {
      console.error(err);
      setError('Credenciales incorrectas. Por favor, verificá e intentá de nuevo.');
    }
  };

  return (
    <AuthForm
      title="Iniciar sesión"
      submitButtonText="Iniciar sesión"
      onSubmit={handleLogin}
      showForgotPassword={true}
      error={error}
    />
  );
}

