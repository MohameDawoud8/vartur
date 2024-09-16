# Use Node.js 20 with Alpine Linux as the base image
FROM node:20-alpine AS base

# STAGE 01: Dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# STAGE 02: Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
# Set environment variables and use flags to forcefully skip checks
ENV NEXT_TELEMETRY_DISABLED 1
RUN npx next build --no-lint

# STAGE 03: Runner
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
# COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

# Copy necessary files for Prisma
COPY --from=builder /app/node_modules/.prisma/client  ./node_modules/.prisma/client

# Copy the entire .next directory
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next

# Copy node_modules
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000
ENV PORT 3000

# Add necessary network troubleshooting tools
RUN apk add --no-cache iputils bind-tools

# Add a script to wait for MySQL and run migrations before starting the app
COPY docker-entrypoint.sh /app/docker-entrypoint.sh
RUN chmod +x /app/docker-entrypoint.sh

ENTRYPOINT ["/app/docker-entrypoint.sh"]
CMD ["npm", "start"]