FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@9 --activate

# ── Dependencies ──
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/acp/package.json apps/acp/
COPY packages/shared/package.json packages/shared/
COPY packages/api-client/package.json packages/api-client/
COPY packages/config/package.json packages/config/
RUN pnpm install --frozen-lockfile

# ── Build ──
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/acp/node_modules ./apps/acp/node_modules
COPY --from=deps /app/packages ./packages
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm turbo build --filter=acp

# ── Runner ──
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/apps/acp/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/apps/acp/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/acp/.next/static ./apps/acp/.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "apps/acp/server.js"]
