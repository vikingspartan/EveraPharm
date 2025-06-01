#!/bin/bash

# Direct migration script with explicit DATABASE_URL

echo "🗄️  Running Direct Database Migration..."
echo "======================================="

# Stop API to avoid conflicts
echo "🛑 Stopping API..."
docker-compose -f docker-compose.yml -f docker-compose.prod.yml stop api

# Run migration with explicit DATABASE_URL
echo ""
echo "🔄 Running Prisma migration with explicit DATABASE_URL..."
docker-compose -f docker-compose.yml -f docker-compose.prod.yml run --rm \
  -e DATABASE_URL="postgresql://everapharm_user:EveraPharm2024SecureDB@postgres:5432/everapharm_prod" \
  api sh -c "cd /app/packages/database && npx prisma migrate deploy"

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Migration successful!"
    
    # Start API
    echo ""
    echo "🚀 Starting API..."
    docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d api
    
    sleep 10
    
    # Check health
    echo ""
    echo "🏥 Checking API health..."
    curl -s http://localhost:3000/api/health | jq . || curl -s http://localhost:3000/api/health
    
    echo ""
    echo "✅ Database is now set up!"
else
    echo ""
    echo "❌ Migration failed"
    echo "Trying alternative approach..."
    
    # Try with just prisma commands
    docker-compose -f docker-compose.yml -f docker-compose.prod.yml run --rm \
      -e DATABASE_URL="postgresql://everapharm_user:EveraPharm2024SecureDB@postgres:5432/everapharm_prod" \
      api sh -c "cd /app/packages/database && ls -la && npx prisma --version && npx prisma migrate deploy --schema=./prisma/schema.prisma"
fi 