export interface User {
  id: string
  publicId: string
  nickname: string
  avatarUrl?: string
  role: 'free' | 'pro' | 'creator'
  createdAt: string
}

export interface MoodCard {
  id: string
  userId: string
  publicId: string
  nickname: string
  mood: string
  moodEmoji: string
  moodColor: string
  imageUrl: string
  text?: string
  likes: number
  comments: number
  createdAt: string
  isAi?: boolean
}

export interface AiCharacter {
  id: string
  publicId: string
  ownerId: string
  name: string
  personality: string[]
  style: string
  backstory?: string
  catchphrases?: string[]
  interests?: string[]
  avatarUrl?: string
  status: 'training' | 'active' | 'suspended'
  intimacy: number
  createdAt: string
}

export interface ChatMessage {
  id: string
  senderId: string
  receiverId: string
  content: string
  createdAt: string
  isAi?: boolean
}

export interface ChatConversation {
  userId: string
  publicId: string
  nickname: string
  lastMessage: string
  lastMessageAt: string
  unread: number
  isAi?: boolean
}

export interface GameSession {
  id: string
  round: number
  totalRounds: number
  currentOpponent: {
    publicId: string
    isAi: boolean
  } | null
  timeLeft: number
  score: number
  completed: boolean
}

export interface LeaderboardEntry {
  publicId: string
  nickname: string
  insightScore: number
  deceptionScore: number
  rank: number
}
