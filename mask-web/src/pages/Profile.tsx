import { useState } from 'react'

/**
 * Profile - 评审第二轮重构
 *
 * 改动：
 * 1. 欺骗力 → 伪装力（评审："欺骗"听起来像教人骗人）
 * 2. 加赛季/段位系统（留存火花塞）
 * 3. 加面具诊断建议
 * 4. 加每日主题挑战
 */

const SEASON_INFO = {
  name: 'S1 · 初见',
  endDate: '2026-08-01',
  daysLeft: 28,
  myRank: 12,
  totalPlayers: 3847,
}

const TIERS = [
  { name: '图灵学徒', min: 0, color: '#8888a0' },
  { name: '识破者', min: 200, color: '#6BCB77' },
  { name: '洞察之眼', min: 500, color: '#7c6bff' },
  { name: '图灵大师', min: 1000, color: '#FFD93D' },
  { name: '终极伪装者', min: 2000, color: '#FF6B9D' },
]

const getTier = (insight: number, disguise: number) => {
  const total = insight + disguise
  for (let i = TIERS.length - 1; i >= 0; i--) {
    if (total >= TIERS[i].min) return TIERS[i]
  }
  return TIERS[0]
}

const MOCK_HISTORY = [
  { id: '1', date: '今天 14:20', correct: 4, total: 5, score: 35, personaUsed: '樱花' },
  { id: '2', date: '今天 11:05', correct: 2, total: 5, score: 15 },
  { id: '3', date: '昨天 22:30', correct: 5, total: 5, score: 50, personaUsed: '樱花' },
  { id: '4', date: '昨天 18:10', correct: 3, total: 5, score: 25 },
  { id: '5', date: '7月1日', correct: 4, total: 5, score: 40, personaUsed: '樱花' },
]

const LEADERBOARD = [
  { rank: 1, name: '侦探柯北', insight: 1250, disguise: 980 },
  { rank: 2, name: '谎言终结者', insight: 1180, disguise: 850 },
  { rank: 3, name: '你猜我是谁', insight: 1120, disguise: 1200 },
  { rank: 4, name: 'AI猎人', insight: 1050, disguise: 720 },
  { rank: 5, name: '面具大师', insight: 980, disguise: 1150 },
]

export default function Profile() {
  const [activeTab, setActiveTab] = useState<'stats' | 'history' | 'rank'>('stats')

  const userStats = { insight: 847, disguise: 632, gamesPlayed: 28, winRate: 68 }
  const myTier = getTier(userStats.insight, userStats.disguise)
  const progress = ((userStats.insight + userStats.disguise - myTier.min) / 200) * 100

  return (
    <div className="space-y-4">
      {/* User Card */}
      <div className="mask-card text-center">
        <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full text-2xl" style={{ background: `linear-gradient(135deg, ${myTier.color}, var(--color-primary))` }}>🎭</div>
        <h2 className="text-lg font-bold">夜行者</h2>
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>@user_a1b2c3</p>
        <div className="mt-2 inline-flex items-center gap-2">
          <span className="rounded-full px-3 py-1 text-xs font-bold" style={{ background: myTier.color + '30', color: myTier.color, border: `1px solid ${myTier.color}` }}>{myTier.name}</span>
          <span className="rounded-full px-3 py-1 text-xs" style={{ background: 'var(--color-primary)', color: 'white' }}>💎 Pro</span>
        </div>
        {/* 段位进度 */}
        <div className="mt-3 mx-auto max-w-[200px]">
          <div className="h-2 w-full overflow-hidden rounded-full" style={{ background: 'var(--color-surface-light)' }}>
            <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(progress, 100)}%`, background: `linear-gradient(90deg, ${myTier.color}, var(--color-primary))` }} />
          </div>
          <p className="mt-1 text-xs" style={{ color: 'var(--color-text-muted)' }}>距离下一段位还需 {Math.max(0, 200 - (userStats.insight + userStats.disguise - myTier.min))} 分</p>
        </div>
      </div>

      {/* 赛季信息 */}
      <div className="mask-card">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-sm">🏆 {SEASON_INFO.name}</h3>
          <span className="text-xs rounded-full px-2 py-0.5" style={{ background: 'var(--color-accent)', color: 'white' }}>剩余 {SEASON_INFO.daysLeft} 天</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span style={{ color: 'var(--color-text-muted)' }}>我的排名</span>
          <span className="font-bold">#{SEASON_INFO.myRank} / {SEASON_INFO.totalPlayers} 人</span>
        </div>
      </div>

      {/* 双分系统 */}
      <div className="mask-card">
        <h3 className="font-bold mb-3 text-center">双分系统</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center rounded-xl p-3" style={{ background: 'rgba(123,107,255,0.1)' }}>
            <p className="text-3xl font-bold" style={{ color: 'var(--color-primary)' }}>{userStats.insight}</p>
            <p className="text-sm font-medium">👁️ 洞察力</p>
            <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>识别AI的准确率</p>
          </div>
          <div className="text-center rounded-xl p-3" style={{ background: 'rgba(255,107,157,0.1)' }}>
            <p className="text-3xl font-bold" style={{ color: 'var(--color-accent)' }}>{userStats.disguise}</p>
            <p className="text-sm font-medium">🎭 伪装力</p>
            <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>面具骗过真人的频率</p>
          </div>
        </div>
      </div>

      {/* 快捷数据 */}
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
          <p className="text-xl font-bold">68%</p>
          <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>面具伪装率</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {[{ key: 'stats', label: '数据' }, { key: 'history', label: '战绩' }, { key: 'rank', label: '排行' }].map((t) => (
          <button key={t.key} onClick={() => setActiveTab(t.key as any)} className={`flex-1 rounded-xl py-2 text-sm ${activeTab === t.key ? 'mask-btn' : 'mask-btn-secondary'}`}>{t.label}</button>
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
                  <div className="w-full rounded-sm" style={{ height: `${v * 0.8}px`, background: i === 6 ? 'var(--color-primary)' : 'var(--color-surface-light)' }} />
                  <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{['一', '二', '三', '四', '五', '六', '日'][i]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 每日主题挑战 */}
          <div className="mask-card" style={{ background: 'rgba(255,217,61,0.05)', border: '1px solid rgba(255,217,61,0.3)' }}>
            <h4 className="font-bold mb-2 text-sm">🎯 今日挑战</h4>
            <p className="text-sm mb-2">「不说人话」—— 在对局中全程用诗歌风格聊天，看看能不能骗过对手</p>
            <div className="flex items-center justify-between">
              <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>奖励：+50 伪装力</span>
              <span className="text-xs rounded-full px-2 py-0.5" style={{ background: 'var(--color-primary)', color: 'white' }}>进行中</span>
            </div>
          </div>

          {/* 段位表 */}
          <div className="mask-card">
            <h4 className="font-bold mb-2 text-sm">段位体系</h4>
            <div className="space-y-1">
              {TIERS.map((t) => (
                <div key={t.name} className="flex items-center gap-2 text-sm" style={{ opacity: userStats.insight + userStats.disguise >= t.min ? 1 : 0.4 }}>
                  <span className="h-2 w-2 rounded-full" style={{ background: t.color }} />
                  <span className="flex-1">{t.name}</span>
                  <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{t.min}+</span>
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
            <div key={m.id} className="mask-card" style={{ borderLeft: `3px solid ${m.score >= 30 ? '#6BCB77' : m.score >= 20 ? '#FECA57' : '#FF4757'}` }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{m.correct}/{m.total} 正确 {m.personaUsed && <span className="ml-1 text-xs" style={{ color: 'var(--color-accent)' }}>🎭 {m.personaUsed}</span>}</p>
                  <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{m.date}</p>
                </div>
                <span className="font-bold" style={{ color: m.score >= 30 ? '#6BCB77' : '#FF6B9D' }}>+{m.score}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Rank Tab */}
      {activeTab === 'rank' && (
        <div className="space-y-2">
          {LEADERBOARD.map((e) => (
            <div key={e.rank} className="flex items-center gap-3 rounded-xl p-3" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderLeft: e.rank <= 3 ? `3px solid ${e.rank === 1 ? '#FFD93D' : e.rank === 2 ? '#C0C0C0' : '#CD7F32'}` : undefined }}>
              <span className="flex h-8 w-8 items-center justify-center rounded-full font-bold text-sm" style={{ background: e.rank <= 3 ? (e.rank === 1 ? '#FFD93D' : e.rank === 2 ? '#C0C0C0' : '#CD7F32') : 'var(--color-surface-light)', color: e.rank <= 3 ? '#333' : 'var(--color-text)' }}>{e.rank}</span>
              <div className="flex-1">
                <p className="text-sm font-medium">{e.name}</p>
                <div className="flex gap-3 text-xs" style={{ color: 'var(--color-text-muted)' }}><span>👁️ {e.insight}</span><span>🎭 {e.disguise}</span></div>
              </div>
            </div>
          ))}
          {/* My Rank */}
          <div className="flex items-center gap-3 rounded-xl p-3 mt-3" style={{ border: '2px solid var(--color-primary)', background: 'rgba(123,107,255,0.05)' }}>
            <span className="flex h-8 w-8 items-center justify-center rounded-full font-bold text-sm" style={{ background: 'var(--color-primary)', color: 'white' }}>12</span>
            <div className="flex-1">
              <p className="text-sm font-medium">你（夜行者）</p>
              <div className="flex gap-3 text-xs" style={{ color: 'var(--color-text-muted)' }}><span>👁️ {userStats.insight}</span><span>🎭 {userStats.disguise}</span></div>
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
          <button className="w-full text-left text-sm">⚠️ 举报与反馈</button>
          <button className="w-full text-left text-sm" style={{ color: '#FF4757' }}>🚪 退出登录</button>
        </div>
      </div>
    </div>
  )
}
