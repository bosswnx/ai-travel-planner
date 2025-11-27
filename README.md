# 🌍 AI Travel Planner (AI 旅行规划师)

> 基于大语言模型 (LLM) 与语音交互的智能旅行规划助手。

**AI Travel Planner** 是一个现代化的 Web 应用，旨在简化旅行规划过程。用户只需通过语音或文字描述旅行愿望（如目的地、时间、预算、偏好），AI 即可自动生成详细的每日行程、预算估算，并在地图上进行可视化展示。

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/Python-3.10+-yellow.svg)
![React](https://img.shields.io/badge/React-18-cyan.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.109-green.svg)

## ✨ 核心功能

*   **🎙️ 智能语音交互**: 集成 Web Speech API，支持直接语音输入需求（如“帮我规划一个去日本的5天行程，预算1万，带孩子”）。
*   **🧠 AI 深度规划**: 后端接入 **阿里云百炼 (Qwen/通义千问)** 大模型，生成结构化的 JSON 行程数据。
*   **🗺️ 地图可视化**: 集成 **高德地图 (AMap)**，根据行程地点自动定位展示。
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

### 1. 环境准备
确保你的环境已安装：
*   Python 3.10+
*   Node.js 18+ & npm

### 2. 获取 API Key
本项目需要以下服务的 API Key 才能正常运行：
*   **AI 能力**: [阿里云百炼 (DashScope)](https://bailian.console.aliyun.com/)
*   **地图服务**: [高德地图开放平台 (AMap)](https://console.amap.com/) (Web 端 JS API)

### 3. 后端设置

```bash
# 1. 进入项目根目录
cd ai-travel-planner

# 2. 创建并激活虚拟环境
python3 -m venv venv
source venv/bin/activate  # Linux/macOS
# venv\Scripts\activate   # Windows

# 3. 安装依赖
pip install -r backend/requirements.txt

# 4. 配置环境变量
cp backend/.env.example backend/.env
# ⚠️ 编辑 backend/.env 文件，填入你的 DASHSCOPE_API_KEY
```

### 4. 前端设置

```bash
# 1. 进入前端目录
cd frontend

# 2. 安装依赖
npm install

# 3. 配置环境变量
cp .env.example .env
# ⚠️ 编辑 frontend/.env 文件，填入你的 VITE_AMAP_KEY 和 VITE_AMAP_SECURITY_CODE
```

### 5. 启动项目

你需要打开两个终端窗口分别启动前后端。

**终端 1 (后端):**
```bash
# 确保在根目录下且已激活虚拟环境
source venv/bin/activate
uvicorn backend.main:app --reload
# 服务运行在: http://localhost:8000
```

**终端 2 (前端):**
```bash
cd frontend
npm run dev
# 服务运行在: http://localhost:5173
```

打开浏览器访问 `http://localhost:5173` 即可开始使用！

---

## 📂 项目结构

```
ai-travel-planner/
├── backend/                 # Python FastAPI 后端
│   ├── routers/             # API 路由定义
│   ├── services/            # 业务逻辑 (AI 调用封装)
│   ├── models.py            # 数据库模型
│   ├── schemas.py           # Pydantic 数据验证模式
│   ├── main.py              # 应用入口
│   └── database.py          # 数据库连接
├── frontend/                # React TypeScript 前端
│   ├── src/
│   │   ├── components/      # UI 组件 (地图, 语音, 行程列表)
│   │   ├── services/        # API 请求封装
│   │   └── App.tsx          # 主页面
│   └── ...
└── README.md
```

## 📝 开发注意事项

*   **语音识别**: 浏览器的 Web Speech API 在某些浏览器（如 Chrome）中可能需要 HTTPS 环境或 localhost 才能正常工作。
*   **地图 Key**: 确保高德地图 Key 的类型是 "Web端 (JS API)"，并且正确配置了安全密钥 (Security Code)，否则地图可能无法加载。

## 🤝 贡献

欢迎提交 Issue 或 Pull Request！

## 📄 License

MIT
