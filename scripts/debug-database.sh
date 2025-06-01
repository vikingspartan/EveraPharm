#!/bin/bash

# Script to debug database connection issues

set -e

echo "🔍 Debugging Database Connection..."
echo "=================================="

# Check environment variables
echo "📋 Checking environment variables in API container:"
docker-compose -f docker-compose.yml -f docker-compose.prod.yml exec api sh -c 'echo "DATABASE_URL: $DATABASE_URL"'

echo ""
echo "📋 Checking .env.production file:"
if [ -f .env.production ]; then
    grep -E "DB_|DATABASE_URL" .env.production || echo "No DB variables found"
else
    echo "❌ .env.production not found!"
fi

echo ""
echo "🗄️ Testing database connectivity:"
# Test connection from API container
docker-compose -f docker-compose.yml -f docker-compose.prod.yml run --rm api sh -c "apt-get update -qq && apt-get install -qq postgresql-client && pg_isready -h postgres -p 5432 -U everapharm_user"

echo ""
echo "🔧 Correct DATABASE_URL format should be:"
echo "postgresql://everapharm_user:YOUR_PASSWORD@postgres:5432/everapharm_prod"

echo ""
echo "📝 To fix, update your .env.production with the correct DATABASE_URL" 