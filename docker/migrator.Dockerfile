# syntax=docker.io/docker/dockerfile:1

FROM oven/bun:1-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Install production dependencies for db and scraper
COPY package.json bun.lock ./
RUN bun install --production --frozen-lockfile

# Production image, copy all dependencies and run migrations
FROM base AS runner
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

COPY src/lib/db ./src/lib/db
COPY scraper ./scraper
COPY drizzle ./drizzle
COPY package.json drizzle.config.ts ./

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 bubun

USER bubun

CMD ["bun", "run", "db:migrate"]