import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

/**
 * Mask - 面具工坊（评审重构版）
 * 
 * 原 Lab.tsx 降级重构：
 * - 从"AI角色互动实验平台" → "创建游戏用面具 persona"
 * - 砍掉：向量记忆(Pinecone)、亲密度养成、AI克隆、AI竞技场
 * - 保留：persona创建（名字/性格/风格/背景）作为游戏道具
 * - 新增：面具欺骗率统计、在局中使用开关
 * 
 * 评审要求："降级为游戏道具：造一个'面具persona'进游戏"
 */

interface Persona {
  id: string
  name: string
  tags: string[]
  style: string
  backstory: string
  active: boolean
  deceptionRate: number // 骗过真人的比例
  gamesPlayed: number
}

const STYLE_OPTIONS = ['简洁', '详尽', '诗意', '口语化', '正式', '随意', '幽默', '文艺']

const TAG_OPTIONS = [
  '温柔', '毒舌', '幽默', '文艺', '中二', '高冷',
  '元气', '腹黑', '治愈', '叛逆', '神秘', '可爱',
]

const MOCK_PERSONAS: Persona[] = [
  {
    id: '1',
    name: '樱花',
    tags: ['温柔', '治愈', '文艺'],
    style: '诗意',
    backstory: '一个喜欢樱花和诗歌的少女，说话总是带着淡淡的忧伤',
    active: true,
    deceptionRate: 68,
    gamesPlayed: 42,
  },
]

export default function Mask() {
  const navigate = useNavigate()
  const [personas, setPersonas] = useState<Persona[]>(MOCK_PERSONAS)
  const [showCreate, setShowCreate] = useState(false)

  const toggleActive = (id: string) => {
    setPersonas((prev) =>
      prev.map((p) => (p.id === id ? { ...p, active: !p.active } : p))
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold">🎭 面具工坊</h2>
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
          创建一个 AI 面具，让它替你参加对局——目标是骗过真人玩家
        </p>
      </div>

      {/* Create Button */}
      <button
        onClick={() => setShowCreate(true)}
        disabled={personas.length >= 3}
        className="mask-btn w-full disabled:opacity-40"
      >
        {personas.length >= 3 ? '面具槽位已满（解锁更多需升级）' : '+ 创建新面具'}
      </button>

      {/* Persona List */}
      <div className="space-y-3">
        {personas.map((p) => (
          <div
            key={p.id}
            className="mask-card"
            style={{
              border: p.active ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
              opacity: p.active ? 1 : 0.6,
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-full text-xl font-bold"
                  style={{ background: 'var(--color-primary)' }}
                >
                  {p.name[0]}
                </div>
                <div>
                  <p className="font-bold">{p.name}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {p.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full px-2 py-0.5 text-xs"
                        style={{ background: 'var(--color-primary)', color: 'white' }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  checked={p.active}
                  onChange={() => toggleActive(p.id)}
                  className="sr-only peer"
                />
                <div
                  className="h-6 w-11 rounded-full peer transition-all"
                  style={{
                    background: p.active ? 'var(--color-primary)' : 'var(--color-surface-light)',
                  }}
                >
                  <div
                    className="h-5 w-5 rounded-full bg-white transition-all"
                    style={{ transform: p.active ? 'translateX(22px)' : 'translateX(2px)', marginTop: '2px' }}
                  />
                </div>
              </label>
            </div>

            <p className="text-sm mb-3" style={{ color: 'var(--color-text-muted)' }}>
              {p.backstory}
            </p>

            <div className="flex items-center justify-between rounded-xl p-3" style={{ background: 'var(--color-surface-light)' }}>
              <div>
                <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>欺骗率</p>
                <p className="text-lg font-bold" style={{ color: 'var(--color-accent)' }}>
                  {p.deceptionRate}%
                </p>
              </div>
              <div>
                <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>参战次数</p>
                <p className="text-lg font-bold">{p.gamesPlayed}</p>
              </div>
              <div>
                <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>风格</p>
                <p className="text-sm font-medium">{p.style}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {personas.length === 0 && (
        <div className="mask-card text-center py-12" style={{ color: 'var(--color-text-muted)' }}>
          <p className="text-4xl mb-3">🎭</p>
          <p className="mb-2">还没有面具</p>
          <p className="text-sm mb-4">创建一个 AI 面具，让它替你参加对局</p>
          <button onClick={() => setShowCreate(true)} className="mask-btn">
            创建第一个面具
          </button>
        </div>
      )}

      {/* 说明 */}
      <div className="rounded-xl p-3 text-xs" style={{ background: 'var(--color-surface-light)', color: 'var(--color-text-muted)' }}>
        <p>💡 面具说明：</p>
        <p>· 激活的面具会在你对局时代替你发言</p>
        <p>· 面具的欺骗率 = 骗过真人玩家的比例</p>
        <p>· 免费用户最多 1 个面具，Pro 用户最多 3 个</p>
      </div>

      {/* Create Modal */}
      {showCreate && (
        <CreatePersonaModal
          onClose={() => setShowCreate(false)}
          onCreate={(persona) => {
            setPersonas((prev) => [...prev, persona])
            setShowCreate(false)
          }}
        />
      )}
    </div>
  )
}

function CreatePersonaModal({
  onClose,
  onCreate,
}: {
  onClose: () => void
  onCreate: (p: Persona) => void
}) {
  const [step, setStep] = useState(1)
  const [name, setName] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [style, setStyle] = useState('')
  const [backstory, setBackstory] = useState('')

  const toggleTag = (t: string) => {
    if (tags.includes(t)) {
      setTags(tags.filter((x) => x !== t))
    } else if (tags.length < 3) {
      setTags([...tags, t])
    }
  }

  const handleCreate = () => {
    onCreate({
      id: Date.now().toString(),
      name,
      tags,
      style,
      backstory,
      active: true,
      deceptionRate: 0,
      gamesPlayed: 0,
    })
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center"
      style={{ background: 'rgba(0,0,0,0.7)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-t-3xl p-6 max-h-[90vh] overflow-y-auto"
        style={{ background: 'var(--color-surface)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-4 h-1 w-12 rounded-full" style={{ background: 'var(--color-border)' }} />
        <h2 className="mb-4 text-lg font-bold">创建面具</h2>
        <p className="mb-4 text-sm" style={{ color: 'var(--color-text-muted)' }}>
          设计一个 AI 人格，让它在图灵竞技场中代替你
        </p>

        {step === 1 && (
          <>
            <label className="mb-2 block text-sm" style={{ color: 'var(--color-text-muted)' }}>
              面具名称
            </label>
            <input
              className="mask-input mb-4 w-full"
              placeholder="给它起个名字..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={12}
            />

            <label className="mb-2 block text-sm" style={{ color: 'var(--color-text-muted)' }}>
              性格标签（最多3个）
            </label>
            <div className="mb-4 flex flex-wrap gap-2">
              {TAG_OPTIONS.map((t) => (
                <button
                  key={t}
                  onClick={() => toggleTag(t)}
                  className="rounded-full px-3 py-1.5 text-sm transition-all"
                  style={{
                    background: tags.includes(t) ? 'var(--color-primary)' : 'var(--color-surface-light)',
                    color: tags.includes(t) ? 'white' : 'var(--color-text)',
                  }}
                >
                  {t}
                </button>
              ))}
            </div>

            <button onClick={() => setStep(2)} className="mask-btn w-full" disabled={!name || tags.length === 0}>
              下一步
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <label className="mb-2 block text-sm" style={{ color: 'var(--color-text-muted)' }}>
              说话风格
            </label>
            <div className="mb-4 grid grid-cols-2 gap-2">
              {STYLE_OPTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => setStyle(s)}
                  className="rounded-xl p-3 text-sm text-left transition-all"
                  style={{
                    background: style === s ? 'var(--color-primary)' : 'var(--color-surface-light)',
                    color: style === s ? 'white' : 'var(--color-text)',
                  }}
                >
                  {s}
                </button>
              ))}
            </div>

            <label className="mb-2 block text-sm" style={{ color: 'var(--color-text-muted)' }}>
              背景故事（可选，帮助面具更真实）
            </label>
            <textarea
              className="mask-input mb-4 w-full resize-none"
              rows={3}
              placeholder="例如：一个刚毕业的程序员，喜欢猫和咖啡..."
              value={backstory}
              onChange={(e) => setBackstory(e.target.value)}
              maxLength={200}
            />

            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="mask-btn-secondary flex-1">
                上一步
              </button>
              <button onClick={handleCreate} className="mask-btn flex-1" disabled={!style}>
                创建面具
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
