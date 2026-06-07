# AI Workbench - 玻璃拟态工作台

一个个人 AI 工作台，支持日志记录、头像上传、AI 智能总结等功能。

## 功能特性

- ✨ **玻璃拟态设计**：美观的毛玻璃效果界面
- 🎨 **粒子动效**：40 个漂浮粒子，支持鼠标互动
- 📝 **日志记录**：使用 Cloudflare D1 存储日志
- 👤 **头像上传**：使用 Cloudflare R2 存储头像
- 🤖 **AI 功能**：利用 Cloudflare Workers AI 生成日志摘要

## 技术栈

- **前端**：React 18 + Vite + TailwindCSS + Framer Motion
- **后端**：Cloudflare Workers
- **数据库**：Cloudflare D1
- **存储**：Cloudflare R2
- **部署**：Cloudflare Pages

## 快速开始

### 安装依赖
```bash
npm install
```

### 本地开发
```bash
npm run dev
```

浏览器自动打开 http://localhost:5173

### 构建
```bash
npm run build
```

## 项目结构

```
ai-workbench/
├── src/
│   ├── components/          # React 组件
│   │   ├── ParticleBackground.jsx  # 粒子动效
│   │   ├── Header.jsx              # 头部（含头像上传）
│   │   ├── JournalContainer.jsx    # 日志容器
│   │   ├── JournalList.jsx         # 日志列表
│   │   └── JournalForm.jsx         # 日志表单
│   ├── worker/              # Cloudflare Workers 后端
│   │   └── index.ts
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── migrations/              # 数据库迁移
│   └── 0001_create_journals.sql
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── wrangler.toml           # Cloudflare Workers 配置
```

## 配置 Cloudflare

### 创建 D1 数据库
```bash
wrangler d1 create ai_workbench_db
```

### 创建 R2 存储桶
```bash
wrangler r2 bucket create ai-workbench-avatars
```

### 执行数据库迁移
```bash
wrangler d1 execute ai_workbench_db --file=migrations/0001_create_journals.sql
```

## 部署

### 部署到 Cloudflare Pages
```bash
npm run build
wrangler deploy
```

## 开发进度

- [x] 项目初始化
- [x] 粒子动效实现
- [x] 日志 UI 组件
- [ ] 日志 D1 数据库集成
- [ ] 头像 R2 上传
- [ ] AI 摘要功能
- [ ] 完整功能测试

## 许可证

MIT
