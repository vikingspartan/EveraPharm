#!/bin/bash

# Script to complete the EveraPharma setup

set -e

echo "🚀 Completing EveraPharma Setup..."
echo "=================================="

# Generate clean JWT secret (no special characters)
JWT_SECRET=$(openssl rand -hex 32)
echo "🔐 Generated clean JWT secret (64 chars, hex only)"

# Update .env.production with clean JWT secret
echo ""
echo "📝 Updating .env.production with clean JWT secret..."
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' "s/^JWT_SECRET=.*/JWT_SECRET=$JWT_SECRET/" .env.production
else
    # Linux
    sed -i "s/^JWT_SECRET=.*/JWT_SECRET=$JWT_SECRET/" .env.production
fi

echo "✅ Updated JWT secret"

# Show current config
echo ""
echo "📋 Current configuration:"
grep -E "DB_PASSWORD|JWT_SECRET" .env.production | sed 's/JWT_SECRET=.*/JWT_SECRET=<hidden>/'

# Restart API to pick up new JWT secret
echo ""
echo "🔄 Restarting API with new configuration..."
docker-compose -f docker-compose.yml -f docker-compose.prod.yml stop api
docker-compose -f docker-compose.yml -f docker-compose.prod.yml rm -f api
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d api

# Wait for API to be ready
echo ""
echo "⏳ Waiting for API to be ready..."
sleep 10

# Run migrations
echo ""
echo "🗄️  Running database migrations..."
docker-compose -f docker-compose.yml -f docker-compose.prod.yml exec api sh -c "cd /app && npm run migrate:prod" || {
    echo "Migration failed, trying alternative method..."
    docker-compose -f docker-compose.yml -f docker-compose.prod.yml run --rm api sh -c "cd /app && npm run migrate:prod"
}

# Seed the database (optional)
echo ""
read -p "Do you want to seed the database with sample data? (y/N) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🌱 Seeding database..."
    docker-compose -f docker-compose.yml -f docker-compose.prod.yml exec api npm run seed:prod || {
        echo "Seeding failed, trying alternative method..."
        docker-compose -f docker-compose.yml -f docker-compose.prod.yml run --rm api npm run seed:prod
    }
fi

# Check API health
echo ""
echo "🏥 Checking API health..."
sleep 5
curl -s http://localhost:3000/api/health | jq . || echo "API might still be starting..."

# Check all services
echo ""
echo "📊 All services status:"
docker-compose -f docker-compose.yml -f docker-compose.prod.yml ps

echo ""
echo "✅ Setup complete!"
echo ""
echo "🔗 Access your services:"
echo "   - Web: http://localhost:3001 or http://everapharm.com"
echo "   - API: http://localhost:3000/api/health or http://api.everapharm.com/api/health"
echo ""
echo "📝 Monitor logs:"
echo "   docker-compose -f docker-compose.yml -f docker-compose.prod.yml logs -f" 