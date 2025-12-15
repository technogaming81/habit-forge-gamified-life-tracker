import '@/lib/errorReporter';
import { enableMapSet } from "immer";
enableMapSet();
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import '@/index.css';
import { LandingPage } from '@/pages/LandingPage';
import { Dashboard } from '@/pages/Dashboard';
import { Analytics } from '@/pages/Analytics';
import { Shop } from '@/pages/Shop';
import { Auth } from '@/pages/Auth';
import { Settings } from '@/pages/Settings';
import { useAuth } from '@/lib/store';
import { Toaster } from '@/components/ui/sonner';
const queryClient = new QueryClient();
const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { loggedIn } = useAuth();
  if (!loggedIn) {
    return <Navigate to="/auth" replace />;
  }
  return <>{children}</>;
};
const App = () => {
  const { loggedIn } = useAuth();
  const router = createBrowserRouter([
    {
      path: "/",
      element: loggedIn ? <Navigate to="/dashboard" /> : <LandingPage />,
      errorElement: <RouteErrorBoundary />,
    },
    {
      path: "/landing",
      element: <LandingPage />,
      errorElement: <RouteErrorBoundary />,
    },
    {
      path: "/auth",
      element: <Auth />,
      errorElement: <RouteErrorBoundary />,
    },
    {
      path: "/",
      element: <AuthGuard><Outlet /></AuthGuard>,
      children: [
        {
          path: "dashboard",
          element: <Dashboard />,
          errorElement: <RouteErrorBoundary />,
        },
        {
          path: "analytics",
          element: <Analytics />,
          errorElement: <RouteErrorBoundary />,
        },
        {
          path: "shop",
          element: <Shop />,
          errorElement: <RouteErrorBoundary />,
        },
        {
          path: "settings",
          element: <Settings />,
          errorElement: <RouteErrorBoundary />,
        },
      ]
    }
  ]);
  return <RouterProvider router={router} />;
};
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <App />
        <Toaster richColors />
      </ErrorBoundary>
    </QueryClientProvider>
  </StrictMode>,
);