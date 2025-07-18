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

# Install dependencies (skip Prisma postinstall to avoid engine downloads)
RUN PRISMA_SKIP_POSTINSTALL_GENERATE=1 npm ci

# Copy source code
COPY . .

# Generate Prisma Client with offline mode and ignore missing engines
RUN cd packages/database && \
    PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1 \
    PRISMA_CLI_BINARY_TARGETS=native \
    npx prisma generate --skip-download || \
    npx prisma generate --generator client

# Build the application
RUN npm run build --workspace=apps/api

# Copy the Prisma query engine to the dist folder (if it exists)
RUN cp ./node_modules/.prisma/client/libquery_engine-debian-openssl-3.0.x.so.node ./apps/api/dist/ || echo "Engine file not found, skipping copy"

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
COPY --from=builder /app/node_modules/.prisma/client ./node_modules/.prisma/client

# Copy built application
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/node_modules/.prisma/client/libquery_engine-debian-openssl-3.0.x.so.node .

# Copy Prisma schema for migrations
COPY packages/database/prisma ./packages/database/prisma

# Expose port
EXPOSE 3000

# Set environment
ENV NODE_ENV=production
ENV PRISMA_QUERY_ENGINE_LIBRARY=/app/libquery_engine-debian-openssl-3.0.x.so.node

# Start the application
CMD ["node", "apps/api/dist/main.js"] 