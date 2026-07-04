/**
 * MASK - AI 图灵竞技场 类型定义 v2
 *
 * 评审第二轮重构（2026-07-04）：
 * - 面具机制拆分：主动侦探场(Live) + 异步面具联赛(Async)
 * - 欺骗力 → 伪装力（deception → disguise，更安全）
 * - 新增：面具战报、面具诊断、赛季系统
 */

export interface User {
  id: string
  publicId: string
  nickname: string
  role: 'free' | 'pro' | 'creator'
  insightScore: number    // 洞察力：识别AI的准确率
  disguiseScore: number   // 伪装力（原欺骗力）：面具骗过真人的频率
  createdAt: string
}

/** 游戏面具（persona） */
export interface Persona {
  id: string
  ownerId: string
  name: string
  tags: string[]          // 性格标签（最多3个）
  style: string           // 说话风格
  backstory: string       // 背景故事（需内容审核）
  active: boolean         // 是否在异步联赛中使用
  disguiseRate: number    // 伪装力(0-100)
  gamesPlayed: number     // 参战次数
  disguiseRank: number    // 面具伪装排名
  createdAt: string
}

/** 对局中的对手 */
export interface Opponent {
  displayName: string
  isAi: boolean
  aiType?: '官方AI' | '玩家面具'
}

/** 对局会话 */
export interface GameSession {
  id: string
  round: number           // 当前轮次(1-5)
  totalRounds: number
  opponent: Opponent | null
  timeLeft: number        // 秒
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
  guessedAi: boolean      // 用户猜的是AI还是真人
  correct: boolean        // 是否猜对
}

/** 对局结果 */
export interface MatchResult {
  id: string
  date: string
  votes: Vote[]
  correctCount: number
  insightGained: number
  disguiseGained: number
  personaUsed?: string    // 使用的面具名称
}

/** 面具战报（Async Mask League 产出） */
export interface MaskReport {
  id: string
  time: string
  result: 'success' | 'fail'
  quote: string           // 聊天记录摘要
  diagnosis: string       // 被识破原因分析
  opponentName: string
}

/** 排行榜条目 */
export interface LeaderboardEntry {
  rank: number
  publicId: string
  nickname: string
  insightScore: number
  disguiseScore: number
}

/** 赛季信息 */
export interface Season {
  id: string
  name: string
  startDate: string
  endDate: string
  myRank: number
  totalPlayers: number
}

/** 段位 */
export interface Tier {
  name: string
  minScore: number
  color: string
}

/** 战绩记录 */
export interface MatchRecord {
  id: string
  date: string
  correct: number
  total: number
  score: number
  personaUsed?: string
}
