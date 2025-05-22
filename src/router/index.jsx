import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import TenantProfilePage from '../pages/TenantProfilePage';
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
          <Route path="/perfil" element={<TenantProfilePage />} />
          <Route path="/products/" element={<ProductsCataloguePage />} />
          <Route path="/products/create/:tenantId" element={<CreateProductPage />} />
          <Route path="/products/edit/:tenantId/:productId" element={<EditProductPage />} />
        </Route>

      </Routes>
    </Router>
  );
}
