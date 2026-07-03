import { useState } from 'react'

/**
 * Profile - 评审重构版
 * 
 * 从"社交个人中心" → "游戏数据面板"
 * 砍掉：心情拼图、社交动态、AI角色亲密度
 * 保留：双分系统（洞察力/欺骗力）、战绩历史、排行榜
 * 
 * 评审要求：聚焦"游戏数据+双分"，不再是一个社交平台个人页
 */

interface MatchRecord {
  id: string
  date: string
  correct: number
  total: number
  score: number
  personaUsed?: string
}

const MOCK_HISTORY: MatchRecord[] = [
  { id: '1', date: '今天 14:20', correct: 4, total: 5, score: 35, personaUsed: '樱花' },
  { id: '2', date: '今天 11:05', correct: 2, total: 5, score: 15 },
  { id: '3', date: '昨天 22:30', correct: 5, total: 5, score: 50, personaUsed: '樱花' },
  { id: '4', date: '昨天 18:10', correct: 3, total: 5, score: 25 },
  { id: '5', date: '7月1日', correct: 4, total: 5, score: 40, personaUsed: '樱花' },
]

const LEADERBOARD = [
  { rank: 1, name: '侦探柯北', insight: 1250, deception: 980 },
  { rank: 2, name: '谎言终结者', insight: 1180, deception: 850 },
  { rank: 3, name: '你猜我是谁', insight: 1120, deception: 1200 },
  { rank: 4, name: 'AI猎人', insight: 1050, deception: 720 },
  { rank: 5, name: '面具大师', insight: 980, deception: 1150 },
]

export default function Profile() {
  const [activeTab, setActiveTab] = useState<'stats' | 'history' | 'rank'>('stats')

  const userStats = {
    insight: 847,
    deception: 632,
    gamesPlayed: 28,
    winRate: 68,
    personaDeceptionAvg: 72,
  }

  return (
    <div className="space-y-4">
      {/* User Card */}
      <div className="mask-card text-center">
        <div
          className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full text-2xl"
          style={{ background: 'var(--color-primary)' }}
        >
          🎭
        </div>
        <h2 className="text-lg font-bold">夜行者</h2>
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>@user_a1b2c3</p>
        <div className="mt-2">
          <span
            className="rounded-full px-3 py-1 text-xs"
            style={{ background: 'var(--color-primary)', color: 'white' }}
          >
            💎 Pro
          </span>
        </div>
      </div>

      {/* Dual Score - 评审核心：双分系统 */}
      <div className="mask-card">
        <h3 className="font-bold mb-3 text-center">双分系统</h3>
        <div className="grid grid-cols-2 gap-4">
          {/* 洞察力 */}
          <div className="text-center rounded-xl p-3" style={{ background: 'rgba(123,107,255,0.1)' }}>
            <p className="text-3xl font-bold" style={{ color: 'var(--color-primary)' }}>
              {userStats.insight}
            </p>
            <p className="text-sm font-medium">👁️ 洞察力</p>
            <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
              识别 AI 的准确率
            </p>
          </div>
          {/* 欺骗力 */}
          <div className="text-center rounded-xl p-3" style={{ background: 'rgba(255,107,157,0.1)' }}>
            <p className="text-3xl font-bold" style={{ color: 'var(--color-accent)' }}>
              {userStats.deception}
            </p>
            <p className="text-sm font-medium">🎭 欺骗力</p>
            <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
              面具骗过真人的频率
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="mask-card text-center p-2">
          <p className="text-xl font-bold">{userStats.gamesPlayed}</p>
          <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>总局数</p>
        </div>
        <div className="mask-card text-center p-2">
          <p className="text-xl font-bold">{userStats.winRate}%</p>
          <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>胜率</p>
        </div>
        <div className="mask-card text-center p-2">
          <p className="text-xl font-bold">{userStats.personaDeceptionAvg}%</p>
          <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>面具欺骗率</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {[
          { key: 'stats', label: '数据' },
          { key: 'history', label: '战绩' },
          { key: 'rank', label: '排行' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex-1 rounded-xl py-2 text-sm ${activeTab === tab.key ? 'mask-btn' : 'mask-btn-secondary'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Stats Tab */}
      {activeTab === 'stats' && (
        <div className="space-y-3">
          <div className="mask-card">
            <h4 className="font-bold mb-3 text-sm">洞察趋势（近7天）</h4>
            <div className="flex items-end gap-1 h-24">
              {[65, 72, 68, 80, 75, 85, 82].map((v, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-sm"
                    style={{
                      height: `${v * 0.8}px`,
                      background: i === 6 ? 'var(--color-primary)' : 'var(--color-surface-light)',
                    }}
                  />
                  <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                    {['一', '二', '三', '四', '五', '六', '日'][i]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mask-card">
            <h4 className="font-bold mb-3 text-sm">面具表现</h4>
            <div className="space-y-2">
              {[
                { name: '樱花', rate: 68, games: 42 },
              ].map((p) => (
                <div key={p.name} className="flex items-center justify-between rounded-lg p-2" style={{ background: 'var(--color-surface-light)' }}>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🎭</span>
                    <span className="text-sm">{p.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold" style={{ color: 'var(--color-accent)' }}>
                      {p.rate}%
                    </span>
                    <span className="text-xs ml-2" style={{ color: 'var(--color-text-muted)' }}>
                      {p.games}局
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="space-y-2">
          {MOCK_HISTORY.map((m) => (
            <div
              key={m.id}
              className="mask-card"
              style={{
                borderLeft: `3px solid ${m.score >= 30 ? '#6BCB77' : m.score >= 20 ? '#FECA57' : '#FF4757'}`,
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">
                    {m.correct}/{m.total} 正确
                    {m.personaUsed && (
                      <span className="ml-2 text-xs" style={{ color: 'var(--color-accent)' }}>
                        🎭 {m.personaUsed}
                      </span>
                    )}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                    {m.date}
                  </p>
                </div>
                <span
                  className="font-bold"
                  style={{ color: m.score >= 30 ? '#6BCB77' : '#FF6B9D' }}
                >
                  +{m.score}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Rank Tab */}
      {activeTab === 'rank' && (
        <div className="space-y-2">
          {LEADERBOARD.map((entry) => (
            <div
              key={entry.rank}
              className="flex items-center gap-3 rounded-xl p-3"
              style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderLeft: entry.rank <= 3 ? `3px solid ${entry.rank === 1 ? '#FFD93D' : entry.rank === 2 ? '#C0C0C0' : '#CD7F32'}` : undefined,
              }}
            >
              <span
                className="flex h-8 w-8 items-center justify-center rounded-full font-bold text-sm"
                style={{
                  background: entry.rank === 1 ? '#FFD93D' : entry.rank === 2 ? '#C0C0C0' : entry.rank === 3 ? '#CD7F32' : 'var(--color-surface-light)',
                  color: entry.rank <= 3 ? '#333' : 'var(--color-text)',
                }}
              >
                {entry.rank}
              </span>
              <div className="flex-1">
                <p className="text-sm font-medium">{entry.name}</p>
                <div className="flex gap-3 text-xs" style={{ color: 'var(--color-text-muted)' }}>
                  <span>👁️ {entry.insight}</span>
                  <span>🎭 {entry.deception}</span>
                </div>
              </div>
            </div>
          ))}

          {/* My Rank */}
          <div
            className="flex items-center gap-3 rounded-xl p-3 mt-3"
            style={{ border: '2px solid var(--color-primary)', background: 'rgba(123,107,255,0.05)' }}
          >
            <span
              className="flex h-8 w-8 items-center justify-center rounded-full font-bold text-sm"
              style={{ background: 'var(--color-primary)', color: 'white' }}
            >
              12
            </span>
            <div className="flex-1">
              <p className="text-sm font-medium">你（夜行者）</p>
              <div className="flex gap-3 text-xs" style={{ color: 'var(--color-text-muted)' }}>
                <span>👁️ {userStats.insight}</span>
                <span>🎭 {userStats.deception}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings */}
      <div className="mask-card">
        <h3 className="font-bold mb-3 text-sm">设置</h3>
        <div className="space-y-3">
          <button className="w-full text-left text-sm">📋 使用条款</button>
          <button className="w-full text-left text-sm">🔒 隐私政策</button>
          <button className="w-full text-left text-sm">🤖 AI 使用说明</button>
          <button className="w-full text-left text-sm">❓ 帮助与反馈</button>
          <button className="w-full text-left text-sm" style={{ color: '#FF4757' }}>
            🚪 退出登录
          </button>
        </div>
      </div>
    </div>
  )
}
