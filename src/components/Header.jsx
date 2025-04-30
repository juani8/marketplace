import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="bg-dark shadow-md p-4 flex flex-wrap justify-between items-center w-full">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-2 sm:mb-0">
        <span className="text-blue-400 text-2xl">📦</span>
        <h1 className="text-white text-2xl font-bold">deliver.ar</h1>
      </div>

      {/* Navegación */}
      <nav className="w-full sm:w-auto">
        <ul className="flex flex-col sm:flex-row gap-2 sm:gap-6 text-sm font-medium text-white items-start sm:items-center">
          <li className="hover:text-primary transition-colors">
            <Link to="/">Inicio</Link>
          </li>
          <li className="hover:text-primary transition-colors">
            <Link to="/servicios">Servicios</Link>
          </li>
          <li className="hover:text-primary transition-colors">
            <Link to="/contacto">Contacto</Link>
          </li>
          <li>
            <Link
              to="/login"
              className="bg-primary hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors"
            >
              Iniciar Sesión
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
