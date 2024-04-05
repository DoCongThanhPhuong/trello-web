import Home from '~/pages/Home'
import Boards from '~/pages/Boards'
import Board from '~/pages/Boards/_id'

import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/boards" element={<Boards />} />
          <Route path="/boards/:id" element={<Board />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
