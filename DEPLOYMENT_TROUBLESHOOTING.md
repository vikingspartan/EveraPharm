# EveraPharma Deployment Troubleshooting Guide

## Quick Fixes for Common Issues

### Issue: Prisma OpenSSL errors during migration

**Symptoms:**
```
prisma:warn Prisma failed to detect the libssl/openssl version to use
Error: Could not parse schema engine response: SyntaxError: Unexpected token E in JSON at position 0
```

**Solution: Use the OpenSSL fix script**
```bash
# Run the fix script
chmod +x scripts/fix-openssl-build.sh
./scripts/fix-openssl-build.sh
```

**Manual fix if script doesn't work:**
1. The issue is caused by Alpine Linux missing OpenSSL libraries that Prisma needs
2. The Dockerfiles have been updated to use `node:18-slim` instead of `node:18-alpine`
3. Rebuild the images:
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.prod.yml down
   docker rmi everapharm-api everapharm-web
   docker-compose -f docker-compose.yml -f docker-compose.prod.yml build --no-cache
   ```

### Issue: Web container fails with "server.js not found"

**Option 1: Use production override**
```bash
# Use the simplified deployment
chmod +x scripts/deploy-simple.sh
./scripts/deploy-simple.sh
```

**Option 2: Check container contents**
```bash
# See what's in the container
docker-compose run --rm web ls -la /app/
docker-compose run --rm web ls -la /app/apps/web/
```

**Option 3: Use simple Dockerfile**
```bash
# Update docker-compose.yml to use simple Dockerfile
# Change: dockerfile: apps/web/Dockerfile
# To: dockerfile: apps/web/Dockerfile.simple
```

### Issue: API container Prisma client errors

**Option 1: Generate Prisma client manually**
```bash
docker-compose run --rm api sh -c "cd packages/database && npx prisma generate"
```

**Option 2: Use simple API Dockerfile**
```bash
# Update docker-compose.yml to use simple Dockerfile
# Change: dockerfile: apps/api/Dockerfile
# To: dockerfile: apps/api/Dockerfile.simple
```

### Issue: Docker Compose v1 errors

**Fix: Upgrade to v2**
```bash
sudo apt-get update
sudo apt-get install -y docker-compose-plugin

# After installing v2, you can use 'docker compose' (with space) instead of 'docker-compose'
docker compose version
```

### Issue: Environment variables not set

**Fix: Create and configure .env.production**
```bash
cp env.production.example .env.production
nano .env.production

# Set these values:
DB_PASSWORD=your_secure_password_here
JWT_SECRET=your_32_char_jwt_secret_here
NEXT_PUBLIC_API_URL=http://api.everapharm.com
CORS_ORIGIN=http://everapharm.com,http://www.everapharm.com
```

## Step-by-Step Recovery Process

### 1. Clean Everything
```bash
# Stop all containers
docker-compose down -v

# Remove all images and volumes
docker system prune -a --volumes

# Remove any .next or dist folders
rm -rf apps/web/.next
rm -rf apps/api/dist
```

### 2. Use Simple Deployment
```bash
# Pull latest code
git pull origin main

# Make scripts executable
chmod +x scripts/*.sh

# Use the simple deployment
./scripts/deploy-simple.sh
```

### 3. Test Without Nginx First
```bash
# Start just the core services
docker-compose up -d postgres
sleep 10
docker-compose up -d api
docker-compose up -d web

# Test directly
curl http://localhost:3000/api/health
curl http://localhost:3001
```

### 4. Add Nginx Once Core Works
```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d nginx
```

## Debugging Commands

### Check Container Status
```bash
docker-compose ps
docker ps -a
```

### View Logs
```bash
# All logs
docker-compose logs

# Specific service
docker-compose logs api
docker-compose logs web
docker-compose logs postgres
docker-compose logs nginx

# Follow logs
docker-compose logs -f api
```

### Enter Container for Debugging
```bash
# Enter running container
docker-compose exec api sh
docker-compose exec web sh

# Run command in new container
docker-compose run --rm api ls -la
docker-compose run --rm web npm list
```

### Check Network Connectivity
```bash
# From web container, ping API
docker-compose exec web ping api

# From API container, ping database
docker-compose exec api ping postgres
```

### Check Resource Usage
```bash
docker stats
docker-compose top
```

## Alternative Deployment Methods

### Method 1: Direct Node.js (No Docker)
```bash
# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone and install
git clone https://github.com/yourusername/everapharm.git
cd everapharm
npm ci

# Set up database
sudo -u postgres createdb everapharm_prod
sudo -u postgres createuser everapharm_user

# Run migrations
cd packages/database
npx prisma migrate deploy

# Start services
npm run build
pm2 start npm --name api -- run start:prod --workspace=apps/api
pm2 start npm --name web -- run start --workspace=apps/web
```

### Method 2: Docker Without Compose
```bash
# Create network
docker network create everapharm

# Start database
docker run -d \
  --name postgres \
  --network everapharm \
  -e POSTGRES_USER=everapharm_user \
  -e POSTGRES_PASSWORD=yourpassword \
  -e POSTGRES_DB=everapharm_prod \
  -v postgres_data:/var/lib/postgresql/data \
  postgres:15-alpine

# Build and start API
docker build -f apps/api/Dockerfile.simple -t everapharm-api .
docker run -d \
  --name api \
  --network everapharm \
  -e DATABASE_URL=postgresql://everapharm_user:yourpassword@postgres:5432/everapharm_prod \
  -e JWT_SECRET=yourjwtsecret \
  -p 3000:3000 \
  everapharm-api

# Build and start Web
docker build -f apps/web/Dockerfile.simple -t everapharm-web .
docker run -d \
  --name web \
  --network everapharm \
  -e NEXT_PUBLIC_API_URL=http://api:3000 \
  -p 3001:3000 \
  everapharm-web
```

## Emergency Fixes

### Can't Access Services
```bash
# Check firewall
sudo ufw status
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 3000
sudo ufw allow 3001

# Check if ports are in use
sudo netstat -tlnp | grep :80
sudo netstat -tlnp | grep :3000
sudo netstat -tlnp | grep :3001
```

### Database Connection Issues
```bash
# Test database connection
docker-compose exec postgres psql -U everapharm_user everapharm_prod

# Reset database
docker-compose down -v
docker-compose up -d postgres
docker-compose run --rm api npm run migrate:prod
```

### Out of Disk Space
```bash
# Check disk usage
df -h

# Clean Docker
docker system prune -a --volumes
docker image prune -a
docker container prune
docker volume prune
```

## Getting Help

If none of these solutions work:

1. Check the logs carefully for specific error messages
2. Ensure your server meets minimum requirements (2GB RAM, 2 CPUs)
3. Verify DNS is configured correctly
4. Check that all environment variables are set
5. Try the simplified deployment approach first

Remember: Start simple and add complexity gradually! 