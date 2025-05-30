# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY turbo.json ./
COPY apps/api/package*.json ./apps/api/
COPY packages/database/package*.json ./packages/database/
COPY packages/typescript-config/package*.json ./packages/typescript-config/
COPY packages/eslint-config/package*.json ./packages/eslint-config/

# Install dependencies
RUN npm ci

# Copy source files
COPY apps/api ./apps/api
COPY packages ./packages

# Generate Prisma client
WORKDIR /app/packages/database
RUN npx prisma generate

# Build the application
WORKDIR /app
RUN npm run build --workspace=apps/api

# Production stage
FROM node:18-alpine AS production

RUN apk add --no-cache curl

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY turbo.json ./
COPY apps/api/package*.json ./apps/api/
COPY packages/database/package*.json ./packages/database/

# Install production dependencies only
RUN npm ci --only=production

# Copy built application and Prisma client
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/packages/database/node_modules/.prisma ./packages/database/node_modules/.prisma
COPY --from=builder /app/packages/database/prisma ./packages/database/prisma

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001
USER nestjs

EXPOSE 3000

# Start the application
CMD ["node", "apps/api/dist/main.js"] 