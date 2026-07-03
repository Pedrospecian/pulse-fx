# Contexto de build = raiz do monorepo, para manter o mesmo padrão dos
# demais serviços (embora o gateway não dependa de nenhum workspace).

FROM node:20-alpine AS build
WORKDIR /app

COPY apps/gateway/package*.json ./
RUN npm install

COPY apps/gateway .
RUN npm run build

# --- runtime stage ---
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production

COPY apps/gateway/package*.json ./
RUN npm install --omit=dev
COPY --from=build /app/dist ./dist

EXPOSE 4000
CMD ["node", "dist/index.js"]
