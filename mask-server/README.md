# MASK Server

> ⚠️ **All Rights Reserved** — This code is proprietary and confidential.
> Unauthorized copying, distribution, or use is strictly prohibited.

MASK 后端服务 — Node.js + TypeScript + PostgreSQL

## 开发

```bash
# 安装依赖
pnpm install

# 配置环境变量
cp .env.example .env
# 编辑 .env 填入你的 API Key

# 数据库迁移
npx prisma migrate dev

# 启动开发服务器
pnpm dev
```

## 部署

```bash
# 构建
pnpm build

# 启动生产服务器
pnpm start
```

## Docker 部署

```bash
docker build -t mask-server .
docker run -p 3001:3001 --env-file .env mask-server
```

## 版权声明

本目录下所有代码版权归 LIU QI 所有，未经授权不得使用、复制或分发。
