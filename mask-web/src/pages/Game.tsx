import { useState } from 'react'
import type { LeaderboardEntry } from '../types'

const mockLeaderboard: LeaderboardEntry[] = [
  { publicId: '@m7x9k2p4', nickname: '夜行者', insightScore: 850, deceptionScore: 720, rank: 1 },
  { publicId: '@bluefox42', nickname: '蓝色狐狸', insightScore: 780, deceptionScore: 650, rank: 2 },
  { publicId: '@nightowl88', nickname: '夜猫子', insightScore: 720, deceptionScore: 800, rank: 3 },
]

export default function Game() {
  const [gameState, setGameState] = useState<'idle' | 'matching' | 'playing' | 'voting'>('idle')

  return (
    <div>
      <h2 className="mb-4 text-lg font-bold">图灵测试</h2>

      {gameState === 'idle' && (
        <div className="mask-card text-center py-8">
          <p className="text-5xl mb-4">🎭</p>
          <h3 className="text-xl font-bold mb-2">你能分辨真假吗？</h3>
          <p className="mb-6 text-sm" style={{ color: 'var(--color-text-muted)' }}>
            与5个匿名对象对话，判断对方是真人还是AI
          </p>
          <div className="mb-6 space-y-2 text-sm" style={{ color: 'var(--color-text-muted)' }}>
            <p>🎯 猜中真人 +10分</p>
            <p>🤖 猜中AI +10分</p>
            <p>❌ 猜错 -5分</p>
          </div>
          <button onClick={() => setGameState('matching')} className="mask-btn">
            开始匹配
          </button>
        </div>
      )}

      {gameState === 'matching' && (
        <div className="mask-card text-center py-12">
          <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-t-transparent" style={{ borderColor: 'var(--color-primary)', borderTopColor: 'transparent' }} />
          <p className="text-lg font-medium">正在匹配对手...</p>
          <p className="mt-2 text-sm" style={{ color: 'var(--color-text-muted)' }}>寻找5个匿名对话对象</p>
          <button onClick={() => setGameState('playing')} className="mt-4 text-sm underline" style={{ color: 'var(--color-primary)' }}>
            [模拟: 匹配成功]
          </button>
        </div>
      )}

      {gameState === 'playing' && (
        <div className="mask-card">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm font-medium">轮次: 1/5</span>
            <span className="rounded-full px-3 py-1 text-sm" style={{ background: 'var(--color-accent)', color: 'white' }}>
              02:00
            </span>
          </div>
          <div className="mb-4 rounded-xl p-4 text-center" style={{ background: 'var(--color-surface-light)' }}>
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>正在与</p>
            <p className="my-2 text-xl font-bold">@mystery_01</p>
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>对话中...</p>
          </div>
          <div className="space-y-3">
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-2xl rounded-bl-md px-4 py-2" style={{ background: 'var(--color-surface-light)' }}>
                <p className="text-sm">你好！很高兴认识你。今天过得怎么样？</p>
              </div>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <input className="mask-input flex-1" placeholder="回复..." />
            <button className="mask-btn px-4">发送</button>
          </div>
          <button onClick={() => setGameState('voting')} className="mt-3 w-full text-center text-sm underline" style={{ color: 'var(--color-primary)' }}>
            [模拟: 进入投票]
          </button>
        </div>
      )}

      {gameState === 'voting' && (
        <div className="mask-card text-center py-6">
          <h3 className="text-xl font-bold mb-4">投票环节</h3>
          <p className="mb-6 text-sm" style={{ color: 'var(--color-text-muted)' }}>
            @mystery_01 是真人还是 AI？
          </p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => setGameState('idle')} className="mask-btn" style={{ background: '#6BCB77' }}>
              👤 真人
            </button>
            <button onClick={() => setGameState('idle')} className="mask-btn" style={{ background: '#FF6B9D' }}>
              🤖 AI
            </button>
          </div>
        </div>
      )}

      {/* Leaderboard */}
      <div className="mt-6">
        <h3 className="mb-3 font-bold">🏆 本周排行榜</h3>
        <div className="space-y-2">
          {mockLeaderboard.map((entry) => (
            <div key={entry.publicId} className="flex items-center gap-3 rounded-xl p-3" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
              <span className="flex h-8 w-8 items-center justify-center rounded-full font-bold" style={{ 
                background: entry.rank === 1 ? '#FFD93D' : entry.rank === 2 ? '#C0C0C0' : '#CD7F32',
                color: '#333'
              }}>
                {entry.rank}
              </span>
              <div className="flex-1">
                <p className="font-medium text-sm">{entry.nickname}</p>
                <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{entry.publicId}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">{entry.insightScore}</p>
                <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>洞察力</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
