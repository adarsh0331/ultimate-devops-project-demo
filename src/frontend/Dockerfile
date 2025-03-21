# Copyright The OpenTelemetry Authors
# SPDX-License-Identifier: Apache-2.0


# Base stage for installing dependencies
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat

WORKDIR /app
COPY ./src/frontend/package*.json ./
RUN npm ci

# Builder stage for compiling and packaging
FROM node:20-alpine AS builder
RUN apk add --no-cache libc6-compat protobuf-dev protoc
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY ./pb ./pb
COPY ./src/frontend ./src/frontend

RUN npm run grpc:generate
RUN npm run build

# Runner stage for final app
FROM node:20-alpine AS runner
WORKDIR /app
RUN apk add --no-cache protobuf-dev protoc

ENV NODE_ENV=production
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/utils/telemetry/Instrumentation.js ./utils/telemetry/Instrumentation.js
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=deps /app/node_modules ./node_modules

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./standalone
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./static

USER nextjs

ENV PORT=8080
EXPOSE ${PORT}

ENTRYPOINT ["npm", "start"]
