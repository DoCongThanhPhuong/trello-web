import { Navigate, Outlet } from 'react-router-dom'

export default function ProtectedRoute() {
  if (!localStorage.getItem('accessToken')) {
    return <Navigate to="/login" />
  }

  return <Outlet />
}
