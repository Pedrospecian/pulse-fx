# Contexto de build = raiz do monorepo (ver docker-compose.yml), porque este
# serviço depende dos workspaces @pulse-fx/db e @pulse-fx/core.

FROM node:20-alpine AS build
WORKDIR /app

# Prisma precisa do OpenSSL para os engines nativos (musl + OpenSSL 3 no Alpine).
RUN apk add --no-cache openssl

COPY package*.json ./
COPY packages/db/package*.json ./packages/db/
COPY packages/core/package*.json ./packages/core/
COPY apps/api-sync/package*.json ./apps/api-sync/
RUN npm install

COPY packages/db ./packages/db
COPY packages/core ./packages/core
COPY apps/api-sync ./apps/api-sync

# Ordem importa: db (gera o client Prisma + compila) -> core (compila, depende do db) -> app
RUN npm run generate -w packages/db
RUN npm run build -w packages/db
RUN npm run build -w packages/core
RUN npm run build -w apps/api-sync

# --- runtime stage ---
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production

RUN apk add --no-cache openssl

# Copiamos o /app inteiro (node_modules + workspaces já buildados) em vez de
# reinstalar aqui: reinstalar sem rodar "prisma generate" de novo deixaria o
# client do Prisma ausente e o serviço cairia em loop de restart.
COPY --from=build /app /app

WORKDIR /app/apps/api-sync
EXPOSE 4002
CMD ["node", "dist/index.js"]
