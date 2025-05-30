# EveraPharma Deployment Guide

This guide walks you through deploying EveraPharma to production on DigitalOcean.

## Prerequisites

- Domain: everapharm.com (configured on Squarespace)
- DigitalOcean account with a Ubuntu 22.04 droplet
- GitHub repository access
- Basic knowledge of Linux commands

## Step 1: Prepare Your DigitalOcean Droplet

1. Create a new Ubuntu 22.04 droplet:
   - Minimum: 2GB RAM, 2 vCPUs
   - Recommended: 4GB RAM, 2 vCPUs
   - Enable backups
   - Add your SSH key

2. SSH into your droplet:
   ```bash
   ssh root@your_droplet_ip
   ```

3. Run the server setup script:
   ```bash
   curl -sSL https://raw.githubusercontent.com/yourusername/everapharm/main/scripts/setup-server.sh | bash
   ```

## Step 2: Configure DNS

### On Squarespace:
1. Go to Settings → Domains → Advanced Settings
2. Add the following DNS records:

| Type | Host | Points to | TTL |
|------|------|-----------|-----|
| A | @ | your_droplet_ip | 3600 |
| A | www | your_droplet_ip | 3600 |
| A | api | your_droplet_ip | 3600 |

Wait 15-30 minutes for DNS propagation.

## Step 3: Deploy the Application

1. Clone the repository:
   ```bash
   cd /opt/everapharm
   git clone https://github.com/yourusername/everapharm.git .
   ```

2. Create production environment file:
   ```bash
   cp env.production.example .env.production
   nano .env.production
   ```

3. Update the values:
   - `DB_PASSWORD`: Use a strong password
   - `JWT_SECRET`: Generate with `openssl rand -base64 32`
   - Keep other values as shown in the example

4. Copy environment files to app directories:
   ```bash
   cp apps/api/env.production.example apps/api/.env.production
   cp apps/web/env.production.example apps/web/.env.production
   ```

5. Run the deployment:
   ```bash
   ./scripts/deploy.sh
   ```

## Step 4: Setup SSL Certificates

Once DNS is configured and propagated:

```bash
./setup-ssl.sh
```

This will:
- Obtain Let's Encrypt certificates
- Configure Nginx for HTTPS
- Setup auto-renewal

## Step 5: Configure GitHub Actions

In your GitHub repository settings:

1. Go to Settings → Secrets and variables → Actions
2. Add the following secrets:
   - `DROPLET_IP`: Your DigitalOcean droplet IP
   - `DROPLET_USER`: `everapharm`
   - `DROPLET_SSH_KEY`: Your private SSH key
   - `SLACK_WEBHOOK`: (Optional) Slack webhook URL

## Step 6: Initialize the Database

1. SSH into your server
2. Seed the production database:
   ```bash
   cd /opt/everapharm
   docker-compose run --rm api npm run seed:prod
   ```

This creates:
- Admin user: `admin@everapharm.com` (password: `admin123`)
- Sample categories and products
- Initial inventory data

**Important**: Change the admin password immediately after first login!

## Step 7: Verify Deployment

1. Check service status:
   ```bash
   docker-compose ps
   ```

2. View logs:
   ```bash
   docker-compose logs -f
   ```

3. Test endpoints:
   - Web: https://everapharm.com
   - API Health: https://api.everapharm.com/api/health

## Maintenance

### Daily Backups
Automatic backups run at 2 AM server time. Manual backup:
```bash
/opt/everapharm/backup.sh
```

### Update Application
Push changes to the main branch. GitHub Actions will automatically deploy.

### Manual Deploy
```bash
cd /opt/everapharm
./scripts/deploy.sh
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f api
docker-compose logs -f web
docker-compose logs -f nginx
```

### Restart Services
```bash
# All services
docker-compose restart

# Specific service
docker-compose restart api
```

### Database Access
```bash
# Connect to PostgreSQL
docker-compose exec postgres psql -U everapharm_user everapharm_prod

# Run migrations
docker-compose run --rm api npm run migrate:prod
```

## Troubleshooting

### Port Already in Use
```bash
# Find process using port
sudo lsof -i :80
sudo lsof -i :443

# Kill process
sudo kill -9 <PID>
```

### SSL Certificate Issues
```bash
# Test certificate renewal
certbot renew --dry-run

# Force renewal
certbot renew --force-renewal
```

### Database Connection Issues
```bash
# Check PostgreSQL logs
docker-compose logs postgres

# Restart database
docker-compose restart postgres
```

### Clear Docker Resources
```bash
# Remove unused images
docker image prune -a

# Remove all stopped containers
docker container prune

# Full cleanup (careful!)
docker system prune -a
```

## Security Checklist

- [ ] Changed default admin password
- [ ] SSH key authentication enabled
- [ ] Root login disabled
- [ ] Firewall configured (UFW)
- [ ] SSL certificates installed
- [ ] Database password is strong
- [ ] JWT secret is unique and secure
- [ ] Regular security updates scheduled

## Monitoring

### Health Checks
- API: `curl https://api.everapharm.com/api/health`
- Web: `curl -I https://everapharm.com`

### Resource Usage
```bash
# System resources
htop

# Docker stats
docker stats

# Disk usage
df -h
```

## Support

For issues or questions:
1. Check logs: `docker-compose logs`
2. Review this documentation
3. Check GitHub issues
4. Contact support

Remember to keep your system updated and monitor for security patches! 