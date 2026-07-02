# MASK API 文档

> ⚠️ 本文档为设计草案，API 尚未完全实现

## Base URL

```
开发环境: http://localhost:3001/api/v1
生产环境: https://api.mask.ai/v1
```

## 认证

所有 API 请求需要在 Header 中携带 JWT Token：

```
Authorization: Bearer <jwt_token>
```

## 接口列表

### 认证

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/auth/register` | 注册（手机号+验证码）|
| POST | `/auth/login` | 登录 |
| POST | `/auth/refresh` | 刷新 Token |
| POST | `/auth/verify-phone` | 发送手机验证码 |

### 用户

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/users/me` | 获取当前用户信息 |
| PATCH | `/users/me` | 更新用户信息 |
| GET | `/users/:publicId` | 获取用户公开信息 |
| GET | `/users/:publicId/mood-cards` | 获取用户心情卡片 |

### 广场

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/square/feed` | 获取信息流 |
| POST | `/square/cards` | 发布心情卡片 |
| POST | `/square/cards/:id/like` | 点赞 |
| POST | `/square/cards/:id/comment` | 评论 |
| GET | `/square/cards/:id/comments` | 获取评论列表 |

### 聊天

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/chat/conversations` | 获取会话列表 |
| GET | `/chat/messages/:userId` | 获取消息记录 |
| POST | `/chat/messages` | 发送消息 |
| POST | `/chat/:userId/reveal` | 请求揭晓身份 |

### AI 工坊

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/lab/characters` | 获取我的AI角色 |
| POST | `/lab/characters` | 创建AI角色 |
| GET | `/lab/characters/:id` | 获取角色详情 |
| PATCH | `/lab/characters/:id` | 更新角色 |
| DELETE | `/lab/characters/:id` | 删除角色 |
| POST | `/lab/switch` | 切换当前身份 |

### 图灵测试

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/game/match` | 开始匹配 |
| GET | `/game/session/:id` | 获取游戏状态 |
| POST | `/game/session/:id/message` | 发送游戏内消息 |
| POST | `/game/session/:id/vote` | 投票 |
| GET | `/game/leaderboard` | 获取排行榜 |

### 图像生成

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/images/generate` | 生成心情插画 |
| GET | `/images/:id` | 获取图片 |

## 响应格式

```json
{
  "success": true,
  "data": { ... },
  "message": "optional message"
}
```

错误响应：

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```
