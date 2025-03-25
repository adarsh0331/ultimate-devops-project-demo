# Base image for dependencies
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat protobuf-dev protoc

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

# Build stage
FROM node:20-alpine AS builder
RUN apk add --no-cache libc6-compat protobuf-dev protoc 

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Ensure TypeScript and ESLint dependencies are installed
RUN npm install --save-dev typescript @types/react eslint

# Generate gRPC files & build project
RUN npm run grpc:generate
RUN npm run build

# Production runner stage
FROM node:20-alpine AS runner
WORKDIR /app

# Install required system dependencies
RUN apk add --no-cache libc6-compat

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8080

# Create non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001 -G nodejs

# Copy built files from builder stage
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/utils/telemetry/Instrumentation.js ./utils/telemetry/Instrumentation.js
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=deps /app/node_modules ./node_modules

# Ensure correct ownership for Next.js standalone output
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
RUN chown -R nextjs:nodejs /app

# Switch to non-root user
USER nextjs

# Expose the app port
EXPOSE ${PORT}

# Run the Next.js application
CMD ["npm", "start"]
