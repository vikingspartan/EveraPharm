#!/bin/bash

# Script to generate secure secrets for production

echo "🔐 Generating secure secrets for EveraPharma production..."
echo ""

# Generate database password
DB_PASSWORD=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-25)
echo "Database Password:"
echo "  DB_PASSWORD=$DB_PASSWORD"
echo ""

# Generate JWT secret
JWT_SECRET=$(openssl rand -base64 64 | tr -d "=+/" | cut -c1-50)
echo "JWT Secret:"
echo "  JWT_SECRET=$JWT_SECRET"
echo ""

# Generate session secret (if needed in future)
SESSION_SECRET=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-32)
echo "Session Secret (for future use):"
echo "  SESSION_SECRET=$SESSION_SECRET"
echo ""

echo "📋 Instructions:"
echo "1. Copy these values to your .env.production file"
echo "2. Keep these secrets secure and never commit them to git"
echo "3. Use different secrets for staging and production environments"
echo ""
echo "⚠️  Save these values securely - they won't be shown again!" 