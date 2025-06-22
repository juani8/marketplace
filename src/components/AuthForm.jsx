import { useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

export default function AuthForm({
  title = 'Iniciar Sesion',
  onSubmit,
  showForgotPassword = false,
  submitButtonText = 'Iniciar Sesion',
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Por favor completá todos los campos');
      return;
    }

    setError('');
    onSubmit({ email, password });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
    >
      <h2 className="text-2xl font-bold text-blue-600 mb-6 text-center">{title}</h2>

      {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Correo electrónico</label>
        <input
          type="email"
          className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="ejemplo@correo.com"
          required
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">Contraseña</label>
        <input
          type="password"
          className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
        />
      </div>

      {showForgotPassword && (
        <div className="text-left mb-4">
          <Link to="/forgot-password" className="text-green-500 text-sm hover:underline">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
      )}

      <button
        type="submit"
        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold transition"
      >
        {submitButtonText}
      </button>

      {error && (
      <p className="text-red-500 text-sm mt-2 text-center">
      {error}
    </p>
)}

    <div className="mt-4 text-center">
    <span className="text-sm text-gray-600">¿No tenés cuenta? </span>
    <Link
      to="/register"
      className="text-sm text-blue-600 font-semibold hover:underline ml-1"
    >
      Registrarse
    </Link>
    </div>
    </form>
);
}

AuthForm.propTypes = {
  title: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
  showForgotPassword: PropTypes.bool,
  submitButtonText: PropTypes.string,
};

