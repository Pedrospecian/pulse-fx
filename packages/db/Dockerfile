# Executa "prisma migrate deploy" contra o Postgres e finaliza.
# Usado no docker-compose como um init container (depends_on: service_completed_successfully).
FROM node:20-alpine
WORKDIR /app

# Prisma precisa do OpenSSL para os engines nativos; sem isso o schema-engine
# falha ao iniciar e imprime um erro de texto em vez de JSON.
RUN apk add --no-cache openssl

COPY packages/db/package*.json ./packages/db/
COPY package*.json ./
RUN npm install --workspace=packages/db --include-workspace-root

COPY packages/db ./packages/db

WORKDIR /app/packages/db
RUN npx prisma generate

CMD ["npx", "prisma", "migrate", "deploy"]
