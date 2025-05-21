import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

export default function PrivateLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => setIsCollapsed((prev) => !prev);

  return (
    <div className="relative min-h-screen bg-background">
      {/* Sidebar móvil */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 sm:hidden"
          onClick={() => setIsSidebarOpen(false)}
        >
          <div
            className="w-64 bg-dark h-full shadow-lg transform transition-transform duration-300 translate-x-0"
            onClick={(e) => e.stopPropagation()}
          >
            <Sidebar isCollapsed={false} toggleSidebar={() => setIsSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Layout principal */}
      <div
        className={`flex min-h-screen bg-background transition-all duration-300 ${
          isCollapsed ? 'sm:ml-20' : 'sm:ml-64'
        }`}
      >
        {/* Sidebar fijo solo desktop */}
        <div className="hidden sm:block">
          <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
        </div>

        {/* Contenido principal */}
        <main className="flex-1 p-4 sm:p-5 transition-all bg-background min-w-0 overflow-x-auto">
          {/* Botón de menú en mobile */}
          <div className="sm:hidden mb-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="text-2xl text-dark hover:text-gray-300 transition-colors"
            >
              ☰
            </button>
          </div>

          <Outlet />
        </main>
      </div>
    </div>
  );
}
