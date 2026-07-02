# MASK 系统架构设计

## 整体架构

```
┌─────────────────────────────────────────────────────────────────┐
│                         客户端层                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐    │
│  │   Web App   │  │  iOS App    │  │   Android App       │    │
│  │  (React)    │  │(React Native│  │  (React Native)     │    │
│  └──────┬──────┘  └──────┬──────┘  └──────────┬──────────┘    │
│         │                │                    │                │
│         └────────────────┼────────────────────┘                │
│                          │                                     │
│                   CDN (Cloudflare)                             │
└──────────────────────────┬────────────────────────────────────┘
                           │
┌──────────────────────────▼────────────────────────────────────┐
│                      API 网关层                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Nginx / Kong                                            │   │
│  │  ├─ SSL 终止                                             │   │
│  │  ├─ 限流                                                 │   │
│  │  ├─ 负载均衡                                             │   │
│  │  └─ 静态文件服务                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
└──────────────────────────┬─────────────────────────────────────┘
                           │
┌──────────────────────────▼────────────────────────────────────┐
│                    MASK API Server                               │
│                                                                  │
│  ┌─────────────┐ ┌──────────────┐ ┌──────────────────────┐    │
│  │ Auth Module │ │ User Module  │ │ Square Module        │    │
│  │ 认证模块     │ │ 用户模块     │ │ 广场模块             │    │
│  └─────────────┘ └──────────────┘ └──────────────────────┘    │
│  ┌─────────────┐ ┌──────────────┐ ┌──────────────────────┐    │
│  │ Chat Module │ │ Lab Module   │ │ Game Module          │    │
│  │ 聊天模块     │ │ AI工坊模块   │ │ 图灵测试模块         │    │
│  └─────────────┘ └──────────────┘ └──────────────────────┘    │
│  ┌─────────────┐ ┌──────────────┐ ┌──────────────────────┐    │
│  │ AI Service  │ │ Image Service│ │ Moderation Service   │    │
│  │ AI服务      │ │ 图像服务     │ │ 内容审核服务         │    │
│  └─────────────┘ └──────────────┘ └──────────────────────┘    │
└──────────────────────────┬────────────────────────────────────┘
                           │
         ┌─────────────────┼─────────────────┐
         │                 │                 │
         ▼                 ▼                 ▼
┌─────────────┐  ┌──────────────┐  ┌──────────────────┐
│ PostgreSQL  │  │ Redis        │  │ Pinecone         │
│ (主数据库)  │  │ (缓存/队列)  │  │ (向量数据库)     │
│             │  │              │  │                  │
│ - Users     │  │ - Sessions   │  │ - AI Memories    │
│ - MoodCards │  │ - Rate Limit │  │ - Character Emb  │
│ - Messages  │  │ - Leaderboard│  │                  │
│ - AIChars   │  │ - BullMQ     │  │                  │
└─────────────┘  └──────────────┘  └──────────────────┘
```

## 数据流

### 1. 发布心情卡片

```
User selects mood + text
         │
         ▼
Frontend POST /api/v1/square/cards
         │
         ▼
Server validates input
         │
         ▼
Server calls Image Service (OpenAI/Google)
         │
         ▼
AI generates mood illustration
         │
         ▼
Image uploaded to S3/OSS
         │
         ▼
Card saved to PostgreSQL
         │
         ▼
Published to Square feed (Redis pub/sub)
         │
         ▼
All online clients receive update (WebSocket)
```

### 2. AI 角色对话

```
User sends message to @ai_character
         │
         ▼
Server receives message via WebSocket
         │
         ▼
Server retrieves AI character config
         │
         ▼
Server queries Pinecone for relevant memories
         │
         ▼
Server builds prompt (character persona + memories + message)
         │
         ▼
Server calls DeepSeek/GPT API
         │
         ▼
AI generates response
         │
         ▼
Server stores conversation to PostgreSQL
         │
         ▼
Server extracts key info, updates Pinecone memory
         │
         ▼
Response sent back to user via WebSocket
```

## 技术选型理由

| 技术 | 选择理由 |
|------|---------|
| **React + TypeScript** | 生态成熟，类型安全，开发效率高 |
| **Tailwind CSS** | 快速样式开发，设计系统一致 |
| **Zustand** | 轻量状态管理，比 Redux 更简单 |
| **Node.js + Express** | JavaScript 全栈，开发统一 |
| **PostgreSQL** | 关系型数据，JSON 支持，稳定可靠 |
| **Prisma** | 类型安全的 ORM，开发体验好 |
| **Redis** | 缓存、会话、在线状态、排行榜 |
| **Pinecone** | 专业的向量数据库，AI 记忆存储 |
| **DeepSeek** | 性价比最高的中文 LLM |
| **OpenAI GPT Image** | 图像生成质量高，价格低 |

## 扩展性设计

### 水平扩展

- 无状态 API 服务器，可通过负载均衡横向扩展
- Redis 集群支持分布式缓存
- PostgreSQL 主从复制

### 微服务拆分（未来）

当用户量达到 10 万+ 时，可拆分为：

```
mask-api-gateway     # API 网关
mask-auth-service    # 认证服务
mask-user-service    # 用户服务
mask-square-service  # 广场服务
mask-chat-service    # 聊天服务
mask-lab-service     # AI 工坊服务
mask-game-service    # 图灵测试服务
mask-ai-service      # AI 推理服务（可独立扩缩容）
```
