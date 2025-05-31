# Docker Compose Version Fix

## Problem
The error `KeyError: 'ContainerConfig'` occurs because you're using Docker Compose v1 (1.29.2) which has compatibility issues with newer Docker images.

## Solution: Upgrade to Docker Compose v2

### Option 1: Install Docker Compose v2 (Recommended)

```bash
# Remove old docker-compose
sudo apt-get remove docker-compose

# Install Docker Compose v2
sudo apt-get update
sudo apt-get install docker-compose-plugin

# Verify installation
docker compose version
```

### Option 2: Use Docker Compose v2 Standalone

```bash
# Download the latest release
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# Make it executable
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker-compose --version
```

## After Upgrading

### 1. Set Environment Variables
```bash
# Create .env file from example
cp env.production.example .env.production

# Edit with your values
nano .env.production
```

Make sure to set:
- `DB_PASSWORD=your_secure_password`
- `JWT_SECRET=your_secure_jwt_secret`
- `NEXT_PUBLIC_API_URL=https://api.everapharm.com`
- `CORS_ORIGIN=https://everapharm.com,https://www.everapharm.com`

### 2. Clean Up and Restart
```bash
# Clean everything
docker system prune -a
docker volume prune

# If using docker compose v2 plugin:
docker compose down
docker compose build --no-cache
docker compose up -d

# If using standalone docker-compose:
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

## Fix for UI Styles Warning (Optional)

The warning about `@repo/ui/styles.css` is non-critical since the build succeeds. However, to fix it:

### Update the import in layout.tsx
```bash
# Check what's being imported
grep -r "@repo/ui/styles.css" apps/web/
```

If found, update it to:
```typescript
// Instead of: import '@repo/ui/styles.css'
// Use: import './globals.css'
```

## Quick Fix Script

Create a script to do everything:

```bash
#!/bin/bash
# fix-docker.sh

echo "🔧 Fixing Docker Compose..."

# Install Docker Compose v2
sudo apt-get update
sudo apt-get install -y docker-compose-plugin

# Check if .env.production exists
if [ ! -f .env.production ]; then
    echo "⚠️  Creating .env.production from example..."
    cp env.production.example .env.production
    echo "📝 Please edit .env.production with your values"
    exit 1
fi

# Export env vars
export $(cat .env.production | grep -v '^#' | xargs)

# Clean and rebuild
echo "🧹 Cleaning Docker..."
docker compose down -v
docker system prune -af

echo "🔨 Building containers..."
docker compose build --no-cache

echo "🚀 Starting services..."
docker compose up -d

echo "✅ Done! Check status with: docker compose ps"
```

## Verification

After fixing:
```bash
# Check Docker Compose version (should be 2.x.x)
docker compose version

# Check all services are running
docker compose ps

# Check logs
docker compose logs
```

## Alternative: Use Newer Ubuntu Commands

If on Ubuntu 22.04+, Docker Compose v2 is included:
```bash
# Use 'docker compose' instead of 'docker-compose'
docker compose up -d
docker compose ps
docker compose logs
```

Note the space instead of hyphen! 