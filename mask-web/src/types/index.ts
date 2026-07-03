/**
 * MASK - AI 图灵竞技场 类型定义
 * 
 * 评审重构后（2026-07-03）：
 * - 砍掉：MoodCard（广场）、ChatMessage/ChatConversation（匿名私聊）
 * - 保留：User、AiCharacter（降级为面具）、GameSession、LeaderboardEntry
 * - 新增：Persona（游戏面具）、MatchResult（对局结果）
 */

export interface User {
  id: string
  publicId: string
  nickname: string
  role: 'free' | 'pro' | 'creator'
  insightScore: number // 洞察力
  deceptionScore: number // 欺骗力
  createdAt: string
}

/** 游戏面具（原 AI Character 降级） */
export interface Persona {
  id: string
  ownerId: string
  name: string
  tags: string[] // 性格标签（最多3个）
  style: string // 说话风格
  backstory: string
  active: boolean // 是否在对局中使用
  deceptionRate: number // 骗过真人的比例(0-100)
  gamesPlayed: number
  createdAt: string
}

/** 对局中的对手 */
export interface Opponent {
  publicId: string
  displayName: string
  isAi: boolean
  aiType?: '官方AI' | '玩家面具'
}

/** 对局会话 */
export interface GameSession {
  id: string
  round: number // 当前轮次(1-5)
  totalRounds: number
  opponent: Opponent | null
  timeLeft: number // 秒
  messages: GameMessage[]
  status: 'matching' | 'chatting' | 'voting' | 'completed'
}

/** 游戏内消息 */
export interface GameMessage {
  from: 'me' | 'them'
  text: string
  timestamp: number
}

/** 投票记录 */
export interface Vote {
  opponent: Opponent
  guessedAi: boolean // 用户猜的是AI还是真人
  correct: boolean // 是否猜对
}

/** 对局结果 */
export interface MatchResult {
  id: string
  sessionId: string
  date: string
  votes: Vote[]
  correctCount: number
  insightGained: number
  deceptionGained: number
  personaUsed?: string // 使用的面具名称
}

/** 排行榜条目 */
export interface LeaderboardEntry {
  rank: number
  publicId: string
  nickname: string
  insightScore: number
  deceptionScore: number
}

/** 战绩记录（Profile页面用） */
export interface MatchRecord {
  id: string
  date: string
  correct: number
  total: number
  score: number
  personaUsed?: string
}

// --- 以下类型为后端保留，前端暂不直接使用 ---

/** AI 角色（后端模型，前端通过 Persona 交互） */
export interface AiCharacter {
  id: string
  publicId: string
  ownerId: string
  name: string
  personality: string[]
  style: string
  backstory?: string
  status: 'active' | 'suspended'
  createdAt: string
}
