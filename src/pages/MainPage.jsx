import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { checkBackendStatus } from '@apis/api_EJEMPLO';

export default function MainPage() {
  const [backendStatus, setBackendStatus] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBackendStatus = async () => {
      try {
        const status = await checkBackendStatus();
        setBackendStatus(status);
      } catch (err) {
        setError('Error al verificar el estado del backend');
        console.error(err);
      }
    };

    fetchBackendStatus();
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-md p-4 flex justify-between items-center w-full">
        <h1 className="text-2xl font-bold text-primary">Marketplace</h1>
        <nav>
          <ul className="flex gap-4 text-sm font-medium">
            <li className="hover:text-primary cursor-pointer">Inicio</li>
            <li className="hover:text-primary cursor-pointer">Servicios</li>
            <li className="hover:text-primary cursor-pointer">Contacto</li>
            <li>
              <Link
                to="/login"
                className="text-primary hover:text-secondary transition-colors"
              >
                Iniciar sesión
              </Link>
            </li>
          </ul>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-4 py-20 flex-grow">
        <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
          Bienvenido a Marketplace
        </h2>
        <p className="text-lg md:text-xl mb-8 max-w-xl">
          Esta aplicación está construida con React + Vite + Tailwind, y usa una paleta de colores personalizada y fuente Poppins.
        </p>
        <p className="text-lg md:text-xl mb-8 max-w-xl">
          {backendStatus ? (
            <span>{backendStatus.status} - {backendStatus.timestamp}</span>
          ) : error ? (
            <span className="text-red-500">{error}</span>
          ) : (
            <span>Cargando estado del backend...</span>
          )}
        </p>

        <button className="bg-secondary hover:bg-primary text-white font-semibold py-3 px-6 rounded-lg transition-all">
          Empezar ahora
        </button>

        <Link
          to="/tenants/create"
          className="mt-6 inline-block bg-primary text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition"
        >
          Crear nuevo Comercio
        </Link>
        <Link
          to="/tenants/delete"
          className="mt-4 inline-block bg-red-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-red-700 transition"
        >
          Eliminar un Comercio
</Link>
      </section>
    </div>
  );
}
