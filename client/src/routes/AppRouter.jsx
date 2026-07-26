import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import { DarkModeProvider } from '../context/DarkModeContext';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';

import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import CartDrawer from '../components/cart/CartDrawer';
import AdminLayout from '../components/layout/AdminLayout';

import HomePage from '../pages/customer/HomePage';
import MenuPage from '../pages/customer/MenuPage';
import CheckoutPage from '../pages/customer/CheckoutPage';
import OrdersPage from '../pages/customer/OrdersPage';
import OrderTrackingPage from '../pages/customer/OrderTrackingPage';
import FavoritesPage from '../pages/customer/FavoritesPage';
import ProfilePage from '../pages/customer/ProfilePage';
import LoginPage from '../pages/auth/LoginPage';
import SignupPage from '../pages/auth/SignupPage';

import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import AdminOrdersPage from '../pages/admin/AdminOrdersPage';
import AdminMenuPage from '../pages/admin/AdminMenuPage';
import AdminUsersPage from '../pages/admin/AdminUsersPage';
import AdminFeaturedPage from '../pages/admin/AdminFeaturedPage';
import AdminPromosPage from '../pages/admin/AdminPromosPage';

const CustomerLayout = ({ children }) => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <CartDrawer />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
);

const AppRouter = () => (
  <BrowserRouter>
    <DarkModeProvider>
      <AuthProvider>
        <CartProvider>
          <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
          <Routes>
          {/* Auth pages (no nav) */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Admin pages */}
          <Route path="/admin" element={<AdminRoute><AdminLayout><AdminDashboardPage /></AdminLayout></AdminRoute>} />
          <Route path="/admin/orders" element={<AdminRoute><AdminLayout><AdminOrdersPage /></AdminLayout></AdminRoute>} />
          <Route path="/admin/menu" element={<AdminRoute><AdminLayout><AdminMenuPage /></AdminLayout></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><AdminLayout><AdminUsersPage /></AdminLayout></AdminRoute>} />
          <Route path="/admin/featured" element={<AdminRoute><AdminLayout><AdminFeaturedPage /></AdminLayout></AdminRoute>} />
          <Route path="/admin/promos" element={<AdminRoute><AdminLayout><AdminPromosPage /></AdminLayout></AdminRoute>} />

          {/* Customer pages */}
          <Route path="/" element={<CustomerLayout><HomePage /></CustomerLayout>} />
          <Route path="/menu" element={<CustomerLayout><MenuPage /></CustomerLayout>} />
          <Route path="/profile" element={<CustomerLayout><ProtectedRoute><ProfilePage /></ProtectedRoute></CustomerLayout>} />
          <Route path="/checkout" element={<CustomerLayout><ProtectedRoute><CheckoutPage /></ProtectedRoute></CustomerLayout>} />
          <Route path="/orders" element={<CustomerLayout><ProtectedRoute><OrdersPage /></ProtectedRoute></CustomerLayout>} />
          <Route path="/orders/:id/track" element={<CustomerLayout><ProtectedRoute><OrderTrackingPage /></ProtectedRoute></CustomerLayout>} />
          <Route path="/favorites" element={<CustomerLayout><ProtectedRoute><FavoritesPage /></ProtectedRoute></CustomerLayout>} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </DarkModeProvider>
  </BrowserRouter>
);

export default AppRouter;
