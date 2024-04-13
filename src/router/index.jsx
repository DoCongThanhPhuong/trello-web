import { createBrowserRouter, Outlet } from 'react-router-dom'
import AuthProvider from '~/contexts/AuthProvider'
import AuthPage from '~/pages/AuthPage/AuthPage'
import HomePage from '~/pages/HomePage/HomePage'
import ErrorPage from '~/pages/ErrorPage/ErrorPage'
import ProtectedRoute from './ProtectedRoute'
import Boards from '~/pages/Boards'
import Board from '~/pages/Boards/_id'

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
    errorElement: <ErrorPage />,
    children: [
      {
        element: <HomePage />,
        path: '/'
      },
      {
        element: <AuthPage />,
        path: '/auth'
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
