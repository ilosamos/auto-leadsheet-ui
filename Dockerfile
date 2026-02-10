# ---- Stage 1: Install dependencies ----
FROM node:22-alpine AS deps

RUN corepack enable && corepack prepare yarn@4.12.0 --activate

WORKDIR /app

COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn .yarn

RUN yarn install --immutable

# ---- Stage 2: Build the application ----
FROM node:22-alpine AS builder

RUN corepack enable && corepack prepare yarn@4.12.0 --activate

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/.yarn ./.yarn
COPY --from=deps /app/.yarnrc.yml ./
COPY . .

# Build-time env vars (inlined into the JS bundle by Next.js)
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_GOOGLE_CLIENT_ID

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_GOOGLE_CLIENT_ID=$NEXT_PUBLIC_GOOGLE_CLIENT_ID

RUN yarn build

# ---- Stage 3: Production runner ----
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy public assets
COPY --from=builder /app/public ./public

# Copy standalone output
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
