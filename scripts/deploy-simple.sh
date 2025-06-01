#!/bin/bash

# Simplified deployment script for quick production setup

set -e

echo "🚀 Starting simplified EveraPharma deployment..."

# Check for .env.production
if [ ! -f .env.production ]; then
    echo "❌ .env.production not found!"
    echo "Creating from example..."
    cp env.production.example .env.production
    echo ""
    echo "📝 Please edit .env.production with your actual values:"
    echo "   - DB_PASSWORD"
    echo "   - JWT_SECRET" 
    echo "   - NEXT_PUBLIC_API_URL (use http://api.everapharm.com for now)"
    echo "   - CORS_ORIGIN"
    exit 1
fi

# Export environment variables
export $(cat .env.production | grep -v '^#' | xargs)

# Stop any existing containers
echo "🛑 Stopping existing containers..."
docker compose -f docker-compose.yml -f docker-compose.prod.yml down

# Pull latest images if needed
echo "📥 Pulling images..."
docker compose -f docker-compose.yml -f docker-compose.prod.yml pull

# Start database first
echo "🗄️ Starting database..."
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d postgres

# Wait for database
echo "⏳ Waiting for database..."
sleep 15

# Run Prisma migrations
echo "🔄 Running database setup..."
docker compose -f docker-compose.yml -f docker-compose.prod.yml run --rm api sh -c "cd packages/database && npx prisma generate && cd /app && npm run migrate:prod"

# Start all services
echo "🚀 Starting all services..."
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Wait for services to start
echo "⏳ Waiting for services to start..."
sleep 20

# Check status
echo ""
echo "📊 Service Status:"
docker compose -f docker-compose.yml -f docker-compose.prod.yml ps

echo ""
echo "📝 Check logs:"
echo "   docker compose -f docker-compose.yml -f docker-compose.prod.yml logs api"
echo "   docker compose -f docker-compose.yml -f docker-compose.prod.yml logs web"
echo "   docker compose -f docker-compose.yml -f docker-compose.prod.yml logs nginx"

echo ""
echo "🔍 Test your deployment:"
echo "   API Health: curl http://your-server-ip:3000/api/health"
echo "   Web App: curl http://your-server-ip:3001"
echo "   Nginx: curl http://your-server-ip"

echo ""
echo "⚠️  Note: This is HTTP only. Set up SSL certificates after confirming everything works!" 