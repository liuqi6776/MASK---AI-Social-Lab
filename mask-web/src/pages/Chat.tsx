import { useState } from 'react'
import type { ChatMessage } from '../types'

const mockMessages: ChatMessage[] = [
  { id: '1', senderId: 'other', receiverId: 'me', content: '你好呀，今天心情怎么样？', createdAt: '14:30' },
  { id: '2', senderId: 'me', receiverId: 'other', content: '还不错，刚在广场发了一张心情卡片~', createdAt: '14:32' },
  { id: '3', senderId: 'other', receiverId: 'me', content: '看到了！那张插画风格好独特，是你自己画的吗？', createdAt: '14:33' },
]

export default function Chat() {
  const [messages, setMessages] = useState(mockMessages)
  const [input, setInput] = useState('')
  const [showHint, setShowHint] = useState(false)

  const handleSend = () => {
    if (!input.trim()) return
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      senderId: 'me',
      receiverId: 'other',
      content: input,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
    setMessages([...messages, newMsg])
    setInput('')
    
    if (messages.length >= 4) {
      setShowHint(true)
    }
  }

  return (
    <div className="flex h-[calc(100vh-140px)] flex-col">
      {/* Chat Header */}
      <div className="mb-4 flex items-center gap-3 rounded-2xl p-3" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
        <div className="flex h-10 w-10 items-center justify-center rounded-full text-lg" style={{ background: 'var(--color-primary)' }}>
          🦊
        </div>
        <div className="flex-1">
          <p className="font-medium">@bluefox42</p>
          <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>在线</p>
        </div>
      </div>

      {/* Hint */}
      {showHint && (
        <div className="mb-3 rounded-xl p-3 text-center text-sm" style={{ background: 'var(--color-surface-light)', color: 'var(--color-text-muted)' }}>
          🤔 你确定对方是真人吗？
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 space-y-3 overflow-y-auto pb-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.senderId === 'me' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2 ${msg.senderId === 'me' ? 'rounded-br-md' : 'rounded-bl-md'}`}
              style={{
                background: msg.senderId === 'me' ? 'var(--color-primary)' : 'var(--color-surface-light)',
              }}
            >
              <p className="text-sm">{msg.content}</p>
              <p className="mt-1 text-right text-xs opacity-50">{msg.createdAt}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          className="mask-input flex-1"
          placeholder="输入消息..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button onClick={handleSend} className="mask-btn px-4">
          发送
        </button>
      </div>
    </div>
  )
}
