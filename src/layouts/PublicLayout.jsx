import { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';

export default function PublicLayout() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="bg-dark shadow-md p-4 flex justify-between items-center w-full relative z-50">
        <div className="flex items-center gap-2">
          <span className="text-blue-400 text-2xl">📦</span>
          <h1 className="text-white text-2xl font-bold">deliver.ar</h1>
        </div>

        {/* Botón para mobile */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="sm:hidden text-white text-2xl focus:outline-none"
        >
          ☰
        </button>

        {/* Navegación en desktop */}
        <nav className="hidden sm:flex gap-6 text-sm font-medium text-white items-center">
          <Link to="/" className="hover:text-primary transition-colors">Inicio</Link>
          <Link to="/servicios" className="hover:text-primary transition-colors">Servicios</Link>
          <Link to="/contacto" className="hover:text-primary transition-colors">Contacto</Link>
          <Link
            to="/login"
            className="bg-primary hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors"
          >
            Iniciar Sesión
          </Link>
        </nav>
      </header>

      {/* Menú hamburguesa desplegable para mobile */}
      {menuOpen && (
        <nav className="sm:hidden bg-dark text-white flex flex-col gap-3 px-4 py-3">
          <Link to="/" onClick={() => setMenuOpen(false)} className="hover:text-primary transition-colors">Inicio</Link>
          <Link to="/servicios" onClick={() => setMenuOpen(false)} className="hover:text-primary transition-colors">Servicios</Link>
          <Link to="/contacto" onClick={() => setMenuOpen(false)} className="hover:text-primary transition-colors">Contacto</Link>
          <Link
            to="/login"
            onClick={() => setMenuOpen(false)}
            className="bg-primary hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors"
          >
            Iniciar Sesión
          </Link>
        </nav>
      )}

      {/* Contenido */}
      <main className="flex-grow flex justify-center items-center px-4">
        <Outlet />
      </main>
    </div>
  );
}
