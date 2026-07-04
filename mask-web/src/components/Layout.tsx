import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { cn } from '../utils/cn'

/**
 * Layout - 评审重构版
 * 
 * 改动：
 * 1. 导航从4个Tab砍为3个：竞技场/面具/我的
 * 2. 砍掉"发布心情"按钮（广场已砍）
 * 3. 新增合规开屏披露（评审生死线要求）
 * 4. Header slogan 改为游戏定位
 */

const navItems = [
  { path: '/', label: '竞技场', icon: '🎮' },
  { path: '/mask', label: '面具', icon: '🎭' },
  { path: '/profile', label: '我的', icon: '🏆' },
]

/** 本地存储 key：用户是否已确认知情同意 */
const CONSENT_KEY = 'mask_ai_consent_accepted'

export default function Layout() {
  const location = useLocation()
  const navigate = useNavigate()
  const [showConsent, setShowConsent] = useState(false)

  // 首次访问显示合规披露
  useEffect(() => {
    const accepted = localStorage.getItem(CONSENT_KEY)
    if (!accepted) {
      setShowConsent(true)
    }
  }, [])

  const handleAcceptConsent = () => {
    localStorage.setItem(CONSENT_KEY, 'true')
    setShowConsent(false)
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header
        className="sticky top-0 z-50 px-4 py-3"
        style={{ background: 'rgba(15,15,26,0.9)', backdropFilter: 'blur(10px)' }}
      >
        <div className="mx-auto flex max-w-lg items-center justify-between">
          <div>
            <h1 className="text-xl font-bold" style={{ color: 'var(--color-primary)' }}>
              MASK
            </h1>
            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
              AI 图灵竞技场
            </p>
          </div>
          <div className="rounded-full px-3 py-1 text-xs" style={{ background: 'var(--color-surface-light)', color: 'var(--color-accent)' }}>
            🎭 造面具 · 骗人类 · 识 AI
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-lg px-4 pt-4">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 border-t px-4"
        style={{
          background: 'rgba(15,15,26,0.95)',
          backdropFilter: 'blur(10px)',
          borderColor: 'var(--color-border)',
        }}
      >
        <div className="mx-auto flex max-w-lg justify-around py-2">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                'flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all',
                location.pathname === item.path ? 'font-medium' : 'opacity-50 hover:opacity-80'
              )}
              style={location.pathname === item.path ? { color: 'var(--color-primary)' } : {}}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-xs">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* 合规开屏披露 —— 评审生死线 */}
      {showConsent && <ConsentModal onAccept={handleAcceptConsent} />}
    </div>
  )
}

/**
 * ConsentModal - AI 知情同意披露
 * 
 * 评审要求（炸弹2 - 中国合规红线）：
 * "把'AI冒充人'从违法的社交默认态 → 合法的、用户同意的游戏机制"
 * 
 * 此弹窗是产品能不能上线的生死线：
 * - 明确告知用户游戏中存在 AI 对手
 * - 用户主动确认后才可进入
 * - 符合《生成式AI服务管理暂行办法》标识要求
 */
function ConsentModal({ onAccept }: { onAccept: () => void }) {
  const [confirmed, setConfirmed] = useState(false)

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center px-4"
      style={{ background: 'rgba(0,0,0,0.85)' }}
    >
      <div
        className="w-full max-w-md rounded-3xl p-6"
        style={{ background: 'var(--color-surface)', border: '2px solid var(--color-primary)' }}
      >
        <div className="mb-4 text-center">
          <span className="text-4xl">🎭</span>
          <h2 className="mt-2 text-xl font-bold">欢迎来到 MASK</h2>
          <p className="mt-1 text-sm" style={{ color: 'var(--color-text-muted)' }}>
            AI 图灵竞技场 —— 一个社交推理游戏
          </p>
        </div>

        <div className="mb-4 space-y-3 rounded-xl p-4 text-sm" style={{ background: 'var(--color-surface-light)' }}>
          <p className="font-medium" style={{ color: 'var(--color-accent)' }}>
            ⚠️ 重要说明（请仔细阅读）
          </p>
          <p>
            本游戏中，<strong>部分对手是 AI</strong>（官方 AI 或其他玩家的面具）。你的任务是识别他们。
          </p>
          <p>
            你也可以创建自己的<strong>AI 面具（persona）</strong>，它只在你离线时参加别人的对局——目标是骗过其他真人玩家。
          </p>
          <p>
            每一局结束后，系统会揭晓每个对手的真实身份（真人 / AI）。
          </p>
          <p style={{ color: 'var(--color-text-muted)' }}>
            对局中对手身份隐藏，对局结束后揭示哪些内容由 AI 生成。
          </p>
        </div>

        <label className="mb-4 flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded"
          />
          <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
            我已理解并同意：本游戏包含 AI 对手，我参与的是一场<strong>识别 AI 的推理游戏</strong>。
          </span>
        </label>

        <button
          onClick={onAccept}
          disabled={!confirmed}
          className="mask-btn w-full disabled:opacity-30"
        >
          我知道了，开始游戏
        </button>
      </div>
    </div>
  )
}
