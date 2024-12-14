// src/contexts/AuthAwareRoute.tsx
import React from 'react';
import { useAuth } from './AuthContext';
import PrivateTopbar from '@/modules/PrivateTopbar';
import PublicTopbar from '@/modules/PublicTopbar';

interface AuthAwareRouteProps {
  children: React.ReactNode;
}

export function AuthAwareRoute({ children }: AuthAwareRouteProps) {
  const { currentUser, loading } = useAuth();

  if (loading) return null;

  return (
    <>
      {currentUser ? <PrivateTopbar /> : <PublicTopbar />}
      {children}
    </>
  );
}
