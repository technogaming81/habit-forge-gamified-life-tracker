import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet,
} from "react-router-dom";
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import { LandingPage } from '@/pages/LandingPage';
import { Dashboard } from '@/pages/Dashboard';
import { Analytics } from '@/pages/Analytics';
import { Shop } from '@/pages/Shop';
import { Auth } from '@/pages/Auth';
import { Settings } from '@/pages/Settings';
import { useAuth } from '@/lib/store';
import { AuthGuard } from '@/components/AuthGuard';
export default function AppRouter() {
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
}