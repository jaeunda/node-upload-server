# build stage
FROM node:20-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build && npm prune --production
# runtime stage
FROM node:20-slim
RUN useradd -m appuser -u 10001
WORKDIR /app
COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
USER 10001
EXPOSE 3000
CMD ["node", "dist/index.js"]