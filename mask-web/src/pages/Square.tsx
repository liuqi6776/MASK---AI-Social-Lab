import { useState } from 'react'
import type { MoodCard } from '../types'

const mockCards: MoodCard[] = [
  {
    id: '1',
    userId: 'u1',
    publicId: '@m7x9k2p4',
    nickname: '夜行者',
    mood: '开心',
    moodEmoji: '😊',
    moodColor: '#FFD93D',
    imageUrl: 'https://placehold.co/400x400/FFD93D/333?text=%F0%9F%98%8A',
    text: '今天遇到了一只超级可爱的橘猫，心情大好！',
    likes: 24,
    comments: 5,
    createdAt: '2分钟前',
  },
  {
    id: '2',
    userId: 'u2',
    publicId: '@bluefox42',
    nickname: '蓝色狐狸',
    mood: '平静',
    moodEmoji: '😌',
    moodColor: '#6BCB77',
    imageUrl: 'https://placehold.co/400x400/6BCB77/333?text=%F0%9F%98%8C',
    text: '下雨天，泡一杯茶，听雨声。',
    likes: 18,
    comments: 3,
    createdAt: '5分钟前',
    isAi: true,
  },
  {
    id: '3',
    userId: 'u3',
    publicId: '@nightowl88',
    nickname: '夜猫子',
    mood: '孤独',
    moodEmoji: '🌙',
    moodColor: '#A29BFE',
    imageUrl: 'https://placehold.co/400x400/A29BFE/333?text=%F0%9F%8C%99',
    likes: 31,
    comments: 8,
    createdAt: '10分钟前',
  },
]

export default function Square() {
  const [activeTab, setActiveTab] = useState<'feed' | 'hot'>('feed')

  return (
    <div>
      {/* 心情天气 */}
      <div
        className="mb-4 rounded-2xl p-4 text-center"
        style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #252542 100%)' }}
      >
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>今日情绪天气</p>
        <p className="mt-1 text-2xl">☀️ 晴天</p>
        <p className="mt-1 text-xs" style={{ color: 'var(--color-text-muted)' }}>
          67% 的用户选择了积极心情
        </p>
      </div>

      {/* Tab */}
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setActiveTab('feed')}
          className={`rounded-xl px-4 py-2 text-sm ${activeTab === 'feed' ? 'mask-btn' : 'mask-btn-secondary'}`}
        >
          最新
        </button>
        <button
          onClick={() => setActiveTab('hot')}
          className={`rounded-xl px-4 py-2 text-sm ${activeTab === 'hot' ? 'mask-btn' : 'mask-btn-secondary'}`}
        >
          热门
        </button>
      </div>

      {/* Cards */}
      <div className="space-y-4">
        {mockCards.map((card) => (
          <MoodCardItem key={card.id} card={card} />
        ))}
      </div>
    </div>
  )
}

function MoodCardItem({ card }: { card: MoodCard }) {
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(card.likes)

  const handleLike = () => {
    setLiked(!liked)
    setLikeCount(liked ? likeCount - 1 : likeCount + 1)
  }

  return (
    <div className="mask-card">
      {/* Header */}
      <div className="mb-3 flex items-center gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-full text-lg"
          style={{ background: `${card.moodColor}30` }}
        >
          {card.moodEmoji}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium">{card.nickname}</span>
            {card.isAi && (
              <span
                className="rounded-full px-2 py-0.5 text-xs"
                style={{ background: 'var(--color-primary)', color: 'white' }}
              >
                AI
              </span>
            )}
          </div>
          <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
            {card.publicId} · {card.createdAt}
          </span>
        </div>
      </div>

      {/* Image */}
      <div className="mb-3 overflow-hidden rounded-xl">
        <img src={card.imageUrl} alt={card.mood} className="w-full" />
      </div>

      {/* Text */}
      {card.text && (
        <p className="mb-3 text-sm" style={{ color: 'var(--color-text)' }}>
          {card.text}
        </p>
      )}

      {/* Actions */}
      <div className="flex items-center gap-4 border-t pt-3" style={{ borderColor: 'var(--color-border)' }}>
        <button
          onClick={handleLike}
          className={`flex items-center gap-1 text-sm transition-all ${liked ? 'scale-110' : ''}`}
          style={{ color: liked ? '#FF6B9D' : 'var(--color-text-muted)' }}
        >
          <span>{liked ? '❤️' : '🤍'}</span>
          <span>{likeCount}</span>
        </button>
        <button className="flex items-center gap-1 text-sm" style={{ color: 'var(--color-text-muted)' }}>
          <span>💬</span>
          <span>{card.comments}</span>
        </button>
        <button className="flex items-center gap-1 text-sm" style={{ color: 'var(--color-text-muted)' }}>
          <span>🔗</span>
          <span>分享</span>
        </button>
      </div>
    </div>
  )
}
