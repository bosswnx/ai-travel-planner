# 🌍 AI Travel Planner (AI 旅行规划师)

> 基于大语言模型 (LLM) 与语音交互的智能旅行规划助手。

**AI Travel Planner** 是一个现代化的 Web 应用，旨在简化旅行规划过程。用户只需通过语音或文字描述旅行愿望（如目的地、时间、预算、偏好），AI 即可自动生成详细的每日行程、预算估算，并在地图上进行可视化展示。

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/Python-3.10+-yellow.svg)
![React](https://img.shields.io/badge/React-18-cyan.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.109-green.svg)
![Docker](https://img.shields.io/badge/Docker-Enabled-blue.svg)

## ✨ 核心功能

*   **🔐 用户认证**: 支持用户注册、登录，确保个人旅行计划的私密性与安全性。
*   **💾 个人计划管理**: 用户登录后，可保存当前旅行规划，并在后续访问时重新加载和管理（查看、删除）自己的历史行程。
*   **🇨🇳 全中文界面**: 界面文本已完全汉化，贴合中文用户使用习惯。
*   **🎙️ 智能语音交互**: 集成 Web Speech API，支持直接语音输入需求（如“帮我规划一个去日本的5天行程，预算1万，喜欢吃火锅”）。
*   **🧠 AI 深度规划**: 后端接入 **阿里云百炼 (Qwen/通义千问)** 大模型，生成结构化的 JSON 行程数据。
*   **🗺️ 地图可视化**: 集成 **高德地图 (AMap)**，根据行程地点自动定位展示，并针对目的地城市进行精确搜索，避免地点混淆。
*   **💰 预算估算**: AI 自动分析交通、住宿、餐饮等费用，提供预算明细。
*   **📱 响应式设计**: 清晰的时间轴展示和美观的 UI 设计 (Tailwind CSS)。

## 🛠️ 技术栈

### 前端 (Frontend)
*   **框架**: React + TypeScript (Vite 构建)
*   **样式**: Tailwind CSS
*   **HTTP 请求**: Axios
*   **地图组件**: @uiw/react-amap (高德地图封装)
*   **图标库**: Lucide React

### 后端 (Backend)
*   **Web 框架**: FastAPI (Python)
*   **数据库**: SQLite + SQLAlchemy ORM
*   **AI 模型**: 阿里云 DashScope SDK (Qwen-Plus)
*   **数据验证**: Pydantic

---

## 🚀 快速开始

### 1. 获取 API Key
本项目需要以下服务的 API Key 才能正常运行：
*   **AI 能力**: [阿里云百炼 (DashScope)](https://bailian.console.aliyun.com/)
*   **地图服务**: [高德地图开放平台 (AMap)](https://console.amap.com/) (Web 端 JS API)

### 2. 配置环境变量
请在项目根目录下的 `backend/.env` 和 `frontend/.env` 文件中填入你的 API Key。

```bash
# 后端环境变量 (backend/.env)
DASHSCOPE_API_KEY=your_dashscope_api_key_here

# 前端环境变量 (frontend/.env)
VITE_AMAP_KEY=your_amap_key_here
VITE_AMAP_SECURITY_CODE=your_amap_security_code_here
```
> **重要**: 请勿将 `.env` 文件提交到版本控制中。`.gitignore` 文件已配置以忽略这些文件。

### 3. 使用 Docker Compose (推荐)

最简单、推荐的启动方式是使用 Docker Compose，它会自动构建环境并启动前后端服务。

#### 3.1. 安装 Docker
请确保你的系统已经安装了 [Docker](https://docs.docker.com/get-docker/)。

#### 3.2. 启动服务
在项目根目录下运行：
```bash
# 首次运行或修改代码后，请务必加上 --build 重新构建镜像
docker-compose up --build

# 如果代码没有修改，可以直接使用
# docker-compose up
```
这会启动两个服务：
*   `backend`: 运行在 `http://localhost:8000`
*   `frontend`: 运行在 `http://localhost:5173`

#### 3.3. 停止服务
在终端按 `Ctrl+C` 即可停止服务。
如果需要彻底清除容器，可以运行：
```bash
docker-compose down
```

### 4. 手动启动 (非 Docker)

如果你不想使用 Docker，也可以手动在本地启动前后端服务。

#### 4.1. 启动后端
```bash
# 1. 进入项目根目录
cd ai-travel-planner

# 2. 激活虚拟环境 (如果之前创建了的话)
source venv/bin/activate  # Linux/macOS
# venv\Scripts\activate   # Windows

# 3. 启动服务 (默认端口 8000)
uvicorn backend.main:app --reload
```

#### 4.2. 启动前端
```bash
# 1. 进入前端目录
cd frontend

# 2. 安装依赖 (如果尚未安装)
npm install

# 3. 启动服务 (默认端口 5173)
npm run dev
```

然后浏览器访问 `http://localhost:5173`。

---

## 📂 项目结构

```
ai-travel-planner/
├── backend/                 # Python FastAPI 后端
│   ├── Dockerfile           # 后端 Dockerfile
│   ├── routers/             # API 路由定义 (包含认证和计划路由)
│   ├── services/            # 业务逻辑 (AI 调用封装)
│   ├── dependencies.py      # 依赖注入，用于用户认证
│   ├── security.py          # 密码哈希和 JWT 令牌管理
│   ├── models.py            # 数据库模型
│   ├── schemas.py           # Pydantic 数据验证模式
│   ├── main.py              # 应用入口
│   ├── database.py          # 数据库连接
│   └── requirements.txt     # Python 依赖
├── frontend/                # React TypeScript 前端
│   ├── Dockerfile           # 前端 Dockerfile
│   ├── public/              # 静态资源
│   ├── src/                 # 前端源代码
│   │   ├── context/         # 全局状态管理 (如认证上下文)
│   │   ├── pages/           # 页面组件 (如登录、注册、主页)
│   │   ├── components/      # UI 组件 (地图, 语音, 行程列表)
│   │   ├── services/        # API 请求封装
│   │   └── App.tsx          # 应用主入口 (包含路由)
│   ├── index.html           # 页面入口
│   ├── package.json         # Node.js/npm 依赖
│   └── tsconfig.json        # TypeScript 配置
├── docker-compose.yml       # Docker 编排文件
├── .env.example             # 环境变量示例文件
├── .gitignore               # Git 忽略文件
└── README.md                # 项目说明
```

## 📝 开发注意事项

*   **API Key 安全**: `.env` 文件用于存储敏感信息，已配置 Git 忽略，请勿提交。
*   **语音识别**: 浏览器的 Web Speech API 在某些浏览器中可能需要 HTTPS 环境或 `localhost` 才能正常工作。
*   **地图 Key**: 确保高德地图 Key 的类型是 "Web端 (JS API)"，并且正确配置了安全密钥 (Security Code)，否则地图可能无法加载。

## 🤝 贡献

欢迎提交 Issue 或 Pull Request！

## 📄 License

MIT