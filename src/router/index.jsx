import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from '../pages/MainPage';
import TenantsPage from '../components/TenantsPage';
import LoginPage from '../components/LoginPage';
import CreateTenantPage from '../components/CreateTenantPage';
import DeleteTenantPage from '../components/DeleteTenantPage';

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/tenants" element={<TenantsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/tenants/create" element={<CreateTenantPage />} />
        <Route path="/tenants/delete" element={<DeleteTenantPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;