import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute — wraps pages that require authentication + optional role check.
 *
 * Props:
 *   allowedRoles - array of roles allowed to view this page (e.g. ['owner','cashier'])
 *                  omit to allow any authenticated user
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  // Still checking token → show spinner
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-50">
        <div className="w-12 h-12 border-4 border-neutral-200 border-t-accent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Not logged in → redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but wrong role → redirect to their own dashboard
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const dashboardMap = {
      customer: '/customer',
      cashier: '/admin',
      owner: '/owner',
    };
    return <Navigate to={dashboardMap[user.role] || '/'} replace />;
  }

  return children;
};

export default ProtectedRoute;
