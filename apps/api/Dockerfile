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

# Copy prisma schema before installing
COPY packages/database/prisma ./packages/database/prisma

# Install dependencies
RUN npm ci

# Copy source files
COPY apps/api ./apps/api
COPY packages ./packages

# Generate Prisma client
RUN cd packages/database && npx prisma generate

# Build the application
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

# Copy prisma schema
COPY packages/database/prisma ./packages/database/prisma

# Install production dependencies only
RUN npm ci --only=production

# Generate Prisma client in production stage
RUN cd packages/database && npx prisma generate

# Copy built application
COPY --from=builder /app/apps/api/dist ./apps/api/dist

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

# Change ownership of the app directory
RUN chown -R nestjs:nodejs /app

USER nestjs

EXPOSE 3000

# Start the application
CMD ["node", "apps/api/dist/main.js"] 