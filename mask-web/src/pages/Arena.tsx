import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

/**
 * Arena - 图灵竞技场（评审后唯一核心页面）
 * 
 * 原 Game.tsx 的升级重构版：
 * - 从"一个功能模块"上升为"整个产品"
 * - 完整闭环：匹配 → 限时聊天 → 投票 → 结算 → 分享
 * - 双分系统：洞察力（识别准确率）+ 欺骗力（面具骗过率）
 * 
 * 评审核心要求：
 * ✅ 知情同意：用户明确知道在和 AI/真人混合对局
 * ✅ 游戏包装：不是"社交平台"，是"社交推理游戏"
 * ✅ 揭晓机制：每局结束必须揭晓谁是 AI
 * ✅ 分享机制：战绩卡病毒传播
 */

type GamePhase = 'idle' | 'matching' | 'chat' | 'voting' | 'result'

interface Opponent {
  publicId: string
  displayName: string
  isAi: boolean
  aiType?: '官方AI' | '玩家面具'
  messages: string[]
}

const MOCK_OPPONENTS: Opponent[] = [
  { publicId: '@op_7x2k', displayName: '旅行者', isAi: true, aiType: '官方AI', messages: ['你好！今天过得怎么样？', '哈哈我也觉得', '你是做什么工作的呀？'] },
  { publicId: '@op_m4p9', displayName: '深夜食堂', isAi: false, messages: ['嗨', '刚下班，累死了', '你呢'] },
  { publicId: '@op_n8v3', displayName: '星尘', isAi: true, aiType: '玩家面具', messages: ['你好呀～', '今天的天气真不错', '你喜欢音乐吗？'] },
  { publicId: '@op_b2q5', displayName: '无名氏', isAi: false, messages: ['...', '嗯', '还好'] },
  { publicId: '@op_z1w6', displayName: '浮游生物', isAi: true, aiType: '官方AI', messages: ['Hello!', 'What brings you here?', 'I am fine, thank you'] },
]

export default function Arena() {
  const navigate = useNavigate()
  const [phase, setPhase] = useState<GamePhase>('idle')
  const [round, setRound] = useState(0)
  const [currentOpponent, setCurrentOpponent] = useState<Opponent | null>(null)
  const [timeLeft, setTimeLeft] = useState(120)
  const [chatMessages, setChatMessages] = useState<{ from: 'me' | 'them'; text: string }[]>([])
  const [votes, setVotes] = useState<{ opponent: Opponent; guessedAi: boolean }[]>([])
  const [resultData, setResultData] = useState<{ insightGained: number; deceptionGained: number } | null>(null)
  const [input, setInput] = useState('')
  const [matchDots, setMatchDots] = useState(1)

  // 匹配动画
  useEffect(() => {
    if (phase === 'matching') {
      const timer = setInterval(() => setMatchDots((d) => (d % 3) + 1), 500)
      // 模拟匹配成功
      const matchTimer = setTimeout(() => {
        const opp = MOCK_OPPONENTS[round]
        setCurrentOpponent(opp)
        setChatMessages(opp.messages.map((m) => ({ from: 'them' as const, text: m })))
        setPhase('chat')
        setTimeLeft(120)
      }, 2500)
      return () => {
        clearInterval(timer)
        clearTimeout(matchTimer)
      }
    }
  }, [phase, round])

  // 倒计时
  useEffect(() => {
    if (phase === 'chat' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000)
      return () => clearTimeout(timer)
    } else if (phase === 'chat' && timeLeft <= 0) {
      setPhase('voting')
    }
  }, [phase, timeLeft])

  const handleSend = useCallback(() => {
    if (!input.trim() || phase !== 'chat') return
    setChatMessages((prev) => [...prev, { from: 'me', text: input }])
    setInput('')
  }, [input, phase])

  const handleVote = (guessedAi: boolean) => {
    if (!currentOpponent) return
    const newVotes = [...votes, { opponent: currentOpponent, guessedAi }]
    setVotes(newVotes)

    if (round < 4) {
      // 下一轮
      setRound((r) => r + 1)
      setChatMessages([])
      setCurrentOpponent(null)
      setPhase('matching')
    } else {
      // 结算
      const correct = newVotes.filter(
        (v) => v.guessedAi === v.opponent.isAi
      ).length
      const insightGained = correct * 10 - (5 - correct) * 5
      setResultData({
        insightGained: Math.max(0, insightGained),
        deceptionGained: 0, // TODO: 根据面具骗过率计算
      })
      setPhase('result')
    }
  }

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`

  // ====== 各阶段渲染 ======

  // 阶段 0: 待机页
  if (phase === 'idle') {
    return (
      <div className="space-y-4">
        {/* Hero */}
        <div className="mask-card text-center py-8">
          <p className="text-5xl mb-3">🎭</p>
          <h2 className="text-2xl font-bold mb-2">AI 图灵竞技场</h2>
          <p className="text-sm mb-6" style={{ color: 'var(--color-text-muted)' }}>
            5 轮匿名对局 · 猜谁是真人 · 造面具骗人
          </p>
          <div className="mb-6 space-y-1 text-sm" style={{ color: 'var(--color-text-muted)' }}>
            <p>👤 真人对手 + 🤖 AI 对手混合</p>
            <p>每轮限时 2 分钟对话</p>
            <p>猜对 +10 分 / 猜错 -5 分</p>
          </div>
          <button onClick={() => { setRound(0); setVotes([]); setPhase('matching') }} className="mask-btn px-8">
            开始对局
          </button>
          <p className="mt-3 text-xs" style={{ color: 'var(--color-text-muted)' }}>
            今日剩余 3 次免费对局
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="mask-card text-center p-3">
            <p className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>847</p>
            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>洞察力</p>
          </div>
          <div className="mask-card text-center p-3">
            <p className="text-2xl font-bold" style={{ color: 'var(--color-accent)' }}>632</p>
            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>欺骗力</p>
          </div>
        </div>

        {/* Recent Matches */}
        <div className="mask-card">
          <h3 className="font-bold mb-3">最近战绩</h3>
          <div className="space-y-2">
            {[
              { result: 'win', score: 35, date: '今天 14:20' },
              { result: 'lose', score: 15, date: '今天 11:05' },
              { result: 'win', score: 40, date: '昨天 22:30' },
            ].map((m, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg p-2" style={{ background: 'var(--color-surface-light)' }}>
                <div className="flex items-center gap-2">
                  <span className="text-lg">{m.result === 'win' ? '🏆' : '💔'}</span>
                  <span className="text-sm">{m.date}</span>
                </div>
                <span className={`font-bold text-sm ${m.result === 'win' ? '' : ''}`} style={{ color: m.result === 'win' ? '#6BCB77' : '#FF4757' }}>
                  {m.score > 0 ? '+' : ''}{m.score}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // 阶段 1: 匹配中
  if (phase === 'matching') {
    return (
      <div className="mask-card text-center py-16">
        <div
          className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-t-transparent"
          style={{ borderColor: 'var(--color-border)', borderTopColor: 'var(--color-primary)' }}
        />
        <p className="text-lg font-medium">正在匹配第 {round + 1}/5 轮</p>
        <p className="mt-2 text-sm" style={{ color: 'var(--color-text-muted)' }}>
          寻找匿名对手{'.'.repeat(matchDots)}
        </p>
        <p className="mt-4 text-xs" style={{ color: 'var(--color-text-muted)' }}>
          匹配池：真人 + 官方 AI + 玩家面具
        </p>
      </div>
    )
  }

  // 阶段 2: 限时聊天
  if (phase === 'chat' && currentOpponent) {
    return (
      <div className="flex h-[calc(100vh-140px)] flex-col">
        {/* 对手信息 + 倒计时 */}
        <div
          className="mb-3 flex items-center justify-between rounded-2xl p-3"
          style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full text-lg"
              style={{ background: 'var(--color-surface-light)' }}
            >
              ❓
            </div>
            <div>
              <p className="font-medium text-sm">{currentOpponent.displayName}</p>
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                {currentOpponent.publicId}
              </p>
            </div>
          </div>
          <div
            className="rounded-full px-3 py-1 text-sm font-bold"
            style={{
              background: timeLeft < 30 ? 'rgba(255,71,87,0.2)' : 'var(--color-surface-light)',
              color: timeLeft < 30 ? '#FF4757' : 'var(--color-text)',
            }}
          >
            ⏱️ {formatTime(timeLeft)}
          </div>
        </div>

        {/* 提示条 */}
        <div
          className="mb-3 rounded-xl px-3 py-2 text-center text-xs"
          style={{ background: 'rgba(155,143,255,0.1)', color: '#9B8FFF' }}
        >
          💡 提示：观察对方的说话风格、反应速度和话题连贯性
        </div>

        {/* 消息区 */}
        <div className="flex-1 space-y-3 overflow-y-auto pb-4">
          {chatMessages.map((msg, i) => (
            <div key={i} className={`flex ${msg.from === 'me' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2 ${msg.from === 'me' ? 'rounded-br-md' : 'rounded-bl-md'}`}
                style={{
                  background: msg.from === 'me' ? 'var(--color-primary)' : 'var(--color-surface-light)',
                }}
              >
                <p className="text-sm">{msg.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* 输入区 */}
        <div className="flex gap-2">
          <input
            className="mask-input flex-1"
            placeholder="试探对方..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button onClick={handleSend} className="mask-btn px-4">
            发送
          </button>
        </div>

        {/* 提前投票 */}
        <div className="mt-2 flex gap-2">
          <button onClick={() => handleVote(false)} className="mask-btn-secondary flex-1 py-2 text-sm">
            👤 这是真人
          </button>
          <button onClick={() => handleVote(true)} className="mask-btn-secondary flex-1 py-2 text-sm">
            🤖 这是 AI
          </button>
        </div>
      </div>
    )
  }

  // 阶段 3: 投票（倒计时结束自动进入）
  if (phase === 'voting' && currentOpponent) {
    return (
      <div className="mask-card text-center py-8">
        <p className="text-4xl mb-3">🤔</p>
        <h3 className="text-xl font-bold mb-2">时间到！</h3>
        <p className="mb-6 text-sm" style={{ color: 'var(--color-text-muted)' }}>
          第 {round + 1}/5 轮 · 你对 @{currentOpponent.displayName} 的判断是？
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => handleVote(false)}
            className="mask-btn px-6 py-3"
            style={{ background: '#6BCB77' }}
          >
            👤 真人
          </button>
          <button
            onClick={() => handleVote(true)}
            className="mask-btn px-6 py-3"
            style={{ background: '#FF6B9D' }}
          >
            🤖 AI
          </button>
        </div>
      </div>
    )
  }

  // 阶段 4: 结算 + 分享
  if (phase === 'result' && resultData) {
    const correctCount = votes.filter((v) => v.guessedAi === v.opponent.isAi).length

    return (
      <div className="space-y-4">
        {/* 战绩卡 */}
        <div
          className="mask-card text-center py-6"
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #252542 50%, #1a1a2e 100%)',
            border: `2px solid ${correctCount >= 3 ? '#6BCB77' : '#FF6B9D'}`,
          }}
        >
          <p className="text-4xl mb-2">{correctCount >= 3 ? '🏆' : '💪'}</p>
          <h3 className="text-2xl font-bold mb-1">
            {correctCount >= 4 ? '图灵大师' : correctCount >= 3 ? '洞察之眼' : '还需磨练'}
          </h3>
          <p className="text-sm mb-4" style={{ color: 'var(--color-text-muted)' }}>
            5 局猜中 {correctCount} 个
          </p>

          <div className="mb-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl p-3" style={{ background: 'rgba(123,107,255,0.15)' }}>
              <p className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>
                +{resultData.insightGained}
              </p>
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>洞察力</p>
            </div>
            <div className="rounded-xl p-3" style={{ background: 'rgba(255,107,157,0.15)' }}>
              <p className="text-2xl font-bold" style={{ color: 'var(--color-accent)' }}>
                +{resultData.deceptionGained}
              </p>
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>欺骗力</p>
            </div>
          </div>

          <button
            className="mask-btn px-6"
            onClick={() => {
              // TODO: 分享战绩卡
              alert('战绩卡已生成！可以分享到朋友圈/小红书')
            }}
          >
            📤 分享战绩卡
          </button>
        </div>

        {/* 逐轮揭晓 */}
        <div className="mask-card">
          <h3 className="font-bold mb-3">逐轮揭晓</h3>
          <div className="space-y-2">
            {votes.map((v, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-xl p-3"
                style={{ background: 'var(--color-surface-light)' }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{v.opponent.isAi ? '🤖' : '👤'}</span>
                  <div>
                    <p className="text-sm font-medium">{v.opponent.displayName}</p>
                    <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                      {v.opponent.isAi ? `${v.opponent.aiType}` : '真人玩家'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className="text-sm font-bold"
                    style={{ color: v.guessedAi === v.opponent.isAi ? '#6BCB77' : '#FF4757' }}
                  >
                    {v.guessedAi === v.opponent.isAi ? '✓' : '✗'}
                  </span>
                  <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                    你猜: {v.guessedAi ? 'AI' : '真人'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 操作 */}
        <div className="flex gap-3">
          <button onClick={() => { setRound(0); setVotes([]); setResultData(null); setPhase('idle') }} className="mask-btn-secondary flex-1">
            返回首页
          </button>
          <button
            onClick={() => { setRound(0); setVotes([]); setResultData(null); setPhase('matching') }}
            className="mask-btn flex-1"
          >
            再来一局
          </button>
        </div>
      </div>
    )
  }

  return null
}
