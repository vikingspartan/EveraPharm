#!/bin/bash

# Script to fix database connection issues

echo "🔧 Fixing Database Connection..."
echo "================================"

# Check current DATABASE_URL
echo "Current DATABASE_URL:"
echo $DATABASE_URL

# Test if we can connect to postgres
echo ""
echo "Testing connection to postgres container:"
nc -zv postgres 5432 || echo "Cannot connect to postgres:5432"

# Install PostgreSQL client for testing
echo ""
echo "Installing PostgreSQL client..."
apt-get update -qq && apt-get install -qq postgresql-client

# Test connection with psql
echo ""
echo "Testing database connection:"
PGPASSWORD="${DB_PASSWORD}" psql -h postgres -U everapharm_user -d everapharm_prod -c "SELECT version();"

# Check Prisma schema
echo ""
echo "Checking Prisma schema location:"
ls -la /app/packages/database/prisma/

# Test Prisma connection
echo ""
echo "Testing Prisma connection:"
cd /app/packages/database
npx prisma db pull --print

echo ""
echo "If connection fails, check:"
echo "1. DATABASE_URL format: postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
echo "2. Password doesn't contain special characters that need URL encoding"
echo "3. Database exists and user has permissions" 