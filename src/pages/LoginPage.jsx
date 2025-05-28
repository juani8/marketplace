import AuthForm from '../components/AuthForm';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = ({ email, password }) => {
    console.log('Login con:', email, password);

    // validar credenciales y redirigir
    navigate('/perfil');
  };

  return (
    <AuthForm
      title="Iniciar sesión"
      submitButtonText="Iniciar sesión"
      onSubmit={handleLogin}
      showForgotPassword={true}
    />
  );
}
