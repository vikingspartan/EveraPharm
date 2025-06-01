#!/bin/bash

# Script to run database migrations

echo "🗄️  Running Database Migrations..."
echo "================================="

# Check if API is running
echo "📊 Checking API status..."
docker-compose -f docker-compose.yml -f docker-compose.prod.yml ps api

# Stop API if it's in a restart loop
echo ""
echo "🛑 Stopping API to run migrations..."
docker-compose -f docker-compose.yml -f docker-compose.prod.yml stop api

# Run migrations using a fresh container
echo ""
echo "🔄 Running Prisma migrations..."
docker-compose -f docker-compose.yml -f docker-compose.prod.yml run --rm api sh -c "cd /app/packages/database && npx prisma migrate deploy"

# Check if migrations were successful
if [ $? -eq 0 ]; then
    echo "✅ Migrations completed successfully!"
    
    # Start API again
    echo ""
    echo "🚀 Starting API..."
    docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d api
    
    # Wait and check
    echo ""
    echo "⏳ Waiting for API to start..."
    sleep 10
    
    # Check logs
    echo ""
    echo "📝 API logs:"
    docker-compose -f docker-compose.yml -f docker-compose.prod.yml logs --tail=20 api
    
    # Test API
    echo ""
    echo "🏥 Testing API health:"
    curl -s http://localhost:3000/api/health || echo "API might still be starting..."
else
    echo "❌ Migrations failed!"
    echo "Check the error messages above"
fi 