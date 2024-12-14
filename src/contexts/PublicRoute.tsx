// src/contexts/PublicRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';
import PublicTopbar from '@/modules/PublicTopbar';

export function PublicRoute({ children }: { children?: React.ReactNode }) {
  const { currentUser, loading } = useAuth();

  if (loading) return null;

  if (currentUser) {
    return <Navigate to="/home" />;
  }

  return (
    <>
      <PublicTopbar />
      {children ? children : <Outlet />}
    </>
  );
}
