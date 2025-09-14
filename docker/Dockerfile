# syntax=docker.io/docker/dockerfile:1

FROM oven/bun:1-alpine AS basebun
FROM node:24-alpine AS base

# Install dependencies only when needed
FROM basebun AS builddeps
WORKDIR /app

# Install dependencies (including dev dependencies) for building
COPY package.json bun.lock ./
RUN bun install

FROM basebun AS rundeps
WORKDIR /app

# Install production dependencies for db and scraper
COPY package.json bun.lock ./
RUN bun install --production

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=builddeps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

COPY --from=rundeps /app/node_modules ./node_modules

ENV NODE_ENV=production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# drizzle and scraper stuff
COPY --chown=nextjs:nodejs src/lib/db ./src/lib/db
COPY --chown=nextjs:nodejs scraper ./scraper
COPY --chown=nextjs:nodejs drizzle ./drizzle
COPY --chown=nextjs:nodejs package.json drizzle.config.ts ./

# entrypoint script
COPY --chown=nextjs:nodejs docker/entrypoint.sh ./entrypoint.sh

USER nextjs

ENV PORT=3000

EXPOSE $PORT

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/config/next-config-js/output
ENV HOSTNAME="0.0.0.0"

ENTRYPOINT ["./entrypoint.sh"]
CMD ["node", "./server.js"]
