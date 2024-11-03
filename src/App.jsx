import { Navigate, Route, Routes } from 'react-router-dom'
import NotFound from './pages/404/NotFound'
import Auth from './pages/Auth/Auth'
import Board from './pages/Boards/_id'

function App() {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <Navigate to="/boards/66c08035f63f0f96857317cd" replace={true} />
          }
        />
        <Route path="/boards/:boardId" element={<Board />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/register" element={<Auth />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App
