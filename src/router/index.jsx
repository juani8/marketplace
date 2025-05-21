import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import TenantsPage from '../pages/TenantsPage';
import CreateTenantPage from '../pages/CreateTenantPage';
import ModifyTenantPage from '../pages/ModifyTenantPage';
import SelectTenantPage from '../pages/SelectTenantPage';
import ProductsCataloguePage from '../pages/ProductsCataloguePage';
import EditProductPage from '../pages/EditProductPage';
import CreateProductPage from '../pages/CreateProductPage';
import PrivateLayout from '../layouts/PrivateLayout';
import PublicLayout from '../layouts/PublicLayout'; 

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        {/* Layout público para usuarios no logueados */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LoginPage />} /> 
          <Route path="/login" element={<LoginPage />} />
        </Route>

        {/* Layout privado para usuarios logueados */}
        <Route element={<PrivateLayout />}>
          <Route path="/tenants" element={<TenantsPage />} />
          <Route path="/tenants/create" element={<CreateTenantPage />} />
          <Route path="/tenants/edit/:id" element={<ModifyTenantPage />} />
          <Route path="/products/select-tenant" element={<SelectTenantPage />} />
          <Route path="/products/catalogue/:tenantId" element={<ProductsCataloguePage />} />
          <Route path="/products/create/:tenantId" element={<CreateProductPage />} />
          <Route path="/products/edit/:tenantId/:productId" element={<EditProductPage />} />
        </Route>

      </Routes>
    </Router>
  );
}
