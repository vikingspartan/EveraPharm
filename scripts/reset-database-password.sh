#!/bin/bash

# Script to reset database password without special characters

set -e

echo "🔒 Resetting Database Password..."
echo "================================="

# Generate a new secure password without special characters
NEW_PASSWORD="EveraPharm2024SecureDB"
echo "✅ New password will be: $NEW_PASSWORD"

# Stop the API first
echo ""
echo "🛑 Stopping API container..."
docker-compose -f docker-compose.yml -f docker-compose.prod.yml stop api

# Update the password in PostgreSQL
echo ""
echo "🗄️  Updating PostgreSQL password..."
docker-compose -f docker-compose.yml -f docker-compose.prod.yml exec postgres psql -U everapharm_user -d everapharm_prod -c "ALTER USER everapharm_user PASSWORD '$NEW_PASSWORD';"

# Update .env.production
echo ""
echo "📝 Updating .env.production..."
if [ -f .env.production ]; then
    # Backup current file
    cp .env.production .env.production.backup
    echo "   - Backed up to .env.production.backup"
    
    # Update DB_PASSWORD
    sed -i "s/^DB_PASSWORD=.*/DB_PASSWORD=$NEW_PASSWORD/" .env.production
    echo "   - Updated DB_PASSWORD"
else
    echo "❌ .env.production not found!"
    exit 1
fi

# Remove and recreate the API container to pick up new environment
echo ""
echo "🔄 Recreating API container with new password..."
docker-compose -f docker-compose.yml -f docker-compose.prod.yml rm -f api
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d api

# Wait for API to start
echo ""
echo "⏳ Waiting for API to start..."
sleep 10

# Check if API is healthy
echo ""
echo "🏥 Checking API health..."
curl -s http://localhost:3000/api/health || echo "API not responding yet..."

# Show logs
echo ""
echo "📝 API logs:"
docker-compose -f docker-compose.yml -f docker-compose.prod.yml logs --tail=30 api

echo ""
echo "✅ Password reset complete!"
echo ""
echo "New database password: $NEW_PASSWORD"
echo ""
echo "If the API is still having issues, run:"
echo "  docker-compose -f docker-compose.yml -f docker-compose.prod.yml logs -f api" 