# 使用官方轻量级 Python 镜像
FROM python:3.10-slim

# 设置工作目录为 /workspace
WORKDIR /workspace

# 复制依赖文件
COPY requirements.txt .

# 安装依赖
# 增加 --no-cache-dir 减小镜像体积
RUN pip install --no-cache-dir -r requirements.txt

# 将当前目录（backend 文件夹的内容）复制到容器的 /workspace/backend
COPY . ./backend

# 设置 PYTHONPATH，确保可以直接导入 backend 模块
ENV PYTHONPATH=/workspace

# 暴露端口
EXPOSE 8000

# 启动命令
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
