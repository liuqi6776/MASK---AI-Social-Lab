# 🎭 MASK — AI 图灵竞技场

> 社交推理游戏：造一张面具，骗过人类，识破 AI

<p align="center">
  <img src="assets/logo.png" alt="MASK Logo" width="120">
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT"></a>
  <img src="https://img.shields.io/badge/Frontend-React%20+%20TypeScript-blue.svg" alt="Frontend">
  <img src="https://img.shields.io/badge/Backend-Node.js-green.svg" alt="Backend">
  <img src="https://img.shields.io/badge/AI-DeepSeek%20|%20OpenAI-purple.svg" alt="AI">
</p>

---

## ⚠️ 重要说明：产品已按评审重构（2026-07-03）

本项目经历了严格的产品评审（三方独立评审：作者 + GPT-5.5 + Gemini 3.1 Pro），结论如下：

- **原设计**（"AI 混入情绪社交平台"）→ ❌ 三颗致命炸弹：信任崩塌 + 合规红线 + 亏损经济
- **重构后**（"用户知情同意的图灵游戏"）→ ✅ 同时绕开三颗炸弹

**核心改动**：
- 砍掉：心情广场、匿名私聊、每帖 AI 生成图、向量记忆(Pinecone)
- 保留：图灵游戏（上升为唯一核心）、面具创建（降级为游戏道具）、双分系统
- 新增：合规开屏披露（知情同意）、战绩分享卡

详见 [docs/REVIEW.md](docs/REVIEW.md) 完整评审文档。

---

## 📖 产品定位

**MASK 是一个社交推理游戏。**

和匿名对手进行 5 轮限时对话——对方可能是真人、官方 AI、或其他玩家的 AI 面具。你的任务是识破 AI，同时用你的面具骗过别人。

```
核心循环：
① 创建面具（AI persona）→ ② 5轮限时对话 → ③ 投票猜AI/真人
→ ④ 揭晓身份 → ⑤ 分享战绩卡 → ⑥ 再来一局
```

**为什么这个游戏能活**（评审结论）：
- ✅ "AI 冒充人"是**游戏玩法**而非**社交平台地基**——合法、用户知情同意
- ✅ 天然解决冷启动：AI 对手是玩法本身，不算造假
- ✅ 收敛算力到高意图用户——不发免费图、不做无限聊天
- ✅ 战绩卡自带病毒传播属性

---

## 🏗️ 项目架构

```
MASK---AI-Social-Lab/
├── mask-web/          # 前端（React + TypeScript）— MIT License
│   ├── src/
│   │   ├── components/
│   │   │   └── Layout.tsx     # 布局 + 合规开屏披露
│   │   ├── pages/
│   │   │   ├── Arena.tsx      # 🎮 图灵竞技场（核心）
│   │   │   ├── Mask.tsx       # 🎭 面具工坊（游戏道具）
│   │   │   └── Profile.tsx    # 🏆 个人中心（双分+战绩）
│   │   ├── types/
│   │   ├── utils/
│   │   └── styles/
│   └── public/
│
├── mask-server/       # 后端（Node.js）— All Rights Reserved
│   └── src/
│       ├── routes/       # API 路由
│       │   ├── auth.ts      # 认证（手机号）
│       │   ├── game.ts      # 图灵游戏
│       │   ├── mask.ts      # 面具CRUD
│       │   └── user.ts      # 用户+排行榜
│       ├── services/
│       │   ├── aiChat.ts    # AI对话（DeepSeek）
│       │   ├── imageGen.ts  # 图像生成（按需）
│       │   ├── matching.ts  # 匹配系统
│       │   └── scoring.ts   # 计分系统
│       ├── models/
│       ├── middleware/
│       └── config/
│
├── docs/
│   ├── REVIEW.md          # 📋 完整产品评审文档
│   ├── API.md             # API 接口文档
│   └── ARCHITECTURE.md    # 系统架构设计
└── assets/
```

> **License 说明**：`mask-web/*` 采用 MIT License 开源；`mask-server/*` 保留所有权利。

---

## 🚀 快速开始

### 环境要求

- Node.js >= 18
- pnpm >= 8
- PostgreSQL >= 15
- Redis >= 7

### 前端

```bash
cd mask-web
pnpm install
pnpm dev          # http://localhost:5173
```

### 后端

```bash
cd mask-server
pnpm install
cp .env.example .env   # 填写 API Key
pnpm db:migrate
pnpm dev               # http://localhost:3001
```

---

## 🎮 核心功能

### 1. 图灵竞技场（唯一核心）

- **5 轮对局**：每轮匹配一个匿名对手（真人/AI 混合）
- **限时 2 分钟**：和对手对话，观察对方是否是 AI
- **投票揭晓**：猜对 +10 分，猜错 -5 分
- **战绩卡**："5 局识破 4 个 AI" → 分享到朋友圈/小红书

### 2. 面具工坊（游戏道具）

- 创建 AI 面具（persona）：名字 + 3 个性格标签 + 说话风格
- 面具替你参加对局——目标是骗过真人玩家
- **欺骗率统计**：你的面具骗过了多少真人

### 3. 双分系统

| 分数 | 说明 | 获取方式 |
|------|------|---------|
| 👁️ **洞察力** | 识别 AI 的准确率 | 对局中猜对对手身份 |
| 🎭 **伪装力** | 面具骗过真人的频率 | 你的面具被真人误判为真人 |

### 4. 合规设计（生死线）

- **开屏披露**：首次进入明确告知"本游戏包含 AI 对手"
- **知情同意**：用户主动确认后才可开始对局
- **实名验证**：手机号注册（后台实名）
- **每局揭晓**：结束后明确标注每个对手是真人还是 AI

---

## 💰 变现设计

评审核心原则：**不靠免费无限 AI 聊天（那是 margin 陷阱）**

| 付费点 | 说明 |
|--------|------|
| 额外对局 | 免费每天 N 局，超出付费 |
| 面具槽位 | 多个面具需付费解锁 |
| 高级模型 | 更强的 LLM 让你的面具更能骗人 |
| 赛季通行证 | 排名、专属徽章 |
| 分析报告 | "为什么别人觉得你是 AI" |

---

## 🛠️ 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | React 19 + TypeScript + Tailwind CSS + Vite |
| 状态管理 | Zustand |
| 后端 | Node.js + Express + TypeScript |
| 数据库 | PostgreSQL + Prisma |
| 缓存 | Redis |
| AI 对话 | DeepSeek V3.2 |
| 图像生成 | 按需调用（非每帖必生成）|
| ~~向量数据库~~ | ~~Pinecone~~（评审砍掉，MVP 先无状态）|

---

## 📚 文档

- [产品评审文档](docs/REVIEW.md) — 三方评审完整记录
- [API 接口文档](docs/API.md)
- [系统架构](docs/ARCHITECTURE.md)

---

## 🤝 贡献

欢迎前端代码贡献！请阅读 [CONTRIBUTING.md](CONTRIBUTING.md)。

---

## 📄 License

- **前端代码** (`mask-web/*`)：[MIT License](LICENSE) © 2026 LIU QI
- **后端代码** (`mask-server/*`)：All Rights Reserved
- **评审文档** (`docs/REVIEW.md`)：开源分享，欢迎引用

---

> *"把'AI 冒充人'从违法的社交默认态，变成合法的、用户同意的游戏机制。"*
>
> *如果这个窄游戏都留不住人，那个大而全的版本更不可能。*
>
> *先证明游戏成立，再向角色创建、主题房间、创作者生态扩展。*

<p align="center">
  Made with ❤️ by <a href="https://github.com/liuqi6776">LIU QI</a>
</p>
