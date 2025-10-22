FROM node:20-alpine AS build
WORKDIR /app
ARG VITE_API_BASE=http://localhost:4000
ARG VITE_AMAP_KEY=
ENV VITE_API_BASE=$VITE_API_BASE
ENV VITE_AMAP_KEY=$VITE_AMAP_KEY
COPY package*.json ./
RUN npm install && npm cache clean --force
COPY . .
RUN npm run build

FROM nginx:1.25-alpine AS production
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
