#!/bin/bash

# Script to fix web container port issues

set -e

echo "🔧 Fixing web container port configuration..."

# Stop the problematic web container
echo "🛑 Stopping web container..."
docker-compose -f docker-compose.yml -f docker-compose.prod.yml stop web
docker-compose -f docker-compose.yml -f docker-compose.prod.yml rm -f web

# Restart just the web service with correct configuration
echo "🚀 Starting web service with fixed port..."
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d web

# Wait a moment
sleep 5

# Check if it's running
echo "📊 Checking web container status..."
docker-compose -f docker-compose.yml -f docker-compose.prod.yml ps web

# Show logs
echo ""
echo "📝 Web container logs:"
docker-compose -f docker-compose.yml -f docker-compose.prod.yml logs --tail=20 web

echo ""
echo "✅ Port fix applied!"
echo ""
echo "Test the web app:"
echo "  - Direct: curl http://localhost:3001"
echo "  - Through nginx: curl http://localhost"
echo ""
echo "If still having issues, check:"
echo "  docker-compose -f docker-compose.yml -f docker-compose.prod.yml logs -f web" 