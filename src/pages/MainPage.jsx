import { useEffect, useState } from 'react';
import { checkBackendStatus } from '@apis/api_EJEMPLO'; // Importa la función para verificar el estado del backend

export default function MainPage() {
  const [backendStatus, setBackendStatus] = useState(null); // Estado para almacenar el estado del backend
  const [error, setError] = useState(null); // Estado para manejar errores

  useEffect(() => {
    const fetchBackendStatus = async () => {
      try {
        const status = await checkBackendStatus();
        setBackendStatus(status); // Guarda el resultado en el estado
      } catch (err) {
        setError('Error al verificar el estado del backend');
        console.error(err);
      }
    };

    fetchBackendStatus();
  }, []);

  return (
    <main className="bg-background text-neutral font-sans">
      {/* Header */}
      <header className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary">Marketplace</h1>
        <nav>
          <ul className="flex gap-4 text-sm font-medium">
            <li className="hover:text-primary cursor-pointer">Inicio</li>
            <li className="hover:text-primary cursor-pointer">Servicios</li>
            <li className="hover:text-primary cursor-pointer">Contacto</li>
          </ul>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-4 py-20">
        <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
          Bienvenido a Marketplace
        </h2>
        <p className="text-lg md:text-xl mb-8 max-w-xl">
          Esta aplicación está construida con React + Vite + Tailwind, y usa una paleta de colores personalizada y fuente Poppins.
        </p>
        <p className="text-lg md:text-xl mb-8 max-w-xl">
          {/* Renderiza el estado del backend */}
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
      </section>
    </main>
  );
}