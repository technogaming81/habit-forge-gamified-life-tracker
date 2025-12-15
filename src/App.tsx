import React, { Suspense } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet,
} from "react-router-dom";
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import { LandingPage } from '@/pages/LandingPage';
import { Auth } from '@/pages/Auth';
import { useAuth } from '@/lib/store';
import { AuthGuard } from '@/components/AuthGuard';
import { Skeleton } from '@/components/ui/skeleton';
const LazyDashboard = React.lazy(() => import('./pages/Dashboard').then(module => ({ default: module.Dashboard })));
const LazyAnalytics = React.lazy(() => import('./pages/Analytics').then(module => ({ default: module.Analytics })));
const LazyShop = React.lazy(() => import('./pages/Shop').then(module => ({ default: module.Shop })));
const LazySettings = React.lazy(() => import('./pages/Settings').then(module => ({ default: module.Settings })));
const LoadingFallback = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12">
    <div className="space-y-4">
      <Skeleton className="h-12 w-1/4" />
      <Skeleton className="h-24 w-full" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    </div>
  </div>
);
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
          element: <Suspense fallback={<LoadingFallback />}><LazyDashboard /></Suspense>,
          errorElement: <RouteErrorBoundary />,
        },
        {
          path: "analytics",
          element: <Suspense fallback={<LoadingFallback />}><LazyAnalytics /></Suspense>,
          errorElement: <RouteErrorBoundary />,
        },
        {
          path: "shop",
          element: <Suspense fallback={<LoadingFallback />}><LazyShop /></Suspense>,
          errorElement: <RouteErrorBoundary />,
        },
        {
          path: "settings",
          element: <Suspense fallback={<LoadingFallback />}><LazySettings /></Suspense>,
          errorElement: <RouteErrorBoundary />,
        },
      ]
    }
  ]);
  return <RouterProvider router={router} />;
}