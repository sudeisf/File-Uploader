import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import Login from './components/Forms/login.tsx';
import Register from './components/Forms/SignIn.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import ProtectedLayout from './components/layouts/ProtectedLayout.tsx';
import Home from './pages/home.tsx';
import { Toaster } from './components/ui/toaster.tsx';
import { QueryClientProvider , queryClient } from './context/AuthContext.tsx';

// Define your router
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true, // The base path "/"
        element: <Navigate to="protected/home" replace />, // Redirects "/" to "/protected/home"
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "protected",
        element: <ProtectedLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="home" replace />, // Redirects "/protected" to "/protected/home"
          },
          {
            path: "home",
            element: <Home />,
          },
        ],
      },
    ],
  },
]);

// Render the app
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster />
    </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);
