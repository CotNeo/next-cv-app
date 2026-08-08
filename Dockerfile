# syntax=docker/dockerfile:1

# ---- deps ----------------------------------------------------------------
FROM node:20-alpine AS deps
WORKDIR /app
RUN apk add --no-cache libc6-compat
COPY package.json package-lock.json ./
COPY postcss-oklch-to-rgb ./postcss-oklch-to-rgb
RUN npm ci

# ---- build ---------------------------------------------------------------
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Switches next.config.ts to `output: 'standalone'`.
ENV DOCKER_BUILD=1
ENV NEXT_TELEMETRY_DISABLED=1
# Build-time placeholders only. Real secrets are injected at runtime; the build
# never connects to the database or the AI provider.
ENV NEXTAUTH_SECRET=build-time-placeholder-secret-value
RUN npm run build

# ---- runtime -------------------------------------------------------------
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "server.js"]
