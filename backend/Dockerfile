FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm install --production --ignore-scripts && npm cache clean --force
COPY src ./src
CMD ["node", "src/index.js"]
