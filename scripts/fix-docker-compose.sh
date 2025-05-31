#!/bin/bash

# Quick fix for Docker Compose v1 issues on production server

set -e

echo "🔧 Fixing Docker Compose issues..."

# Install Docker Compose v2 plugin
echo "📦 Installing Docker Compose v2..."
sudo apt-get update
sudo apt-get install -y docker-compose-plugin

# Verify installation
echo "✅ Docker Compose v2 installed:"
docker compose version

# Check for .env.production
if [ ! -f .env.production ]; then
    echo "⚠️  .env.production not found. Creating from example..."
    cp env.production.example .env.production
    echo ""
    echo "📝 IMPORTANT: Edit .env.production with your actual values:"
    echo "   - DB_PASSWORD"
    echo "   - JWT_SECRET"
    echo "   - NEXT_PUBLIC_API_URL"
    echo "   - CORS_ORIGIN"
    echo ""
    echo "Then run this script again."
    exit 1
fi

# Export environment variables
export $(cat .env.production | grep -v '^#' | xargs)

# Clean up any existing containers
echo "🧹 Cleaning up..."
docker compose down -v || true
docker system prune -af

# Start services
echo "🚀 Starting services..."
docker compose up -d postgres
sleep 10

# Generate Prisma client
echo "🔧 Generating Prisma client..."
docker compose run --rm api sh -c "cd packages/database && npx prisma generate"

# Run migrations
echo "🔄 Running migrations..."
docker compose run --rm api npm run migrate:prod

# Start remaining services
docker compose up -d

# Wait for services
echo "⏳ Waiting for services to start..."
sleep 20

# Check status
echo ""
echo "📊 Service Status:"
docker compose ps

echo ""
echo "📝 Check logs with:"
echo "   docker compose logs api"
echo "   docker compose logs web"
echo "   docker compose logs nginx"

echo ""
echo "🔍 Test endpoints:"
echo "   curl http://localhost:3000/api/health"
echo "   curl http://localhost:3001" 