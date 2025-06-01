#!/bin/bash

# Script to fix .env.production file

echo "🔧 Fixing .env.production file..."
echo "================================="

# Check current file
echo "📋 Current .env.production content:"
cat .env.production

echo ""
echo "🔄 Creating clean .env.production..."

# Create a new clean .env.production
cat > .env.production << 'EOF'
# Database
DB_PASSWORD=EveraPharm2024SecureDB

# JWT Secret for authentication
JWT_SECRET=your32characterjwtsecretgoeshere

# API URL for frontend
NEXT_PUBLIC_API_URL=http://api.everapharm.com

# CORS configuration
CORS_ORIGIN=http://everapharm.com,http://www.everapharm.com

# Admin credentials (for seeding)
ADMIN_EMAIL=admin@everapharm.com
ADMIN_PASSWORD=ChangeMeImmediately!
EOF

echo ""
echo "✅ Created clean .env.production"

# Generate a proper JWT secret
JWT_SECRET=$(openssl rand -hex 16)
echo ""
echo "🔐 Generated JWT secret: $JWT_SECRET"

# Update JWT secret in the file
# Use a different sed syntax that works on both Linux and macOS
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' "s/your32characterjwtsecretgoeshere/$JWT_SECRET/" .env.production
else
    # Linux
    sed -i "s/your32characterjwtsecretgoeshere/$JWT_SECRET/" .env.production
fi

echo ""
echo "📋 Final .env.production:"
cat .env.production

echo ""
echo "🚀 Now restart the API:"
echo "docker-compose -f docker-compose.yml -f docker-compose.prod.yml restart api" 