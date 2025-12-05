import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Login, LoginAction } from './Forms/Login.jsx'
import { Register, RegisterAction } from './Forms/Signup.jsx'

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {path: "/", element: <h1>Etusivu</h1>},
      {path: "/login", element: <Login />, action: LoginAction},
      {path: "/signup", element: <Register />, action: RegisterAction}
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
