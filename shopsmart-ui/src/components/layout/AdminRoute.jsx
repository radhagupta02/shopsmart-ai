import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

/**
 * Route guard: redirects to / if user role is not ADMIN.
 * Must be used inside a ProtectedRoute (assumes user is authenticated).
 */
export default function AdminRoute({ children }) {
  const { isAdmin } = useAuth();

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}
