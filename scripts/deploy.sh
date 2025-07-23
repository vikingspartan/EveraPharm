#!/bin/bash

# EveraPharma Deployment Script
# This script handles the deployment process for the EveraPharma platform

set -e

echo "🚀 Starting EveraPharma deployment..."

# Load environment variables
if [ -f .env.production ]; then
    export $(cat .env.production | grep -v '^#' | xargs)
else
    echo "⚠️  Warning: .env.production file not found"
fi

# Check required environment variables
required_vars=("DB_PASSWORD" "JWT_SECRET" "NEXT_PUBLIC_API_URL" "CORS_ORIGIN")
for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        echo "❌ Error: $var is not set"
        exit 1
    fi
done

# Pull latest changes
echo "📥 Pulling latest changes from git..."
git pull origin main

# Build Docker images
echo "🔨 Building Docker images..."
docker-compose build --no-cache

# Stop existing containers
echo "🛑 Stopping existing containers..."
# Use stop and rm instead of down to handle stuck containers better
docker-compose stop || true
docker-compose rm -f || true

# Start database first
echo "🗄️  Starting database..."
docker-compose up -d postgres

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 10

# Generate Prisma client before migrations
echo "🔧 Generating Prisma client..."
docker-compose run --rm api sh -c "cd packages/database && npx prisma generate"

# Run database migrations
echo "🔄 Running database migrations..."
docker-compose run --rm api npm run migrate:prod

# Start all services
echo "🚀 Starting all services..."
docker-compose up -d

# Wait for services to be healthy
echo "⏳ Waiting for services to be healthy..."
sleep 20

# Health check
echo "🏥 Performing health checks..."

# Check API health
api_health=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/health || echo "000")
if [ "$api_health" = "200" ]; then
    echo "✅ API is healthy"
else
    echo "❌ API health check failed (HTTP $api_health)"
    docker-compose logs api
    exit 1
fi

# Check web health
web_health=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001 || echo "000")
if [ "$web_health" = "200" ]; then
    echo "✅ Web app is healthy"
else
    echo "❌ Web app health check failed (HTTP $web_health)"
    docker-compose logs web
    exit 1
fi

# Check nginx
nginx_health=$(curl -s -o /dev/null -w "%{http_code}" http://localhost || echo "000")
if [ "$nginx_health" = "301" ] || [ "$nginx_health" = "200" ]; then
    echo "✅ Nginx is healthy"
else
    echo "❌ Nginx health check failed (HTTP $nginx_health)"
    docker-compose logs nginx
    exit 1
fi

# Clean up old images
echo "🧹 Cleaning up old Docker images..."
docker image prune -f

echo "✨ Deployment completed successfully!"
echo ""
echo "📊 Service Status:"
docker-compose ps

echo ""
echo "🔗 Access your services at:"
echo "   - Web: https://everapharm.com"
echo "   - API: https://api.everapharm.com"
echo ""
echo "📝 View logs with: docker-compose logs -f [service_name]" 