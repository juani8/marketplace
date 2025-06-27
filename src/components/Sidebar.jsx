import { Link, useLocation } from 'react-router-dom';
import {
  FaStore,
  FaBoxOpen,
  FaTags,
  FaCog,
  FaSignOutAlt,
  FaTachometerAlt,
  FaUserPlus,
  FaWarehouse,
} from 'react-icons/fa';
import PropTypes from 'prop-types';
import { useAuth } from '../contexts/AuthContext';

export default function Sidebar({ isCollapsed, toggleSidebar, onLogoutClick }) {
  const location = useLocation();
  const { rol } = useAuth();
  const isActive = (path) => location.pathname.startsWith(path);
  const isAdmin = rol === 'admin';
  const isOperator = rol === 'operador';

  return (
    <aside
      className={`bg-dark text-white ${
        isCollapsed ? 'w-20' : 'w-64'
      } h-screen fixed top-0 left-0 z-40 flex flex-col transition-all duration-300`}
    >
      {/* Logo */}
      <div
        onClick={toggleSidebar}
        className="py-4 px-3 flex items-center gap-2 cursor-pointer"
      >
        <span className="text-blue-400 text-3xl">📦</span>
        {!isCollapsed && (
          <span className="text-white font-bold text-xl">deliver.ar</span>
        )}
      </div>

      {/* Navegación */}
      <nav className="flex-1 flex flex-col gap-2 px-2">

        {isAdmin && (
          <Link to="/dashboard" className={`flex items-center gap-3 px-2 py-2 rounded hover:bg-blue-600 ${isActive('/dashboard') ? 'bg-blue-700' : ''}`}>
            <FaTachometerAlt className="text-xl" />
            {!isCollapsed && <span>Órdenes</span>}
          </Link>
        )}

        <Link to="/sellers" className={`flex items-center gap-3 px-2 py-2 rounded hover:bg-blue-600 ${isActive('/sellers') ? 'bg-blue-700' : ''}`}>
          <FaStore className="text-xl" />
          {!isCollapsed && <span>Mis comercios</span>}
        </Link>

        <Link to="/products" className={`flex items-center gap-3 px-2 py-2 rounded hover:bg-blue-600 ${isActive('/products') ? 'bg-blue-700' : ''}`}>
          <FaBoxOpen className="text-xl" />
          {!isCollapsed && <span>Catálogo de Productos</span>}
        </Link>

        {isOperator && (
          <Link to="/stock" className={`flex items-center gap-3 px-2 py-2 rounded hover:bg-blue-600 ${isActive('/stock') ? 'bg-blue-700' : ''}`}>
            <FaWarehouse className="text-xl" />
            {!isCollapsed && <span>Gestión de Stock</span>}
          </Link>
        )}

        <Link to="/promociones" className={`flex items-center gap-3 px-2 py-2 rounded hover:bg-blue-600 ${isActive('/promociones') ? 'bg-blue-700' : ''}`}>
          <FaTags className="text-xl" />
          {!isCollapsed && <span>Promociones</span>}
        </Link>

        {isAdmin && (
          <Link to="/usuarios" className={`flex items-center gap-3 px-2 py-2 rounded hover:bg-blue-600 ${isActive('/usuarios') ? 'bg-blue-700' : ''}`}>
            <FaUserPlus className="text-xl" />
            {!isCollapsed && <span>Usuarios</span>}
          </Link>
        )}

        <Link to="/configuracion" className={`flex items-center gap-3 px-2 py-2 rounded hover:bg-blue-600 ${isActive('/configuracion') ? 'bg-blue-700' : ''}`}>
          <FaCog className="text-xl" />
          {!isCollapsed && <span>Configuración</span>}
        </Link>

      </nav>

      {/* Cerrar sesión */}
      <div className="px-2 py-4">
        <button
          onClick={onLogoutClick}
          className="flex items-center gap-3 px-2 py-2 w-full text-left hover:bg-red-600 rounded"
        >
          <FaSignOutAlt className="text-xl" />
          {!isCollapsed && <span>Cerrar Sesión</span>}
        </button>
      </div>
    </aside>
  );
}

Sidebar.propTypes = {
  isCollapsed: PropTypes.bool.isRequired,
  toggleSidebar: PropTypes.func.isRequired,
  onLogoutClick: PropTypes.func.isRequired,
};
