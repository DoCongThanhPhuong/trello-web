import { createBrowserRouter } from 'react-router-dom'
import AuthPage from '~/pages/AuthPage/AuthPage'
import HomePage from '~/pages/HomePage/HomePage'
import ErrorPage from '~/pages/ErrorPage/ErrorPage'
import ProtectedRoute from './ProtectedRoute'
import Boards from '~/pages/Boards'
import Board from '~/pages/Boards/_id'
import UserProfile from '~/pages/Users/_id'
import AuthLayout from './AuthLayout'

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
            path: '/u/profile/:id'
          }
        ]
      }
    ]
  }
])

export default router
