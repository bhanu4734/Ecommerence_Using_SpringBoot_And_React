import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './hooks/useCartContext'
import ProtectedRoute from './components/auth/ProtectedRoute'
import AdminLayout from './components/layout/AdminLayout'
import UserLayout from './components/layout/UserLayout'

// Pages
import AuthPage from './pages/AuthPage'
import HomePage from './pages/user/HomePage'
import ProductsPage from './pages/user/ProductsPage'
import ProductDetailPage from './pages/user/ProductDetailPage'
import CartPage from './pages/user/CartPage'
import CheckoutPage from './pages/user/CheckoutPage'
import OrdersPage from './pages/user/OrdersPage'

import DashboardPage from './pages/admin/DashboardPage'
import AdminUsersPage from './pages/admin/UsersPage'
import AdminProductsPage from './pages/admin/ProductsPage'
import AdminOrdersPage from './pages/admin/OrdersPage'
import AdminCategoriesPage from './pages/admin/CategoriesPage'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<AuthPage mode="login" />} />
            <Route path="/register" element={<AuthPage mode="register" />} />

            {/* User Routes */}
            <Route path="/user" element={<ProtectedRoute><UserLayout /></ProtectedRoute>}>
              <Route path="home" element={<HomePage />} />
              <Route path="products" element={<ProductsPage />} />
              <Route path="products/:id" element={<ProductDetailPage />} />
              <Route path="cart" element={<CartPage />} />
              <Route path="checkout" element={<CheckoutPage />} />
              <Route path="orders" element={<OrdersPage />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin" element={<ProtectedRoute requiredRole="ADMIN"><AdminLayout /></ProtectedRoute>}>
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="users" element={<AdminUsersPage />} />
              <Route path="products" element={<AdminProductsPage />} />
              <Route path="orders" element={<AdminOrdersPage />} />
              <Route path="categories" element={<AdminCategoriesPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>

          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#fff',
                color: '#1e293b',
                border: '1px solid #e2e8f0',
                borderRadius: '1rem',
                fontFamily: '"Inter", sans-serif',
                fontSize: '14px',
                boxShadow: '0 12px 48px rgba(0,0,0,0.08)',
              },
              success: { iconTheme: { primary: '#2563eb', secondary: '#fff' } },
              error:   { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
            }}
          />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
