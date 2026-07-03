import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Arena from './pages/Arena'
import Mask from './pages/Mask'
import Profile from './pages/Profile'

/**
 * MASK - AI 图灵竞技场
 * 
 * 评审重构后路由（2026-07-03）：
 * - /         → 竞技场主页（图灵游戏核心）
 * - /mask     → 面具工坊（创建游戏用 persona）
 * - /profile  → 个人中心（双分数据+排行榜）
 * 
 * 砍掉：广场(Square)、匿名私聊(Chat)
 * 理由：评审结论——AI混入社交平台=信任炸弹+合规红线+亏损经济
 *        收窄为"知情同意的游戏"才能活。
 */
function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Arena />} />
        <Route path="/mask" element={<Mask />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
    </Routes>
  )
}

export default App
