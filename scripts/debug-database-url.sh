#!/bin/bash

# Script to debug DATABASE_URL issues

echo "🔍 Debugging DATABASE_URL Construction..."
echo "========================================"

# Check .env.production
echo "📋 Current .env.production values:"
if [ -f .env.production ]; then
    grep -E "DB_PASSWORD|DATABASE_URL|JWT_SECRET" .env.production
else
    echo "❌ .env.production not found!"
    exit 1
fi

# Load env vars
export $(cat .env.production | grep -v '^#' | xargs)

# Show what Docker Compose will use
echo ""
echo "🔧 Environment variables loaded:"
echo "DB_PASSWORD=$DB_PASSWORD"

# Check what's actually in the API container
echo ""
echo "📦 DATABASE_URL in API container:"
docker-compose -f docker-compose.yml -f docker-compose.prod.yml run --rm api sh -c 'echo "DATABASE_URL=$DATABASE_URL"'

# Check if there's a DATABASE_URL override in .env.production
echo ""
echo "⚠️  Checking for DATABASE_URL override in .env.production:"
grep "^DATABASE_URL=" .env.production && echo "Found DATABASE_URL override - this might be the issue!" || echo "No DATABASE_URL override found (good)"

# Construct the correct DATABASE_URL
echo ""
echo "✅ The DATABASE_URL should be:"
echo "postgresql://everapharm_user:EveraPharm2024SecureDB@postgres:5432/everapharm_prod"

# Test with a manual connection
echo ""
echo "🧪 Testing manual database connection from API container:"
docker-compose -f docker-compose.yml -f docker-compose.prod.yml run --rm -e DATABASE_URL="postgresql://everapharm_user:EveraPharm2024SecureDB@postgres:5432/everapharm_prod" api sh -c "cd packages/database && npx prisma db pull --print" 