import { useState, useEffect, useCallback } from 'react'

/**
 * Arena - 图灵竞技场 v2（评审第二轮重构）
 *
 * 🔴 核心改动：面具机制拆分
 * ──────────────────────────────────────
 * 评审问题：「面具替你发言」破坏核心循环——你看两个bot对话怎么测洞察力？
 *
 * 新设计（两模型一致解法）：
 * ┌─────────────────────────────────────────────────┐
 * │  模式A：主动侦探场（Live Arena）                  │
 * │  · 你自己打字、自己猜                             │
 * │  · 你的面具绝不替你打自己的局                      │
 * │  · 赚「洞察力」分（识别AI的准确率）                │
 * ├─────────────────────────────────────────────────┤
 * │  模式B：异步面具联赛（Async Mask League）          │
 * │  · 你离线时，面具被投进别人的对局池                 │
 * │  · 替你赚「伪装力」分（骗过真人的频率）             │
 * │  · 事后你收到战报 + 聊天记录                       │
 * └─────────────────────────────────────────────────┘
 */

type Phase = 'idle' | 'matching' | 'chat' | 'voting' | 'result'
type ArenaMode = 'none' | 'live' // 当前选择的模式

interface Opponent {
  displayName: string
  isAi: boolean
  aiType?: string
  messages: string[]
}

const MOCK_OPPONENTS: Opponent[] = [
  { displayName: '旅行者', isAi: true, aiType: '官方AI', messages: ['你好！今天过得怎么样？', '哈哈我也觉得', '你是做什么的呀？'] },
  { displayName: '深夜食堂', isAi: false, messages: ['嗨', '刚下班累死了', '你呢'] },
  { displayName: '星尘', isAi: true, aiType: '玩家面具', messages: ['你好呀～', '今天天气不错', '你喜欢音乐吗？'] },
  { displayName: '无名氏', isAi: false, messages: ['...', '嗯', '还好'] },
  { displayName: '浮游生物', isAi: true, aiType: '官方AI', messages: ['Hello!', 'What brings you here?'] },
]

/** 面具战报数据（Async Mask League 产出） */
const MOCK_MASK_REPORTS = [
  { id: '1', time: '10分钟前', opponent: '某个玩家', result: 'success', quote: '面具"樱花"："我觉得下雨天最适合听周杰伦了" —— 对方回复："哈哈确实！你也是杰迷吗？"', reason: '对方误判为真人' },
  { id: '2', time: '1小时前', opponent: '某个玩家', result: 'fail', quote: '面具"樱花"："是的，我也这么认为。" —— 对方回复："你是AI吧，回答太简短了"', reason: '被识破：回答太短' },
  { id: '3', time: '3小时前', opponent: '某个玩家', result: 'success', quote: '面具"樱花"："我刚看完《星际穿越》，哭死我了..." —— 对方回复："我也是！最后那段太感人了"', reason: '对方误判为真人' },
]

export default function Arena() {
  const [phase, setPhase] = useState<Phase>('idle')
  const [round, setRound] = useState(0)
  const [currentOpponent, setCurrentOpponent] = useState<Opponent | null>(null)
  const [timeLeft, setTimeLeft] = useState(120)
  const [chatMessages, setChatMessages] = useState<{ from: 'me' | 'them'; text: string }[]>([])
  const [votes, setVotes] = useState<{ opponent: Opponent; guessedAi: boolean }[]>([])
  const [resultData, setResultData] = useState<{ insightGained: number; gamesPlayed: number } | null>(null)
  const [input, setInput] = useState('')
  const [showReports, setShowReports] = useState(false)

  // 倒计时
  useEffect(() => {
    if (phase === 'chat' && timeLeft > 0) {
      const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000)
      return () => clearTimeout(t)
    } else if (phase === 'chat' && timeLeft <= 0) {
      setPhase('voting')
    }
  }, [phase, timeLeft])

  // 匹配动画
  useEffect(() => {
    if (phase === 'matching') {
      const t = setTimeout(() => {
        const opp = MOCK_OPPONENTS[round]
        setCurrentOpponent(opp)
        setChatMessages(opp.messages.map((m) => ({ from: 'them' as const, text: m })))
        setPhase('chat')
        setTimeLeft(120)
      }, 2000)
      return () => clearTimeout(t)
    }
  }, [phase, round])

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
      setRound((r) => r + 1)
      setChatMessages([])
      setCurrentOpponent(null)
      setPhase('matching')
    } else {
      const correct = newVotes.filter((v) => v.guessedAi === v.opponent.isAi).length
      setResultData({ insightGained: correct * 10, gamesPlayed: 1 })
      setPhase('result')
    }
  }

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`

  // ======== 阶段 0: 待机页（模式选择） ========
  if (phase === 'idle' && !showReports) {
    return (
      <div className="space-y-4">
        {/* Hero */}
        <div className="mask-card text-center py-6">
          <p className="text-5xl mb-2">🎭</p>
          <h2 className="text-2xl font-bold mb-1">AI 图灵竞技场</h2>
          <p className="text-sm mb-4" style={{ color: 'var(--color-text-muted)' }}>
            5轮匿名对局 · 识破AI · 面具联赛
          </p>

          {/* 今日额度 */}
          <div className="mb-4 rounded-xl p-2 text-xs inline-block" style={{ background: 'var(--color-surface-light)', color: 'var(--color-text-muted)' }}>
            今日剩余 3 次免费对局
          </div>

          {/* 模式A：主动侦探场 */}
          <div className="mb-3 text-left rounded-xl p-4" style={{ background: 'rgba(123,107,255,0.08)', border: '1px solid rgba(123,107,255,0.3)' }}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">👁️</span>
              <h3 className="font-bold">主动侦探场</h3>
            </div>
            <p className="text-sm mb-3" style={{ color: 'var(--color-text-muted)' }}>
              你自己和匿名对手聊天，判断对方是真人还是AI。
              <strong style={{ color: 'var(--color-primary)' }}>赚「洞察力」分。</strong>
            </p>
            <button
              onClick={() => { setRound(0); setVotes([]); setPhase('matching') }}
              className="mask-btn w-full"
            >
              开始对局（你自己打）
            </button>
          </div>

          {/* 模式B：异步面具联赛 */}
          <div className="text-left rounded-xl p-4" style={{ background: 'rgba(255,107,157,0.08)', border: '1px solid rgba(255,107,157,0.3)' }}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">🎭</span>
              <h3 className="font-bold">异步面具联赛</h3>
            </div>
            <p className="text-sm mb-3" style={{ color: 'var(--color-text-muted)' }}>
              你的面具在别人对局中替你说，骗过真人。
              <strong style={{ color: 'var(--color-accent)' }}>赚「伪装力」分。</strong>
              战报稍后推送。
            </p>
            <button
              onClick={() => setShowReports(true)}
              className="mask-btn-secondary w-full"
            >
              查看面具战报
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="mask-card text-center p-3">
            <p className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>847</p>
            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>👁️ 洞察力</p>
          </div>
          <div className="mask-card text-center p-3">
            <p className="text-2xl font-bold" style={{ color: 'var(--color-accent)' }}>632</p>
            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>🎭 伪装力</p>
          </div>
        </div>
      </div>
    )
  }

  // ======== 面具战报表 ========
  if (showReports) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <button onClick={() => setShowReports(false)} className="text-lg" style={{ color: 'var(--color-primary)' }}>←</button>
          <h2 className="text-lg font-bold">🎭 面具战报</h2>
        </div>
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
          你的面具在别人的对局中替你作战的记录
        </p>

        {MOCK_MASK_REPORTS.map((r) => (
          <div key={r.id} className="mask-card" style={{ borderLeft: `3px solid ${r.result === 'success' ? '#6BCB77' : '#FF4757'}` }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{r.time}</span>
              <span className={`text-xs font-bold ${r.result === 'success' ? '' : ''}`} style={{ color: r.result === 'success' ? '#6BCB77' : '#FF4757' }}>
                {r.result === 'success' ? '✓ 骗过' : '✗ 被识破'}
              </span>
            </div>
            <p className="text-sm mb-2" style={{ fontStyle: 'italic' }}>"{r.quote}"</p>
            <div className="rounded-lg p-2 text-xs" style={{ background: 'var(--color-surface-light)' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>诊断：</span>{r.reason}
            </div>
          </div>
        ))}

        {/* 面具诊断建议 */}
        <div className="mask-card" style={{ background: 'rgba(254,202,87,0.05)', border: '1px solid rgba(254,202,87,0.3)' }}>
          <h4 className="font-bold text-sm mb-2">💡 面具诊断建议</h4>
          <ul className="space-y-1 text-xs" style={{ color: 'var(--color-text-muted)' }}>
            <li>· 回答太短容易被识破 → 适当增加细节</li>
            <li>· 反应太快（&lt;2秒）会暴露 → 添加思考延迟</li>
            <li>· 话题跳跃太大不自然 → 保持上下文连贯</li>
            <li>· 过度礼貌/没有情绪波动 → 加入口语化表达</li>
          </ul>
        </div>

        <button onClick={() => setShowReports(false)} className="mask-btn w-full">
          返回竞技场
        </button>
      </div>
    )
  }

  // ======== 阶段 1-4: 主动侦探场（你自己打） ========

  if (phase === 'matching') {
    return (
      <div className="mask-card text-center py-16">
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-t-transparent" style={{ borderColor: 'var(--color-border)', borderTopColor: 'var(--color-primary)' }} />
        <p className="text-lg font-medium">正在匹配第 {round + 1}/5 轮</p>
        <p className="mt-2 text-sm" style={{ color: 'var(--color-text-muted)' }}>寻找匿名对手...</p>
        <p className="mt-2 text-xs" style={{ color: 'var(--color-text-muted)' }}>匹配池：真人 + 官方AI + 玩家面具</p>
      </div>
    )
  }

  if (phase === 'chat' && currentOpponent) {
    return (
      <div className="flex h-[calc(100vh-140px)] flex-col">
        {/* 头部：对手 + 倒计时 */}
        <div className="mb-3 flex items-center justify-between rounded-2xl p-3" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full text-lg" style={{ background: 'var(--color-surface-light)' }}>❓</div>
            <div>
              <p className="font-medium text-sm">{currentOpponent.displayName}</p>
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>第 {round + 1}/5 轮</p>
            </div>
          </div>
          <div className="rounded-full px-3 py-1 text-sm font-bold" style={{ background: timeLeft < 30 ? 'rgba(255,71,87,0.2)' : 'var(--color-surface-light)', color: timeLeft < 30 ? '#FF4757' : 'var(--color-text)' }}>
            ⏱️ {formatTime(timeLeft)}
          </div>
        </div>

        {/* 提示 */}
        <div className="mb-3 rounded-xl px-3 py-2 text-center text-xs" style={{ background: 'rgba(155,143,255,0.1)', color: '#9B8FFF' }}>
          💡 观察说话风格、反应速度、话题连贯性
        </div>

        {/* 消息 */}
        <div className="flex-1 space-y-3 overflow-y-auto pb-4">
          {chatMessages.map((msg, i) => (
            <div key={i} className={`flex ${msg.from === 'me' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${msg.from === 'me' ? 'rounded-br-md' : 'rounded-bl-md'}`} style={{ background: msg.from === 'me' ? 'var(--color-primary)' : 'var(--color-surface-light)' }}>
                <p className="text-sm">{msg.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* 输入 */}
        <div className="flex gap-2">
          <input className="mask-input flex-1" placeholder="试探对方..." value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} />
          <button onClick={handleSend} className="mask-btn px-4">发送</button>
        </div>

        {/* 投票 */}
        <div className="mt-2 flex gap-2">
          <button onClick={() => handleVote(false)} className="mask-btn-secondary flex-1 py-2 text-sm">👤 真人</button>
          <button onClick={() => handleVote(true)} className="mask-btn-secondary flex-1 py-2 text-sm">🤖 AI</button>
        </div>
      </div>
    )
  }

  if (phase === 'voting' && currentOpponent) {
    return (
      <div className="mask-card text-center py-8">
        <p className="text-4xl mb-3">🤔</p>
        <h3 className="text-xl font-bold mb-2">时间到！</h3>
        <p className="mb-6 text-sm" style={{ color: 'var(--color-text-muted)' }}>第 {round + 1}/5 轮 · 你对 @{currentOpponent.displayName} 的判断是？</p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => handleVote(false)} className="mask-btn px-6 py-3" style={{ background: '#6BCB77' }}>👤 真人</button>
          <button onClick={() => handleVote(true)} className="mask-btn px-6 py-3" style={{ background: '#FF6B9D' }}>🤖 AI</button>
        </div>
      </div>
    )
  }

  if (phase === 'result' && resultData) {
    const correctCount = votes.filter((v) => v.guessedAi === v.opponent.isAi).length
    return (
      <div className="space-y-4">
        {/* 战绩卡 */}
        <div className="mask-card text-center py-6" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #252542 50%, #1a1a2e 100%)', border: `2px solid ${correctCount >= 3 ? '#6BCB77' : '#FF6B9D'}` }}>
          <p className="text-4xl mb-2">{correctCount >= 3 ? '🏆' : '💪'}</p>
          <h3 className="text-2xl font-bold mb-1">{correctCount >= 4 ? '图灵大师' : correctCount >= 3 ? '洞察之眼' : '还需磨练'}</h3>
          <p className="text-sm mb-4" style={{ color: 'var(--color-text-muted)' }}>5 局猜中 {correctCount} 个</p>

          <div className="mb-4 rounded-xl p-3 inline-block" style={{ background: 'rgba(123,107,255,0.15)' }}>
            <p className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>+{resultData.insightGained}</p>
            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>👁️ 洞察力</p>
          </div>

          <div>
            <button className="mask-btn px-6" onClick={() => alert('战绩卡已生成！')}>📤 分享战绩卡</button>
          </div>
        </div>

        {/* 逐轮揭晓 */}
        <div className="mask-card">
          <h3 className="font-bold mb-3">逐轮揭晓</h3>
          <div className="space-y-2">
            {votes.map((v, i) => (
              <div key={i} className="flex items-center justify-between rounded-xl p-3" style={{ background: 'var(--color-surface-light)' }}>
                <div className="flex items-center gap-3">
                  <span className="text-lg">{v.opponent.isAi ? '🤖' : '👤'}</span>
                  <div>
                    <p className="text-sm font-medium">{v.opponent.displayName}</p>
                    <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{v.opponent.isAi ? v.opponent.aiType : '真人玩家'}</p>
                  </div>
                </div>
                <span className="text-sm font-bold" style={{ color: v.guessedAi === v.opponent.isAi ? '#6BCB77' : '#FF4757' }}>{v.guessedAi === v.opponent.isAi ? '✓' : '✗'}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={() => { setRound(0); setVotes([]); setResultData(null); setPhase('idle') }} className="mask-btn-secondary flex-1">返回</button>
          <button onClick={() => { setRound(0); setVotes([]); setResultData(null); setPhase('matching') }} className="mask-btn flex-1">再来一局</button>
        </div>
      </div>
    )
  }

  return null
}
