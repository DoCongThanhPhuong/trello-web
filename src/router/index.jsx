import { createBrowserRouter } from 'react-router-dom'
import AuthPage from '~/pages/AuthPage/AuthPage'
import Boards from '~/pages/Boards'
import Board from '~/pages/Boards/_id'
import ErrorPage from '~/pages/ErrorPage/ErrorPage'
import HomePage from '~/pages/HomePage/HomePage'
import UserProfile from '~/pages/Users/Profile'
import AuthLayout from './AuthLayout'
import ProtectedRoute from './ProtectedRoute'

const router = createBrowserRouter([
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
          },
          {
            element: <UserProfile />,
            path: '/my-profile'
          }
        ]
      }
    ]
  }
])

export default router
