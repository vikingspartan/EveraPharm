#!/bin/bash

# Script to fix OpenSSL issues with Prisma in Docker

set -e

echo "🔧 Fixing OpenSSL issues for Prisma..."

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose -f docker-compose.yml -f docker-compose.prod.yml down

# Remove old images to force rebuild
echo "🗑️  Removing old images..."
docker rmi everapharm-api everapharm-web 2>/dev/null || true

# Build with new Dockerfiles
echo "🔨 Building with updated Dockerfiles (node:18-slim with OpenSSL)..."
docker-compose -f docker-compose.yml -f docker-compose.prod.yml build --no-cache

# Start database first
echo "🗄️ Starting database..."
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d postgres

# Wait for database
echo "⏳ Waiting for database..."
sleep 15

# Run migrations with the new image
echo "🔄 Running database migrations..."
docker-compose -f docker-compose.yml -f docker-compose.prod.yml run --rm api sh -c "cd packages/database && npx prisma generate && cd /app && npm run migrate:prod"

# Start all services
echo "🚀 Starting all services..."
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

echo "✅ OpenSSL fix applied! Services should now start properly."
echo ""
echo "📝 Check status with:"
echo "   docker-compose -f docker-compose.yml -f docker-compose.prod.yml ps"
echo "   docker-compose -f docker-compose.yml -f docker-compose.prod.yml logs -f" 