import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import TenantProfilePage from '../pages/TenantProfilePage';
import ProductsCataloguePage from '../pages/ProductscataloguePage';
import EditProductPage from '../pages/EditProductPage';
import CreateProductPage from '../pages/CreateProductPage';
import PromotionsPage from '../pages/PromotionsPage';
import CreatePromotionPage from '../pages/CreatePromotionPage';
import EditPromotionPage from '../pages/EditPromotionPage';
import PrivateLayout from '../layouts/PrivateLayout';
import PublicLayout from '../layouts/PublicLayout'; 
import RegisterPage from '../pages/UsersPage'; 
import CreateTenantPage from '../pages/CreateTenantPage'; 
import CreateCommercePage from '../pages/CreateCommercePage';
import EditUserPage from '../pages/UsersPage';
import BilleteraPage from '@pages/BilleteraPage';





export default function AppRouter() {
  return (
    <Router>
      <Routes>
        {/* Layout público para usuarios no logueados */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LoginPage />} /> 
          <Route path="/login" element={<LoginPage />} />
          <Route path="/crear-tenant" element={<CreateTenantPage />} />
        </Route>

        {/* Layout privado para usuarios logueados */}
        <Route element={<PrivateLayout />}>
          <Route path="/perfil" element={<TenantProfilePage />} />
          <Route path="/products/" element={<ProductsCataloguePage />} />
          <Route path="/products/create/:tenantId" element={<CreateProductPage />} />
          <Route path="/products/edit/:tenantId/:productId" element={<EditProductPage />} />
          <Route path="/promociones" element={<PromotionsPage />} />
          <Route path="/promociones/create" element={<CreatePromotionPage />} />
          <Route path="/promociones/edit/:id" element={<EditPromotionPage />} />
          <Route path="/usuarios" element={<EditUserPage/>} />
          <Route path="/crear-comercio" element={<CreateCommercePage/>} />
          <Route path="/billetera" element={<BilleteraPage />} />
        </Route>

      </Routes>
    </Router>
  );
}
