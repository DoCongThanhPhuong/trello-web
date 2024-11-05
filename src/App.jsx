import { useSelector } from 'react-redux'
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import NotFound from './pages/404/NotFound'
import AccountVerification from './pages/Auth/AccountVerification'
import Auth from './pages/Auth/Auth'
import Board from './pages/Boards/_id'
import Settings from './pages/Settings/Settings'
import { selectCurrentUser } from './redux/user/userSlice'

const ProtectedRoute = ({ user }) => {
  if (!user) return <Navigate to="/login" replace={true} />
  return <Outlet />
}

function App() {
  const currentUser = useSelector(selectCurrentUser)

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Navigate to="/boards/66c08035f63f0f96857317cd" replace={true} />
        }
      />

      <Route element={<ProtectedRoute user={currentUser} />}>
        <Route path="/boards/:boardId" element={<Board />} />
        <Route path="/settings/account" element={<Settings />} />
        <Route path="/settings/security" element={<Settings />} />
      </Route>

      <Route path="/login" element={<Auth />} />
      <Route path="/register" element={<Auth />} />
      <Route path="/account/verification" element={<AccountVerification />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
