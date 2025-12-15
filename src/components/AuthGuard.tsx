import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/lib/store';
export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { loggedIn } = useAuth();
  if (!loggedIn) {
    return <Navigate to="/auth" replace />;
  }
  return <>{children}</>;
};