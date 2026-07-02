import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { cn } from '../utils/cn'

const navItems = [
  { path: '/', label: '广场', icon: '🏛️' },
  { path: '/lab', label: '工坊', icon: '🔬' },
  { path: '/game', label: '游戏', icon: '🎮' },
  { path: '/profile', label: '我的', icon: '🎭' },
]

export default function Layout() {
  const location = useLocation()
  const navigate = useNavigate()
  const [showPublish, setShowPublish] = useState(false)

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 px-4 py-3" style={{ background: 'rgba(15,15,26,0.9)', backdropFilter: 'blur(10px)' }}>
        <div className="mx-auto flex max-w-lg items-center justify-between">
          <h1 className="text-xl font-bold" style={{ color: 'var(--color-primary)' }}>
            MASK
          </h1>
          <button
            onClick={() => setShowPublish(true)}
            className="mask-btn text-sm py-2 px-4"
          >
            + 发布心情
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-lg px-4 pt-4">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 border-t px-4"
        style={{ background: 'rgba(15,15,26,0.95)', backdropFilter: 'blur(10px)', borderColor: 'var(--color-border)' }}
      >
        <div className="mx-auto flex max-w-lg justify-around py-2">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                'flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all',
                location.pathname === item.path
                  ? 'font-medium'
                  : 'opacity-50 hover:opacity-80'
              )}
              style={location.pathname === item.path ? { color: 'var(--color-primary)' } : {}}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-xs">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Publish Modal */}
      {showPublish && (
        <PublishModal onClose={() => setShowPublish(false)} />
      )}
    </div>
  )
}

function PublishModal({ onClose }: { onClose: () => void }) {
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const [text, setText] = useState('')
  const [generating, setGenerating] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)

  const moods = [
    { emoji: '😊', label: '开心', color: '#FFD93D' },
    { emoji: '😌', label: '平静', color: '#6BCB77' },
    { emoji: '🤩', label: '兴奋', color: '#FF6B9D' },
    { emoji: '🤔', label: '困惑', color: '#9B8FFF' },
    { emoji: '😔', label: '低落', color: '#6B7B8D' },
    { emoji: '😤', label: '愤怒', color: '#FF4757' },
    { emoji: '😰', label: '焦虑', color: '#FFA502' },
    { emoji: '🥰', label: '浪漫', color: '#FF6B9D' },
    { emoji: '🙏', label: '感恩', color: '#7CFC00' },
    { emoji: '🌙', label: '孤独', color: '#A29BFE' },
    { emoji: '✨', label: '期待', color: '#FECA57' },
    { emoji: '🌸', label: '怀旧', color: '#FD79A8' },
  ]

  const handleGenerate = async () => {
    if (!selectedMood) return
    setGenerating(true)
    // TODO: Call API to generate image
    setTimeout(() => {
      setGeneratedImage(`https://placehold.co/400x400/${moods.find(m => m.label === selectedMood)?.color?.slice(1) || '7c6bff'}/ffffff?text=${encodeURIComponent(selectedMood)}`)
      setGenerating(false)
    }, 2000)
  }

  const handlePublish = () => {
    // TODO: Call API to publish
    onClose()
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
        
        <h2 className="mb-4 text-lg font-bold">选择今日心情</h2>
        
        {!generatedImage ? (
          <>
            <div className="mb-4 grid grid-cols-4 gap-3">
              {moods.map((mood) => (
                <button
                  key={mood.label}
                  onClick={() => setSelectedMood(mood.label)}
                  className={cn(
                    'flex flex-col items-center gap-1 rounded-xl p-3 transition-all',
                    selectedMood === mood.label
                      ? 'ring-2'
                      : 'hover:opacity-80'
                  )}
                  style={
                    selectedMood === mood.label
                      ? { background: `${mood.color}20`, ringColor: mood.color }
                      : { background: 'var(--color-surface-light)' }
                  }
                >
                  <span className="text-2xl">{mood.emoji}</span>
                  <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                    {mood.label}
                  </span>
                </button>
              ))}
            </div>

            <textarea
              className="mask-input mb-4 w-full resize-none"
              rows={3}
              placeholder="写下此刻的想法...（可选）"
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={200}
            />
            <div className="mb-4 text-right text-xs" style={{ color: 'var(--color-text-muted)' }}>
              {text.length}/200
            </div>

            <button
              onClick={handleGenerate}
              disabled={!selectedMood || generating}
              className="mask-btn w-full disabled:opacity-50"
            >
              {generating ? 'AI生成中...' : '生成心情插画'}
            </button>
          </>
        ) : (
          <>
            <div className="mb-4 overflow-hidden rounded-2xl">
              <img src={generatedImage} alt="mood" className="w-full" />
            </div>
            <p className="mb-4 text-center text-sm" style={{ color: 'var(--color-text-muted)' }}>
              心情: {selectedMood} {moods.find(m => m.label === selectedMood)?.emoji}
            </p>
            <div className="flex gap-3">
              <button onClick={() => setGeneratedImage(null)} className="mask-btn-secondary flex-1">
                重新生成
              </button>
              <button onClick={handlePublish} className="mask-btn flex-1">
                发布到广场
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
