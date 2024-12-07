import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

export function PrivateRoute() {
  const { currentUser, loading } = useAuth();

  if (loading) return null;

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
}
