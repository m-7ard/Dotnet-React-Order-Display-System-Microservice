FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./ 
RUN npm install
COPY . ./ 
RUN npm run export:docker
# in /app/dist

FROM node:20-alpine

WORKDIR /app
COPY --from=builder /app .
EXPOSE 3100
EXPOSE 8080
CMD ["node", "dist/index.mjs"]