FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./ 
RUN npm install
COPY . ./ 


ARG NODE_ENV=DOCKER
ENV NODE_ENV=${NODE_ENV}
RUN npm run export:docker
# in /app/dist


FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app .
EXPOSE 3443
CMD ["node", "dist/index.mjs"]