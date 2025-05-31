# Docker Deployment Fix - Server.js Issue

## Problem
The web container was trying to run `apps/web/server.js` but the file doesn't exist at that path. When Next.js builds in standalone mode, it creates `server.js` at the root of the standalone output.

## Solution Applied
Fixed the web Dockerfile CMD from:
```dockerfile
CMD ["node", "apps/web/server.js"]
```
To:
```dockerfile
CMD ["node", "server.js"]
```

## Complete Fix Steps

### 1. Pull Latest Changes
```bash
cd /opt/everapharm
git pull origin main
```

### 2. Clear Docker Cache (Important!)
```bash
# Stop all containers
docker-compose down

# Remove old images
docker system prune -a
```

### 3. Rebuild Containers
```bash
# Rebuild both containers with no cache
docker-compose build --no-cache
```

### 4. Start Services
```bash
# Start in detached mode
docker-compose up -d

# Check status
docker-compose ps
```

### 5. Verify Services
```bash
# Check web logs
docker-compose logs web

# Check API logs
docker-compose logs api

# Test health endpoints
curl http://localhost:3000/api/health
curl http://localhost:3001
```

## Common Issues & Solutions

### If Prisma Client Error Persists
```bash
# Generate Prisma client manually
docker-compose run --rm api sh -c "cd packages/database && npx prisma generate"

# Run migrations
docker-compose run --rm api npm run migrate:prod
```

### If Web Container Still Fails
Check the standalone build structure:
```bash
# Debug: See what files are in the container
docker-compose run --rm web ls -la /app/
docker-compose run --rm web ls -la /app/apps/web/
```

### If API Can't Connect to Database
```bash
# Check database is running
docker-compose ps postgres

# Check database logs
docker-compose logs postgres

# Test database connection
docker-compose exec postgres psql -U everapharm_user everapharm_prod
```

## Environment Variables Check
Ensure your `.env.production` has all required values:
```bash
cat .env.production
```

Required variables:
- `DB_PASSWORD`
- `JWT_SECRET`
- `NEXT_PUBLIC_API_URL`
- `CORS_ORIGIN`

## Quick Debug Commands
```bash
# See all running containers
docker ps

# See container resource usage
docker stats

# Enter a container for debugging
docker-compose exec web sh
docker-compose exec api sh

# Check network connectivity between containers
docker-compose exec web ping api
docker-compose exec api ping postgres
```

## Complete Restart Procedure
If all else fails:
```bash
# 1. Stop everything
docker-compose down -v

# 2. Clear everything
docker system prune -a --volumes

# 3. Rebuild from scratch
docker-compose build --no-cache

# 4. Start services one by one
docker-compose up -d postgres
sleep 10
docker-compose up -d api
sleep 10
docker-compose up -d web
docker-compose up -d nginx

# 5. Check logs
docker-compose logs -f
```

## Expected Output
When everything is working:
- `docker-compose ps` should show all services as "Up"
- API health check returns: `{"status":"ok","environment":"production"}`
- Web app loads at http://localhost:3001
- No errors in `docker-compose logs` 