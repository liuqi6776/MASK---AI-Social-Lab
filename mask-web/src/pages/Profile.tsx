import { useState } from 'react'

export default function Profile() {
  const [activeTab, setActiveTab] = useState<'stats' | 'settings'>('stats')

  const user = {
    publicId: '@user_a1b2c3',
    nickname: '夜行者',
    role: 'pro' as const,
    moodCount: 47,
    chatCount: 128,
    gameScore: 850,
    joinDate: '2026-06-15',
  }

  const stats = [
    { label: '心情卡片', value: user.moodCount, icon: '📝' },
    { label: '聊天次数', value: user.chatCount, icon: '💬' },
    { label: '图灵测试', value: user.gameScore, icon: '🎭' },
    { label: 'AI角色', value: 3, icon: '🤖' },
  ]

  return (
    <div>
      {/* User Card */}
      <div className="mask-card mb-4 text-center">
        <div
          className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-full text-3xl"
          style={{ background: 'var(--color-primary)' }}
        >
          🎭
        </div>
        <h2 className="text-xl font-bold">{user.nickname}</h2>
        <p className="mt-1 text-sm" style={{ color: 'var(--color-text-muted)' }}>
          {user.publicId}
        </p>
        <div className="mt-2">
          <span
            className="rounded-full px-3 py-1 text-xs font-medium"
            style={{ background: 'var(--color-primary)', color: 'white' }}
          >
            {user.role === 'pro' ? '💎 Pro' : user.role === 'creator' ? '👑 Creator' : '🆓 Free'}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="mb-4 grid grid-cols-2 gap-3">
        {stats.map((stat) => (
          <div key={stat.label} className="mask-card text-center p-3">
            <p className="text-2xl">{stat.icon}</p>
            <p className="mt-1 text-xl font-bold">{stat.value}</p>
            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setActiveTab('stats')}
          className={`flex-1 rounded-xl py-2 text-sm ${activeTab === 'stats' ? 'mask-btn' : 'mask-btn-secondary'}`}
        >
          心情拼图
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex-1 rounded-xl py-2 text-sm ${activeTab === 'settings' ? 'mask-btn' : 'mask-btn-secondary'}`}
        >
          设置
        </button>
      </div>

      {activeTab === 'stats' && (
        <div className="mask-card text-center py-8">
          <p className="text-4xl mb-3">🧩</p>
          <p className="font-medium mb-1">7月心情地图</p>
          <p className="text-sm mb-4" style={{ color: 'var(--color-text-muted)' }}>
            本月已记录 {user.moodCount} 天的心情
          </p>
          {/* Mock mood mosaic */}
          <div className="mx-auto grid max-w-[200px] grid-cols-7 gap-1">
            {Array.from({ length: 31 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square rounded-sm"
                style={{
                  background: ['#FFD93D', '#6BCB77', '#FF6B9D', '#A29BFE', '#6BCB77', '#FFD93D', '#FF6B9D'][i % 7],
                  opacity: i < user.moodCount ? 1 : 0.2,
                }}
              />
            ))}
          </div>
          <button className="mt-4 text-sm" style={{ color: 'var(--color-primary)' }}>
            导出高清版 →
          </button>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="space-y-3">
          <div className="mask-card">
            <h3 className="mb-3 font-medium">账号设置</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">显示昵称</span>
                <button className="text-sm" style={{ color: 'var(--color-primary)' }}>修改</button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">会员状态</span>
                <span className="text-sm" style={{ color: 'var(--color-primary)' }}>Pro (2027-06-15到期)</span>
              </div>
            </div>
          </div>
          <div className="mask-card">
            <h3 className="mb-3 font-medium">其他</h3>
            <div className="space-y-3">
              <button className="w-full text-left text-sm">📋 使用条款</button>
              <button className="w-full text-left text-sm">🔒 隐私政策</button>
              <button className="w-full text-left text-sm">❓ 帮助与反馈</button>
              <button className="w-full text-left text-sm" style={{ color: '#FF4757' }}>
                🚪 退出登录
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
