import '@/lib/errorReporter';
import { enableMapSet } from "immer";
enableMapSet();
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import '@/index.css'
import { LandingPage } from '@/pages/LandingPage';
import { Dashboard } from '@/pages/Dashboard';
import { Analytics } from '@/pages/Analytics';
import { Shop } from '@/pages/Shop';
const queryClient = new QueryClient();
// For this demo, we'll assume the user is always "authenticated"
const isAuthenticated = true;
const router = createBrowserRouter([
  {
    path: "/",
    element: isAuthenticated ? <Navigate to="/dashboard" /> : <LandingPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/landing",
    element: <LandingPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/analytics",
    element: <Analytics />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/shop",
    element: <Shop />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/settings",
    element: <Dashboard />, // Placeholder, can be built in a future phase
    errorElement: <RouteErrorBoundary />,
  },
]);
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <RouterProvider router={router} />
      </ErrorBoundary>
    </QueryClientProvider>
  </StrictMode>,
)