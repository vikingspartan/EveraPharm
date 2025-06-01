# Quick Start Deployment Guide

This guide will get EveraPharma running on your server in under 10 minutes.

## Prerequisites

- Ubuntu 22.04 server with at least 2GB RAM
- Docker and Docker Compose v2 installed
- Domain pointed to your server IP

## Step 1: Get the Code

```bash
cd /opt
git clone https://github.com/yourusername/everapharm.git
cd everapharm
```

## Step 2: Set Environment Variables

```bash
# Copy the example file
cp env.production.example .env.production

# Generate secure passwords
./scripts/generate-secrets.sh

# Edit with your values
nano .env.production
```

Set these values:
- `DB_PASSWORD`: Use the generated password
- `JWT_SECRET`: Use the generated secret
- `NEXT_PUBLIC_API_URL`: `http://api.everapharm.com`
- `CORS_ORIGIN`: `http://everapharm.com,http://www.everapharm.com`

## Step 3: Deploy

```bash
# Make scripts executable
chmod +x scripts/*.sh

# Run the simplified deployment
./scripts/deploy-simple.sh
```

## Step 4: Verify

```bash
# Check all services are running
docker compose -f docker-compose.yml -f docker-compose.prod.yml ps

# Test the API
curl http://your-server-ip:3000/api/health

# Test the web app
curl http://your-server-ip:3001

# Test nginx
curl http://your-server-ip
```

## Step 5: Access Your App

Open in your browser:
- Main site: `http://everapharm.com`
- API: `http://api.everapharm.com/api/health`

## Step 6: Seed Initial Data (Optional)

```bash
# Create admin user and sample data
docker compose -f docker-compose.yml -f docker-compose.prod.yml run --rm api npm run seed:prod
```

Default admin credentials:
- Email: `admin@everapharm.com`
- Password: `ChangeMeImmediately!`

## Troubleshooting

### If services don't start:
```bash
# Check logs
docker compose -f docker-compose.yml -f docker-compose.prod.yml logs

# Try starting services one by one
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d postgres
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d api
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d web
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d nginx
```

### If you get build errors:
```bash
# Use the simple Dockerfiles
sed -i 's/Dockerfile/Dockerfile.simple/g' docker-compose.yml
docker compose build --no-cache
```

## Next Steps

Once everything is working:

1. **Set up SSL certificates:**
   ```bash
   ./setup-ssl.sh
   ```

2. **Update environment for HTTPS:**
   - Change `NEXT_PUBLIC_API_URL` to `https://api.everapharm.com`
   - Update `CORS_ORIGIN` to use `https://`
   - Restart services

3. **Configure backups:**
   ```bash
   crontab -e
   # Add: 0 2 * * * /opt/everapharm/backup.sh
   ```

## Quick Commands Reference

```bash
# View logs
docker compose -f docker-compose.yml -f docker-compose.prod.yml logs -f

# Restart a service
docker compose -f docker-compose.yml -f docker-compose.prod.yml restart api

# Stop everything
docker compose -f docker-compose.yml -f docker-compose.prod.yml down

# Update and redeploy
git pull
./scripts/deploy-simple.sh
```

That's it! Your pharmacy platform should now be running. 🚀 