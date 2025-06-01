#!/bin/bash

# Script to debug migration environment

echo "🔍 Debugging Migration Environment..."
echo "===================================="

# Stop API first
docker-compose -f docker-compose.yml -f docker-compose.prod.yml stop api

# Check environment in a fresh container
echo ""
echo "📦 Environment variables in migration container:"
docker-compose -f docker-compose.yml -f docker-compose.prod.yml run --rm api sh -c 'echo "DATABASE_URL=$DATABASE_URL" && echo "DB_PASSWORD=$DB_PASSWORD" && echo "NODE_ENV=$NODE_ENV"'

# Check the actual migration command environment
echo ""
echo "🔧 Testing migration with explicit DATABASE_URL:"
docker-compose -f docker-compose.yml -f docker-compose.prod.yml run --rm \
  -e DATABASE_URL="postgresql://everapharm_user:EveraPharm2024SecureDB@postgres:5432/everapharm_prod" \
  api sh -c "cd /app/packages/database && npx prisma migrate deploy"

# If that works, the issue is with environment variable construction
echo ""
echo "📝 Checking package.json scripts:"
docker-compose -f docker-compose.yml -f docker-compose.prod.yml run --rm api sh -c "cat /app/package.json | grep -A5 migrate:prod" 