FROM node:20-alpine AS build
WORKDIR /app

RUN apk add --no-cache openssl

COPY package*.json ./
COPY packages/db/package*.json ./packages/db/
COPY packages/core/package*.json ./packages/core/
COPY apps/api-public/package*.json ./apps/api-public/
RUN npm install

COPY packages/db ./packages/db
COPY packages/core ./packages/core
COPY apps/api-public ./apps/api-public

RUN npm run generate -w packages/db
RUN npm run build -w packages/db
RUN npm run build -w packages/core
RUN npm run build -w apps/api-public

# --- runtime stage ---
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production

RUN apk add --no-cache openssl

COPY --from=build /app /app

WORKDIR /app/apps/api-public
EXPOSE 4001
CMD ["node", "dist/index.js"]
