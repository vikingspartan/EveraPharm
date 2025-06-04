#!/bin/bash

# Script to fix CSS issues in production

set -e

echo "🔧 Fixing CSS issues in production..."

# Navigate to project root
cd /opt/everapharm

# Pull latest changes if not already done
echo "📥 Ensuring latest code..."
git pull origin main

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose -f docker-compose.yml -f docker-compose.prod.yml down

# Clean build cache to ensure fresh build
echo "🧹 Cleaning Docker build cache..."
docker system prune -f

# Rebuild with no cache to ensure CSS is properly included
echo "🏗️ Rebuilding containers with fixed CSS handling..."
docker-compose -f docker-compose.yml -f docker-compose.prod.yml build --no-cache web

# Start all services
echo "🚀 Starting services..."
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 20

# Check status
echo "📊 Service status:"
docker-compose -f docker-compose.yml -f docker-compose.prod.yml ps

echo ""
echo "✅ CSS fix deployment complete!"
echo ""
echo "🔍 Please check:"
echo "   - https://everapharm.com (styles should now load)"
echo "   - View page source to verify CSS files are linked"
echo "   - Check browser DevTools Network tab for CSS files"
echo ""
echo "📝 If issues persist, check logs:"
echo "   docker-compose -f docker-compose.yml -f docker-compose.prod.yml logs web" 