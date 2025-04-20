FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
# in /app/react

FROM node:20-alpine
WORKDIR /app/react
COPY --from=builder /app/react .