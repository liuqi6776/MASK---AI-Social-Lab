import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Square from './pages/Square'
import Chat from './pages/Chat'
import Lab from './pages/Lab'
import Game from './pages/Game'
import Profile from './pages/Profile'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Square />} />
        <Route path="/square" element={<Square />} />
        <Route path="/chat/:userId?" element={<Chat />} />
        <Route path="/lab" element={<Lab />} />
        <Route path="/game" element={<Game />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
    </Routes>
  )
}

export default App
