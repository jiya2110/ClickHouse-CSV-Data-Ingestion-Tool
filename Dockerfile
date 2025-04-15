# Dockerfile

# Stage 1: Build React App
FROM node:18 AS builder
WORKDIR /app
COPY client ./client
WORKDIR /app/client
RUN npm install
RUN npm run build

# Stage 2: Serve with Static Server
FROM node:18-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/client/dist ./dist
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]