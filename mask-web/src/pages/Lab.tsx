import { useState } from 'react'
import type { AiCharacter } from '../types'

const mockCharacters: AiCharacter[] = [
  {
    id: '1',
    publicId: '@ai_sakura01',
    ownerId: 'me',
    name: '樱花',
    personality: ['温柔', '治愈', '文艺'],
    style: '诗意',
    backstory: '一个喜欢樱花和诗歌的少女',
    status: 'active',
    intimacy: 65,
    createdAt: '2026-06-01',
  },
]

const personalityOptions = [
  '温柔', '毒舌', '幽默', '文艺', '中二', '高冷',
  '元气', '腹黑', '治愈', '叛逆', '神秘', '可爱',
]

export default function Lab() {
  const [characters, setCharacters] = useState(mockCharacters)
  const [showCreate, setShowCreate] = useState(false)

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold">AI 角色工坊</h2>
        <button onClick={() => setShowCreate(true)} className="mask-btn text-sm py-2 px-3">
          + 创建角色
        </button>
      </div>

      {/* Character List */}
      <div className="space-y-3">
        {characters.map((char) => (
          <div key={char.id} className="mask-card">
            <div className="flex items-center gap-3">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-full text-2xl"
                style={{ background: 'var(--color-primary)' }}
              >
                {char.name[0]}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{char.name}</span>
                  <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{char.publicId}</span>
                </div>
                <div className="mt-1 flex flex-wrap gap-1">
                  {char.personality.map((p) => (
                    <span
                      key={p}
                      className="rounded-full px-2 py-0.5 text-xs"
                      style={{ background: 'var(--color-primary)', color: 'white' }}
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                亲密度: {char.intimacy}/100
              </span>
              <div className="h-2 w-24 overflow-hidden rounded-full" style={{ background: 'var(--color-surface-light)' }}>
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${char.intimacy}%`, background: 'var(--color-primary)' }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {characters.length === 0 && (
        <div className="py-12 text-center" style={{ color: 'var(--color-text-muted)' }}>
          <p className="text-4xl mb-2">🔬</p>
          <p>还没有创建AI角色</p>
          <button onClick={() => setShowCreate(true)} className="mt-3 mask-btn text-sm">
            创建第一个角色
          </button>
        </div>
      )}

      {/* Create Modal */}
      {showCreate && <CreateCharacterModal onClose={() => setShowCreate(false)} />}
    </div>
  )
}

function CreateCharacterModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1)
  const [name, setName] = useState('')
  const [selectedPersonalities, setSelectedPersonalities] = useState<string[]>([])
  const [style, setStyle] = useState('')

  const togglePersonality = (p: string) => {
    if (selectedPersonalities.includes(p)) {
      setSelectedPersonalities(selectedPersonalities.filter((x) => x !== p))
    } else if (selectedPersonalities.length < 5) {
      setSelectedPersonalities([...selectedPersonalities, p])
    }
  }

  const handleCreate = () => {
    // TODO: API call
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center" style={{ background: 'rgba(0,0,0,0.7)' }} onClick={onClose}>
      <div className="w-full max-w-lg rounded-t-3xl p-6 max-h-[90vh] overflow-y-auto" style={{ background: 'var(--color-surface)' }} onClick={(e) => e.stopPropagation()}>
        <div className="mx-auto mb-4 h-1 w-12 rounded-full" style={{ background: 'var(--color-border)' }} />
        <h2 className="mb-4 text-lg font-bold">创建AI角色</h2>

        {step === 1 && (
          <>
            <label className="mb-2 block text-sm" style={{ color: 'var(--color-text-muted)' }}>角色名称</label>
            <input className="mask-input mb-4 w-full" placeholder="给角色起个名字..." value={name} onChange={(e) => setName(e.target.value)} maxLength={12} />
            
            <label className="mb-2 block text-sm" style={{ color: 'var(--color-text-muted)' }}>性格标签 (最多5个)</label>
            <div className="mb-4 flex flex-wrap gap-2">
              {personalityOptions.map((p) => (
                <button
                  key={p}
                  onClick={() => togglePersonality(p)}
                  className="rounded-full px-3 py-1.5 text-sm transition-all"
                  style={{
                    background: selectedPersonalities.includes(p) ? 'var(--color-primary)' : 'var(--color-surface-light)',
                    color: selectedPersonalities.includes(p) ? 'white' : 'var(--color-text)',
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
            <button onClick={() => setStep(2)} className="mask-btn w-full" disabled={!name || selectedPersonalities.length === 0}>
              下一步
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <label className="mb-2 block text-sm" style={{ color: 'var(--color-text-muted)' }}>说话风格</label>
            <div className="mb-4 space-y-2">
              {['简洁', '详尽', '诗意', '口语化', '正式', '随意'].map((s) => (
                <button
                  key={s}
                  onClick={() => setStyle(s)}
                  className="w-full rounded-xl p-3 text-left text-sm transition-all"
                  style={{
                    background: style === s ? 'var(--color-primary)' : 'var(--color-surface-light)',
                    color: style === s ? 'white' : 'var(--color-text)',
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="mask-btn-secondary flex-1">上一步</button>
              <button onClick={handleCreate} className="mask-btn flex-1" disabled={!style}>
                创建角色
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
