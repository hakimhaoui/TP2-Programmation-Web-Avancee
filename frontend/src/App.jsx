import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import PublicLayout from './components/PublicLayout';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/AdminLayout';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import SearchPage from './pages/SearchPage';
import GiftListsPage from './pages/GiftListsPage';
import GiftListCreatePage from './pages/GiftListCreatePage';
import GiftListViewPage from './pages/GiftListViewPage';
import CheckoutPage from './pages/CheckoutPage';
import PaymentExternalPage from './pages/PaymentExternalPage';
import ConfirmationPage from './pages/ConfirmationPage';
import OrdersPage from './pages/OrdersPage';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminBooksPage from './pages/admin/AdminBooksPage';
import AdminBookFormPage from './pages/admin/AdminBookFormPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';

const DASHBOARD_ROLES = ['administrateur', 'gestionnaire', 'editeur'];

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<PublicLayout />}>
              <Route index element={<HomePage />} />
              <Route path="recherche" element={<SearchPage />} />
              <Route path="ouvrages/:id" element={<ProductPage />} />
              <Route path="panier" element={<CartPage />} />
              <Route path="connexion" element={<LoginPage />} />
              <Route path="inscription" element={<RegisterPage />} />
              <Route path="mot-de-passe-oublie" element={<ForgotPasswordPage />} />
              <Route path="listes-cadeaux" element={<GiftListsPage />} />
              <Route path="listes-cadeaux/creer" element={<GiftListCreatePage />} />
              <Route path="listes-cadeaux/:code" element={<GiftListViewPage />} />
              <Route path="checkout" element={<CheckoutPage />} />
              <Route path="paiement-externe" element={<PaymentExternalPage />} />
              <Route path="confirmation" element={<ConfirmationPage />} />
              <Route path="mes-commandes" element={<OrdersPage />} />

              <Route
                path="admin"
                element={(
                  <ProtectedRoute roles={DASHBOARD_ROLES}>
                    <AdminLayout />
                  </ProtectedRoute>
                )}
              >
                <Route index element={<AdminDashboard />} />
                <Route path="ouvrages" element={<AdminBooksPage />} />
                <Route path="ouvrages/nouveau" element={<AdminBookFormPage />} />
                <Route path="ouvrages/:id" element={<AdminBookFormPage />} />
                <Route path="commandes" element={<AdminOrdersPage />} />
                <Route path="utilisateurs" element={<AdminUsersPage />} />
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}
