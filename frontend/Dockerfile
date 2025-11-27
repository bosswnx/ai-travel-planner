# 使用 Node.js 18 Alpine 镜像
FROM node:20-alpine

WORKDIR /app

# 复制依赖定义
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制源代码
COPY . .

# 暴露 Vite 默认端口
EXPOSE 5173

# 启动开发服务器，并允许外部访问 (--host)
CMD ["npm", "run", "dev", "--", "--host"]
