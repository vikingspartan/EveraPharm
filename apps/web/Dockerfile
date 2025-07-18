# Build stage
FROM node:20-slim AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY apps/web/package*.json ./apps/web/
COPY packages/ui/package*.json ./packages/ui/
COPY packages/tailwind-config/package*.json ./packages/tailwind-config/
COPY packages/typescript-config/package*.json ./packages/typescript-config/
COPY packages/eslint-config/package*.json ./packages/eslint-config/

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the UI package first to ensure styles are generated
RUN npm run build --workspace=@repo/ui

# Build the application
RUN npm run build --workspace=apps/web

# Production stage
FROM node:20-slim

WORKDIR /app

# Copy built application from the standalone output
# This includes all necessary production node_modules
COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./.next/static
COPY --from=builder /app/apps/web/public ./public

# Expose port
EXPOSE 3000

# Set environment
ENV NODE_ENV=production
ENV PORT=3000

# Start the application using the standalone server file
CMD ["node", "server.js"] 