import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import ProductsCataloguePage from '../pages/ProductsCataloguePage';
import EditProductPage from '../pages/EditProductPage';
import CreateProductPage from '../pages/CreateProductPage';
import PromotionsPage from '../pages/PromotionsPage';
import CreatePromotionPage from '../pages/CreatePromotionPage';
import EditPromotionPage from '../pages/EditPromotionPage';
import DashboardPage from '../pages/DashboardPage';
import PrivateLayout from '../layouts/PrivateLayout';
import PublicLayout from '../layouts/PublicLayout'; 
import RegisterTenantPage from '../pages/RegisterTenantPage'; 
import CreateCommercePage from '../pages/CreateCommercePage';
import EditCommercePage from '../pages/EditCommercePage';
import RegisterInternalUsersPage from '../pages/RegisterInternalUsersPage';
import SellersPage from '@/pages/SellersPage';
import CreateCategoryPage from '../pages/CreateCategoryPage';
import PrivateRoute from '../components/PrivateRoute';

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        {/* Layout público para usuarios no logueados */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LoginPage />} /> 
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register-tenant" element={<RegisterTenantPage />} />
        </Route>

        {/* Layout privado para usuarios logueados */}
        <Route element={<PrivateLayout />}>
          <Route path="/sellers" element={<PrivateRoute><SellersPage /></PrivateRoute>} />
          <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
          <Route path="/sellers/create" element={<PrivateRoute><CreateCommercePage /></PrivateRoute>} />
          <Route path="/sellers/edit/:id" element={<PrivateRoute><EditCommercePage /></PrivateRoute>} />
          <Route path="/products" element={<PrivateRoute><ProductsCataloguePage /></PrivateRoute>} />
          <Route path="/products/create" element={<PrivateRoute><CreateProductPage /></PrivateRoute>} />
          <Route path="/products/edit/:productId" element={<PrivateRoute><EditProductPage /></PrivateRoute>} />
          <Route path="/promociones" element={<PrivateRoute><PromotionsPage /></PrivateRoute>} />
          <Route path="/promociones/create" element={<PrivateRoute><CreatePromotionPage /></PrivateRoute>} />
          <Route path="/promociones/edit/:id" element={<PrivateRoute><EditPromotionPage /></PrivateRoute>} />
          <Route path="/usuarios" element={<PrivateRoute><RegisterInternalUsersPage /></PrivateRoute>} />
          <Route path="/crear-comercio" element={<PrivateRoute><CreateCommercePage /></PrivateRoute>} />
          <Route path="/categories/create" element={<PrivateRoute><CreateCategoryPage /></PrivateRoute>} />
        </Route>
      </Routes>
    </Router>
  );
}
