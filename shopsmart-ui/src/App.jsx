import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { setToastRef } from './api/client.js';
import { useToast } from './context/ToastContext.jsx';

// Layout
import Header from './components/layout/Header.jsx';
import ProtectedRoute from './components/layout/ProtectedRoute.jsx';
import AdminRoute from './components/layout/AdminRoute.jsx';

// Pages
import LoginPage from './pages/LoginPage.jsx';
import HomePage from './pages/HomePage.jsx';
import ProductsPage from './pages/ProductsPage.jsx';
import ProductDetailPage from './pages/ProductDetailPage.jsx';
import ComparePage from './pages/ComparePage.jsx';
import CartPage from './pages/CartPage.jsx';
import WishlistPage from './pages/WishlistPage.jsx';
import AssistantPage from './pages/AssistantPage.jsx';
import OrdersPage from './pages/OrdersPage.jsx';
import OrderDetailPage from './pages/OrderDetailPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import KnowledgePage from './pages/KnowledgePage.jsx';
import AiLogPage from './pages/AiLogPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

export default function App() {
  const toast = useToast();

  // Wire toast context into the API client so it can surface errors globally
  useEffect(() => {
    setToastRef(toast);
  }, [toast]);

  return (
    <>
      <Header />

      <main style={{ minHeight: 'calc(100vh - 64px)' }}>
        <Routes>
          {/* ── Public ──────────────────────────────────────────────── */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/compare" element={<ComparePage />} />

          {/* ── Protected (login required) ─────────────────────────── */}
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wishlist"
            element={
              <ProtectedRoute>
                <WishlistPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/assistant"
            element={
              <ProtectedRoute>
                <AssistantPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <OrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders/:id"
            element={
              <ProtectedRoute>
                <OrderDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* ── Admin (login + ADMIN role) ─────────────────────────── */}
          <Route
            path="/admin/knowledge"
            element={
              <ProtectedRoute>
                <AdminRoute>
                  <KnowledgePage />
                </AdminRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/ai-log"
            element={
              <ProtectedRoute>
                <AdminRoute>
                  <AiLogPage />
                </AdminRoute>
              </ProtectedRoute>
            }
          />

          {/* ── Catch-all ──────────────────────────────────────────── */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </>
  );
}
