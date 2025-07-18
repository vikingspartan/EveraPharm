# Build stage
FROM node:20-slim AS builder

# Install OpenSSL and other dependencies
RUN apt-get update -y && \
    apt-get install -y openssl curl && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY apps/api/package*.json ./apps/api/
COPY packages/database/package*.json ./packages/database/
COPY packages/typescript-config/package*.json ./packages/typescript-config/
COPY packages/eslint-config/package*.json ./packages/eslint-config/

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma Client
RUN cd packages/database && npx prisma generate

# Build the application
RUN npm run build --workspace=apps/api

# Production stage
FROM node:20-slim

# Install OpenSSL and curl for health checks
RUN apt-get update -y && \
    apt-get install -y openssl curl && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package.json files to allow running npm scripts
COPY package.json ./
COPY apps/api/package.json ./apps/api/
COPY packages/database/package.json ./packages/database/

# Copy the entire node_modules from the builder stage
# This includes all production dependencies for all workspaces
COPY --from=builder /app/node_modules ./node_modules

# Copy built application
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/packages ./packages

# Copy Prisma schema for migrations
COPY packages/database/prisma ./packages/database/prisma

# Generate Prisma Client in production stage
RUN cd packages/database && npx prisma generate

# Expose port
EXPOSE 3000

# Set environment
ENV NODE_ENV=production

# Start the application
CMD ["node", "apps/api/dist/main.js"] 