FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./ 
RUN npm install
COPY . ./ 
RUN npm run export:docker
# in /app/dist


FROM node:20-alpine

WORKDIR /app
COPY --from=order-platform-microservice/frontend /app/react /app/static
COPY --from=builder /app .
EXPOSE 3000
CMD ["node", "dist/index.mjs"]