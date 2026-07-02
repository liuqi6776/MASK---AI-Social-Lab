# Contributing to MASK

感谢您对 MASK 项目的关注！我们欢迎社区贡献。

## 贡献范围

我们接受以下部分的代码贡献：

- ✅ `mask-web/` - 前端代码（React + TypeScript）
- ✅ `docs/` - 文档改进
- ✅ Bug 报告和功能建议
- ❌ `mask-server/` - 后端代码（暂不接受外部贡献）

## 开发流程

### 1. Fork 仓库

```bash
git clone https://github.com/YOUR_USERNAME/MASK---AI-Social-Lab.git
cd MASK---AI-Social-Lab
```

### 2. 创建分支

```bash
git checkout -b feature/your-feature-name
```

### 3. 开发

前端开发：
```bash
cd mask-web
pnpm install
pnpm dev
```

### 4. 提交

```bash
git add .
git commit -m "feat: add some feature"
git push origin feature/your-feature-name
```

### 5. 创建 Pull Request

## 代码规范

- 使用 TypeScript，严格类型
- 组件使用函数式组件 + Hooks
- 样式使用 Tailwind CSS
- 提交信息遵循 Conventional Commits

## 提交信息格式

```
feat: 新功能
fix: 修复bug
docs: 文档更新
style: 代码格式（不影响功能）
refactor: 重构
test: 测试
chore: 构建/工具
```

## 联系我们

如有问题，请在 GitHub Issues 中提出。
