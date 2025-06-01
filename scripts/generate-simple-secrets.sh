#!/bin/bash

# Script to generate secure passwords without special characters

echo "🔐 Generating Secure Passwords (No Special Characters)"
echo "====================================================="
echo ""

# Generate DB password (alphanumeric only, 32 chars)
DB_PASSWORD=$(openssl rand -hex 16)
echo "DB_PASSWORD=$DB_PASSWORD"

# Generate JWT secret (alphanumeric only, 32 chars)
JWT_SECRET=$(openssl rand -hex 16)
echo "JWT_SECRET=$JWT_SECRET"

# Generate admin password (readable, 20 chars)
ADMIN_PASSWORD="Admin$(openssl rand -hex 8)"
echo "ADMIN_PASSWORD=$ADMIN_PASSWORD"

echo ""
echo "📝 These passwords contain only letters and numbers (no special characters)"
echo "💡 Copy these values to your .env.production file" 