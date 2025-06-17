# syntax=docker.io/docker/dockerfile:1

# Base image with Node 24
FROM node:24-alpine AS base

# =============================
# 1. Dependencies Layer
# =============================
FROM base AS deps

# Add compatibility libs (e.g. for sharp)
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy lockfiles and config
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* ./

# Install dependencies using appropriate tool
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i; \
  else echo "Lockfile not found." && exit 1; \
  fi

# =============================
# 2. Build Layer
# =============================
FROM base AS builder

WORKDIR /app

# Reuse installed dependencies
COPY --from=deps /app/node_modules ./node_modules

# Copy project source
COPY . .

# Build Next.js (output: .next)
RUN npm run build

# =============================
# 3. Production Runtime
# =============================
FROM base AS runner

WORKDIR /app

ENV NODE_ENV=production

# Create non-root user
RUN addgroup -g 1001 -S nodejs \
  && adduser -S nextjs -u 1001 -G nodejs

# Copy public assets
COPY --from=builder /app/public ./public

# Copy standalone server and static files
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000

ENV HOSTNAME=0.0.0.0

# Run standalone Next.js server
CMD ["node", "server.js"]
