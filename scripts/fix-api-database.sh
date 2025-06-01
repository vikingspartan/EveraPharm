#!/bin/bash

# Script to fix API database connection

set -e

echo "🔧 Fixing API Database Connection..."
echo "==================================="

# First, let's check the .env.production file
echo "📋 Checking .env.production:"
if [ -f .env.production ]; then
    echo "Found .env.production with these DB settings:"
    grep -E "DB_PASSWORD|DATABASE_URL|JWT_SECRET" .env.production | sed 's/=.*$/=<hidden>/'
else
    echo "❌ .env.production not found!"
    echo "Creating from example..."
    cp env.production.example .env.production
    echo "Please edit .env.production with your database password"
    exit 1
fi

# Load environment variables
export $(cat .env.production | grep -v '^#' | xargs)

# Test database connection from host (using exposed port)
echo ""
echo "🔍 Testing database connection from host:"
PGPASSWORD="${DB_PASSWORD}" psql -h localhost -p 5432 -U everapharm_user -d everapharm_prod -c "SELECT 'Database connection successful!' as status;" || {
    echo "❌ Cannot connect to database from host"
    echo "Make sure DB_PASSWORD in .env.production matches the one in PostgreSQL"
}

# Check if API container can reach database
echo ""
echo "🔍 Testing from API container:"
docker-compose -f docker-compose.yml -f docker-compose.prod.yml run --rm api sh -c "nc -zv postgres 5432" || {
    echo "❌ API container cannot reach database container"
}

# Check DATABASE_URL in API container
echo ""
echo "📋 DATABASE_URL in API container:"
docker-compose -f docker-compose.yml -f docker-compose.prod.yml run --rm api sh -c 'echo "DATABASE_URL=$DATABASE_URL"'

# Rebuild API with correct environment
echo ""
echo "🔄 Rebuilding API container with correct environment..."
docker-compose -f docker-compose.yml -f docker-compose.prod.yml stop api
docker-compose -f docker-compose.yml -f docker-compose.prod.yml rm -f api
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d api

echo ""
echo "⏳ Waiting for API to start..."
sleep 10

# Check API logs
echo ""
echo "📝 API logs:"
docker-compose -f docker-compose.yml -f docker-compose.prod.yml logs --tail=30 api

echo ""
echo "✅ Steps completed. Check the logs above for any errors."
echo ""
echo "If still having issues:"
echo "1. Make sure DB_PASSWORD in .env.production has no special characters"
echo "2. Or use a simpler password like: EveraPharm2024Secure"
echo "3. Update the PostgreSQL password to match:"
echo "   docker-compose -f docker-compose.yml -f docker-compose.prod.yml exec postgres psql -U everapharm_user -c \"ALTER USER everapharm_user PASSWORD 'YourNewPassword';\"" 