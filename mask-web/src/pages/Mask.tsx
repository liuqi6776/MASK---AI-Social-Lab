import { useState } from 'react'

/**
 * Mask - 面具工坊 v2（评审第二轮重构）
 *
 * 🔴 核心改动：面具不再"替你打自己的局"
 * ──────────────────────────────────────
 * 评审：「面具替你发言」破坏核心循环——你看两个bot对话怎么测洞察力？
 *
 * v2 设计：
 * ┌─────────────────────────────────────────────────┐
 * │  面具 ONLY 参加「异步面具联赛」                   │
 * │  · 你离线时，面具被投进别人的对局池              │
 * │  · 在别人的主动侦探场中替你说骗话               │
 * │  · 事后你收到战报 + 聊天记录                    │
 * │  · 赚「伪装力」分                               │
 * │                                                  │
 * │  你自己的主动侦探场：你自己打字，面具不参与      │
 * │  · 赚「洞察力」分                               │
 * └─────────────────────────────────────────────────┘
 *
 * 留存火花塞（评审要求）：
 * · 面具战报：看面具骗过真人的聊天记录
 * · 面具诊断：被识破原因分析
 * · 伪装力排名：面具在所有玩家中的欺骗排名
 */

interface Persona {
  id: string
  name: string
  tags: string[]
  style: string
  backstory: string
  active: boolean
  disguiseRate: number // 伪装力（原欺骗力，评审建议改名）
  gamesPlayed: number
  disguiseRank: number // 面具伪装排名
}

const TAG_OPTIONS = ['温柔', '毒舌', '幽默', '文艺', '中二', '高冷', '元气', '腹黑', '治愈', '叛逆', '神秘', '可爱']
const STYLE_OPTIONS = ['简洁', '详尽', '诗意', '口语化', '正式', '随意', '幽默', '文艺']

const MOCK_PERSONAS: Persona[] = [
  {
    id: '1', name: '樱花', tags: ['温柔', '治愈', '文艺'], style: '诗意',
    backstory: '一个喜欢樱花和诗歌的少女，说话总是带着淡淡的忧伤',
    active: true, disguiseRate: 68, gamesPlayed: 42, disguiseRank: 23,
  },
]

/** 面具战报 */
const MOCK_REPORTS = [
  { id: '1', time: '10分钟前', result: 'success' as const, quote: '面具"樱花"："我觉得下雨天最适合听周杰伦了" —— 对方："哈哈确实！你也是杰迷吗？"', diagnosis: '情感共鸣+具体细节 → 成功' },
  { id: '2', time: '1小时前', result: 'fail' as const, quote: '面具"樱花"："是的，我也这么认为。" —— 对方："你是AI吧，回答太简短了"', diagnosis: '回答太短（<10字）→ 被识破' },
  { id: '3', time: '3小时前', result: 'success' as const, quote: '面具"樱花"："我刚看完《星际穿越》，哭死我了..." —— 对方："我也是！最后那段太感人了"', diagnosis: '个人经历+情绪表达 → 成功' },
  { id: '4', time: '昨天', result: 'fail' as const, quote: '面具"樱花"："根据相关资料显示..." —— 对方："这用词太AI了"', diagnosis: '用词过于正式 → 被识破' },
]

export default function Mask() {
  const [personas, setPersonas] = useState<Persona[]>(MOCK_PERSONAS)
  const [showCreate, setShowCreate] = useState(false)
  const [showReports, setShowReports] = useState(false)

  const toggleActive = (id: string) => {
    setPersonas((prev) => prev.map((p) => (p.id === id ? { ...p, active: !p.active } : p)))
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold">🎭 面具工坊</h2>
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
          创建 AI 面具 · 参加异步联赛 · 骗过真人玩家
        </p>
      </div>

      {/* 机制说明 */}
      <div className="rounded-xl p-3 text-xs" style={{ background: 'rgba(155,143,255,0.08)', border: '1px solid rgba(155,143,255,0.2)' }}>
        <p className="font-medium mb-1" style={{ color: '#9B8FFF' }}>💡 面具如何工作</p>
        <p>· 你的面具<strong style={{ color: 'var(--color-accent)' }}>不会</strong>替你打自己的对局（那由你自己来）</p>
        <p>· 面具只在你<strong>离线时</strong>被投进<strong>别人的对局池</strong></p>
        <p>· 在别人的主动侦探场中替你说骗话 → 赚「伪装力」分</p>
        <p>· 事后你收到<strong>战报 + 聊天记录</strong></p>
      </div>

      {/* Create Button */}
      <button onClick={() => setShowCreate(true)} disabled={personas.length >= 3} className="mask-btn w-full disabled:opacity-40">
        {personas.length >= 3 ? '面具槽位已满' : '+ 创建新面具'}
      </button>

      {/* Persona List */}
      <div className="space-y-3">
        {personas.map((p) => (
          <div key={p.id} className="mask-card" style={{ border: p.active ? '2px solid var(--color-primary)' : '1px solid var(--color-border)', opacity: p.active ? 1 : 0.6 }}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full text-xl font-bold" style={{ background: 'var(--color-primary)' }}>{p.name[0]}</div>
                <div>
                  <p className="font-bold">{p.name}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {p.tags.map((t) => <span key={t} className="rounded-full px-2 py-0.5 text-xs" style={{ background: 'var(--color-primary)', color: 'white' }}>{t}</span>)}
                  </div>
                </div>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input type="checkbox" checked={p.active} onChange={() => toggleActive(p.id)} className="sr-only peer" />
                <div className="h-6 w-11 rounded-full peer transition-all" style={{ background: p.active ? 'var(--color-primary)' : 'var(--color-surface-light)' }}>
                  <div className="h-5 w-5 rounded-full bg-white transition-all" style={{ transform: p.active ? 'translateX(22px)' : 'translateX(2px)', marginTop: '2px' }} />
                </div>
              </label>
            </div>

            <p className="text-sm mb-3" style={{ color: 'var(--color-text-muted)' }}>{p.backstory}</p>

            {/* 数据面板 */}
            <div className="grid grid-cols-3 gap-2 rounded-xl p-3" style={{ background: 'var(--color-surface-light)' }}>
              <div className="text-center">
                <p className="text-lg font-bold" style={{ color: 'var(--color-accent)' }}>{p.disguiseRate}%</p>
                <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>伪装力</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold">{p.gamesPlayed}</p>
                <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>参战</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold">#{p.disguiseRank}</p>
                <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>排名</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 战报入口 */}
      <button onClick={() => setShowReports(true)} className="mask-btn-secondary w-full flex items-center justify-center gap-2">
        📋 查看面具战报
      </button>

      {/* 面具诊断 */}
      <div className="mask-card" style={{ background: 'rgba(254,202,87,0.05)', border: '1px solid rgba(254,202,87,0.3)' }}>
        <h4 className="font-bold text-sm mb-2">🩺 面具诊断</h4>
        <p className="text-xs mb-2" style={{ color: 'var(--color-text-muted)' }}>常见被识破原因：</p>
        <ul className="space-y-1 text-xs" style={{ color: 'var(--color-text-muted)' }}>
          <li>· 回答太短（&lt;10字）→ 增加细节和情感</li>
          <li>· 反应太快（&lt;2秒）→ 自然思考延迟</li>
          <li>· 话题跳跃 → 保持上下文连贯</li>
          <li>· 过度礼貌/无情绪波动 → 加入口语化</li>
          <li>· 用词正式（"根据资料显示"）→ 口语替代</li>
        </ul>
      </div>

      {/* Create Modal */}
      {showCreate && <CreatePersonaModal onClose={() => setShowCreate(false)} onCreate={(p) => { setPersonas((prev) => [...prev, p]); setShowCreate(false) }} />}

      {/* Reports Modal */}
      {showReports && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center" style={{ background: 'rgba(0,0,0,0.7)' }} onClick={() => setShowReports(false)}>
          <div className="w-full max-w-lg rounded-t-3xl p-6 max-h-[90vh] overflow-y-auto" style={{ background: 'var(--color-surface)' }} onClick={(e) => e.stopPropagation()}>
            <div className="mx-auto mb-4 h-1 w-12 rounded-full" style={{ background: 'var(--color-border)' }} />
            <h3 className="text-lg font-bold mb-1">📋 面具战报</h3>
            <p className="text-sm mb-4" style={{ color: 'var(--color-text-muted)' }}>你的面具在别人对局中替你作战的记录</p>

            <div className="space-y-3">
              {MOCK_REPORTS.map((r) => (
                <div key={r.id} className="rounded-xl p-3" style={{ background: 'var(--color-surface-light)', borderLeft: `3px solid ${r.result === 'success' ? '#6BCB77' : '#FF4757'}` }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{r.time}</span>
                    <span className="text-xs font-bold" style={{ color: r.result === 'success' ? '#6BCB77' : '#FF4757' }}>{r.result === 'success' ? '✓ 骗过' : '✗ 被识破'}</span>
                  </div>
                  <p className="text-sm mb-2" style={{ fontStyle: 'italic' }}>"{r.quote}"</p>
                  <p className="text-xs" style={{ color: '#9B8FFF' }}>🩺 {r.diagnosis}</p>
                </div>
              ))}
            </div>

            <button onClick={() => setShowReports(false)} className="mask-btn w-full mt-4">关闭</button>
          </div>
        </div>
      )}
    </div>
  )
}

function CreatePersonaModal({ onClose, onCreate }: { onClose: () => void; onCreate: (p: any) => void }) {
  const [step, setStep] = useState(1)
  const [name, setName] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [style, setStyle] = useState('')
  const [backstory, setBackstory] = useState('')

  const toggleTag = (t: string) => {
    if (tags.includes(t)) setTags(tags.filter((x) => x !== t))
    else if (tags.length < 3) setTags([...tags, t])
  }

  const handleCreate = () => {
    onCreate({ id: Date.now().toString(), name, tags, style, backstory, active: true, disguiseRate: 0, gamesPlayed: 0, disguiseRank: 999 })
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center" style={{ background: 'rgba(0,0,0,0.7)' }} onClick={onClose}>
      <div className="w-full max-w-lg rounded-t-3xl p-6 max-h-[90vh] overflow-y-auto" style={{ background: 'var(--color-surface)' }} onClick={(e) => e.stopPropagation()}>
        <div className="mx-auto mb-4 h-1 w-12 rounded-full" style={{ background: 'var(--color-border)' }} />
        <h2 className="mb-1 text-lg font-bold">创建面具</h2>
        <p className="mb-4 text-sm" style={{ color: 'var(--color-text-muted)' }}>设计一个 AI 人格，在异步联赛中去骗别人</p>

        {step === 1 && (
          <>
            <label className="mb-2 block text-sm" style={{ color: 'var(--color-text-muted)' }}>面具名称</label>
            <input className="mask-input mb-4 w-full" placeholder="给它起个名字..." value={name} onChange={(e) => setName(e.target.value)} maxLength={12} />

            <label className="mb-2 block text-sm" style={{ color: 'var(--color-text-muted)' }}>性格标签（最多3个）</label>
            <div className="mb-4 flex flex-wrap gap-2">
              {TAG_OPTIONS.map((t) => (
                <button key={t} onClick={() => toggleTag(t)} className="rounded-full px-3 py-1.5 text-sm transition-all" style={{ background: tags.includes(t) ? 'var(--color-primary)' : 'var(--color-surface-light)', color: tags.includes(t) ? 'white' : 'var(--color-text)' }}>{t}</button>
              ))}
            </div>
            <button onClick={() => setStep(2)} className="mask-btn w-full" disabled={!name || tags.length === 0}>下一步</button>
          </>
        )}

        {step === 2 && (
          <>
            <label className="mb-2 block text-sm" style={{ color: 'var(--color-text-muted)' }}>说话风格</label>
            <div className="mb-4 grid grid-cols-2 gap-2">
              {STYLE_OPTIONS.map((s) => (
                <button key={s} onClick={() => setStyle(s)} className="rounded-xl p-3 text-sm text-left transition-all" style={{ background: style === s ? 'var(--color-primary)' : 'var(--color-surface-light)', color: style === s ? 'white' : 'var(--color-text)' }}>{s}</button>
              ))}
            </div>

            <label className="mb-2 block text-sm" style={{ color: 'var(--color-text-muted)' }}>背景故事（帮助面具更真实，会经过内容审核）</label>
            <textarea className="mask-input mb-4 w-full resize-none" rows={3} placeholder="例如：一个刚毕业的程序员，喜欢猫和咖啡..." value={backstory} onChange={(e) => setBackstory(e.target.value)} maxLength={200} />

            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="mask-btn-secondary flex-1">上一步</button>
              <button onClick={handleCreate} className="mask-btn flex-1" disabled={!style}>创建面具</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
