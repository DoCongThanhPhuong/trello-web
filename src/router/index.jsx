import { createBrowserRouter, Outlet } from 'react-router-dom'
import AuthProvider from '~/context/AuthProvider'
import Login from '~/pages/Auth/Login'
import Home from '~/pages/Home'
import ProtectedRoute from './ProtectedRoute'
import Boards from '~/pages/Boards'
import Board from '~/pages/Boards/_id'
import Error from '~/pages/Error'

// eslint-disable-next-line react-refresh/only-export-components
const AuthLayout = () => {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export default createBrowserRouter([
  {
    element: <AuthLayout />,
    errorElement: <Error />,
    children: [
      {
        element: <Home />,
        path: '/'
      },
      {
        element: <Login />,
        path: '/login'
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <Boards />,
            path: '/boards'
          },
          {
            element: <Board />,
            path: '/boards/:id'
          }
        ]
      }
    ]
  }
])
