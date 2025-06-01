#!/bin/bash

# Emergency fix script for production OpenSSL/Prisma issues

set -e

echo "🚨 Emergency Production Fix for OpenSSL/Prisma Issues"
echo "======================================================"

# Stop everything and clean up
echo "🛑 Stopping all containers and cleaning up..."
docker-compose -f docker-compose.yml -f docker-compose.prod.yml down -v

echo "🗑️  Removing all Docker images and build cache..."
docker system prune -a --volumes -f

echo "📥 Pulling latest code changes..."
git pull

echo "🔨 Building fresh images with node:18-slim (includes OpenSSL)..."
docker-compose -f docker-compose.yml -f docker-compose.prod.yml build --no-cache

echo "🚀 Starting deployment with fixed images..."
./scripts/deploy-simple.sh

echo ""
echo "✅ Fix applied! The deployment should now work properly."
echo ""
echo "If you still see errors, check:"
echo "1. Your .env.production file has all required values"
echo "2. The database password matches in .env.production and docker-compose"
echo "3. Run: docker-compose -f docker-compose.yml -f docker-compose.prod.yml logs -f" 