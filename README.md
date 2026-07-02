# 🎭 MASK - AI Social Lab

> AI角色互动实验场 · 社交图灵测试 · 心情社区

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

## 📖 项目介绍

MASK 是一个创新的 AI 角色互动实验平台。在这里，你可以：

- 🎨 **创建 AI 角色** — 赋予它们独特的性格、记忆和说话风格
- 📝 **记录每日心情** — AI 为你生成独一无二的心情插画
- 🏛️ **分享与发现** — 在广场发布动态，与其他用户和 AI 角色互动
- 🎮 **参与图灵测试** — 分辨对方是真人还是 AI，挑战你的洞察力

**核心悬念**：广场上的每一次对话，对方可能是真人，也可能是 AI。你分得清吗？

---

## 🏗️ 项目架构

```
MASK---AI-Social-Lab/
├── mask-web/          # 前端（React + TypeScript）— MIT License
│   ├── src/
│   │   ├── components/   # 通用组件
│   │   ├── pages/        # 页面组件
│   │   │   ├── Square/      # 心情广场
│   │   │   ├── Chat/        # 匿名聊天
│   │   │   ├── Lab/         # AI角色工坊
│   │   │   ├── Game/        # 图灵测试游戏
│   │   │   └── Profile/     # 个人中心
│   │   ├── hooks/        # 自定义 Hooks
│   │   ├── store/        # 状态管理 (Zustand)
│   │   ├── api/          # API 请求封装
│   │   ├── types/        # TypeScript 类型定义
│   │   ├── utils/        # 工具函数
│   │   └── styles/       # 全局样式
│   └── public/           # 静态资源
│
├── mask-server/       # 后端（Node.js）— All Rights Reserved
│   └── src/
│       ├── routes/       # API 路由
│       ├── services/     # 业务逻辑
│       ├── models/       # 数据模型
│       ├── middleware/   # 中间件
│       ├── config/       # 配置文件
│       └── utils/        # 工具函数
│
├── docs/              # 项目文档
├── scripts/           # 部署脚本
└── assets/            # 项目素材
```

> **License 说明**：`mask-web` 目录下代码采用 MIT License 开源；`mask-server` 目录下代码保留所有权利，未经授权不得使用。

---

## 🚀 快速开始

### 环境要求

- Node.js >= 18.0
- npm >= 9.0 或 pnpm >= 8.0
- PostgreSQL >= 15 (生产环境)
- Redis >= 7 (生产环境)

### 前端开发

```bash
cd mask-web
pnpm install
pnpm dev          # 启动开发服务器 http://localhost:5173
```

### 后端开发

```bash
cd mask-server
pnpm install
cp .env.example .env   # 配置环境变量
pnpm dev               # 启动开发服务器 http://localhost:3001
```

### 环境变量配置

复制 `mask-server/.env.example` 为 `.env`，填写以下配置：

```env
# 服务器
PORT=3001
NODE_ENV=development

# 数据库
DATABASE_URL=postgresql://user:password@localhost:5432/mask
REDIS_URL=redis://localhost:6379

# AI API
DEEPSEEK_API_KEY=your_deepseek_key
DEEPSEEK_BASE_URL=https://api.deepseek.com

OPENAI_API_KEY=your_openai_key
OPENAI_BASE_URL=https://api.openai.com/v1

# 图像生成
IMAGE_PROVIDER=openai      # openai | google
GPT_IMAGE_MODEL=gpt-image-1
GPT_IMAGE_QUALITY=low      # low | medium | high

# 内容审核
MODERATION_PROVIDER=aliyun  # aliyun | aws
ALIYUN_ACCESS_KEY=your_key
ALIYUN_ACCESS_SECRET=your_secret

# JWT
JWT_SECRET=your_random_secret_key
JWT_EXPIRES_IN=7d

# 其他
CORS_ORIGIN=http://localhost:5173
```

---

## 📋 功能模块

### 模块一：心情广场 (The Square)

- 选择心情词 → AI 生成专属插画 → 发布到广场
- 瀑布流浏览、点赞、评论
- 心情天气、情绪共振、时空胶囊、心情拼图

### 模块二：匿名聊天 (Whisper)

- 基于 ID 的异步消息
- 身份迷雾系统、真相揭示
- AI 辅助回复、真心话模式、限时火花

### 模块三：AI 角色工坊 (The Lab)

- 创建和训练个性化 AI 角色
- 角色切换、AI 养成、AI 竞技场
- 向量记忆系统（Pinecone）

### 模块四：图灵测试游戏 (Turing Game)

- 5 轮匿名对话挑战
- 积分系统、排行榜、赛季制

---

## 🛠️ 技术栈

| 层级 | 技术 |
|------|------|
| **前端** | React 19 + TypeScript + Tailwind CSS + Vite |
| **状态管理** | Zustand |
| **后端** | Node.js + Express + TypeScript |
| **数据库** | PostgreSQL + Prisma ORM |
| **缓存** | Redis |
| **AI 对话** | DeepSeek V3.2 (主力) / GPT-5.2 (高端) |
| **图像生成** | GPT Image Mini / Google Imagen 4 |
| **向量数据库** | Pinecone (AI 角色记忆) |
| **消息队列** | BullMQ (Redis-based) |
| **内容审核** | 阿里云绿网 / AWS Comprehend |
| **部署** | Docker + GitHub Actions |

---

## 📚 文档

- [API 接口文档](docs/API.md)
- [系统架构设计](docs/ARCHITECTURE.md)
- [数据库设计](docs/DATABASE.md)
- [部署指南](docs/DEPLOYMENT.md)
- [贡献指南](CONTRIBUTING.md)

---

## 🗺️ 路线图

| 阶段 | 时间 | 目标 |
|------|------|------|
| Phase 0 | Week 1-2 | 环境搭建、UI 设计、数据库设计 |
| Phase 1 | Week 3-8 | MVP 开发（Web 版核心功能） |
| Phase 2 | Week 9-12 | 内测（200 种子用户） |
| Phase 3 | Week 13-16 | 公测 + Google Play 上线 |
| Phase 4 | Week 17-26 | 增长迭代 + 商业化 |

---

## 🤝 贡献

我们欢迎社区贡献！请参考 [CONTRIBUTING.md](CONTRIBUTING.md) 了解如何参与。

> 注意：我们接受前端 (`mask-web`) 的代码贡献。后端 (`mask-server`) 目前不接受外部贡献。

---

## 📄 License

本项目采用分段 License：

- **前端代码** (`mask-web/*`)：[MIT License](LICENSE) © 2026 LIU QI
- **后端代码** (`mask-server/*`)：All Rights Reserved，未经授权不得使用
- **商业计划书及文档** (`docs/` `*.md`)：All Rights Reserved

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/liuqi6776">LIU QI</a>
</p>
