import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import Form from '@/layout/form.tsx'


import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './pages/form/Login.tsx'
import Register from './pages/form/Register.tsx'
import Home from '@/pages/Home/Home.tsx'
import { Toaster } from '@/components/ui/toaster.tsx'


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "Form",  // Use relative path for "/Form"
        element: <Form />,
        children: [
          {
            path: "Login",  // Use relative path for "/Login"
            element: <Login />,
          },
          {
            path: "Register",  // Use relative path for "/Register"
            element: <Register />,
          },
        ]
      },
    ]
  },{
    path : 'Home',
    element : <Home />
  }
]);


createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <RouterProvider router={router} />
      <Toaster />
  </StrictMode>,
)
