#!/bin/bash

# Script to test Docker builds locally before deployment

set -e

echo "🧪 Testing Docker builds locally..."

# Create temporary env files for testing
cat > .env.test << EOF
DB_PASSWORD=test_password
JWT_SECRET=test_jwt_secret_for_local_testing_only
NEXT_PUBLIC_API_URL=http://localhost:3000/api
CORS_ORIGIN=http://localhost:3001
EOF

# Export env vars
export $(cat .env.test | grep -v '^#' | xargs)

# Build images
echo "🔨 Building Docker images..."
docker-compose -f docker-compose.yml -f docker-compose.dev.yml build --no-cache

# Clean up
rm .env.test

echo "✅ Docker build test completed successfully!"
echo ""
echo "To run the containers locally:"
echo "  docker-compose -f docker-compose.yml -f docker-compose.dev.yml up" 