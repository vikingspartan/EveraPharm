#!/bin/bash

# EveraPharma Server Setup Script
# Run this script on a fresh Ubuntu 22.04 DigitalOcean droplet

set -e

echo "🚀 Starting EveraPharma server setup..."

# Update system
echo "📦 Updating system packages..."
apt-get update
apt-get upgrade -y

# Install required packages
echo "📦 Installing required packages..."
apt-get install -y \
    curl \
    git \
    ufw \
    nginx \
    certbot \
    python3-certbot-nginx \
    software-properties-common

# Install Docker
echo "🐳 Installing Docker..."
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add -
add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
apt-get update
apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Note: docker-compose-plugin provides 'docker compose' command (v2)
echo "✅ Docker and Docker Compose v2 installed"

# Configure firewall
echo "🔒 Configuring firewall..."
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 80
ufw allow 443
ufw --force enable

# Create app directory
echo "📁 Creating application directory..."
mkdir -p /opt/everapharm
cd /opt/everapharm

# Create docker user
echo "👤 Creating docker user..."
useradd -m -s /bin/bash everapharm
usermod -aG docker everapharm

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p nginx/certs
mkdir -p nginx/ssl

# Generate self-signed certificates for initial setup
echo "🔐 Generating self-signed certificates..."
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout nginx/certs/self-signed.key \
    -out nginx/certs/self-signed.crt \
    -subj "/C=US/ST=State/L=City/O=EveraPharma/OU=IT/CN=everapharm.com"

# Create .env.production template
echo "📝 Creating environment file template..."
cat > .env.production.template << 'EOF'
# Database
DB_PASSWORD=your_secure_database_password_here

# JWT
JWT_SECRET=your_super_secure_jwt_secret_min_32_chars

# API URLs
NEXT_PUBLIC_API_URL=https://api.everapharm.com
CORS_ORIGIN=https://everapharm.com,https://www.everapharm.com
EOF

# Create docker-compose override for production
echo "📝 Creating docker-compose production override..."
cat > docker-compose.prod.yml << 'EOF'
version: '3.8'

services:
  postgres:
    restart: always
    volumes:
      - /opt/everapharm/postgres_data:/var/lib/postgresql/data

  api:
    restart: always
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

  web:
    restart: always
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

  nginx:
    restart: always
    volumes:
      - /opt/everapharm/nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - /opt/everapharm/nginx/certs:/etc/nginx/certs:ro
      - /etc/letsencrypt:/etc/letsencrypt:ro
      - /var/www/certbot:/var/www/certbot:ro
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
EOF

# Create systemd service
echo "🔧 Creating systemd service..."
cat > /etc/systemd/system/everapharm.service << 'EOF'
[Unit]
Description=EveraPharma Application
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/opt/everapharm
ExecStart=/usr/bin/docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
ExecStop=/usr/bin/docker compose -f docker-compose.yml -f docker-compose.prod.yml down
ExecReload=/usr/bin/docker compose -f docker-compose.yml -f docker-compose.prod.yml restart

[Install]
WantedBy=multi-user.target
EOF

# Enable service
systemctl daemon-reload
systemctl enable everapharm

# Create backup script
echo "💾 Creating backup script..."
cat > /opt/everapharm/backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/opt/everapharm/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

# Backup database
docker compose exec -T postgres pg_dump -U everapharm_user everapharm_prod | gzip > "$BACKUP_DIR/db_backup_$TIMESTAMP.sql.gz"

# Keep only last 7 days of backups
find $BACKUP_DIR -name "db_backup_*.sql.gz" -mtime +7 -delete

echo "Backup completed: $BACKUP_DIR/db_backup_$TIMESTAMP.sql.gz"
EOF
chmod +x /opt/everapharm/backup.sh

# Setup cron for backups
echo "⏰ Setting up automated backups..."
(crontab -l 2>/dev/null; echo "0 2 * * * /opt/everapharm/backup.sh") | crontab -

# Create Let's Encrypt setup script
echo "🔐 Creating Let's Encrypt setup script..."
cat > /opt/everapharm/setup-ssl.sh << 'EOF'
#!/bin/bash
echo "Setting up SSL certificates with Let's Encrypt..."

# Stop nginx to free up port 80
docker compose stop nginx

# Get certificates
certbot certonly --standalone \
    -d everapharm.com \
    -d www.everapharm.com \
    -d api.everapharm.com \
    --non-interactive \
    --agree-tos \
    --email admin@everapharm.com

# Update nginx configuration to use Let's Encrypt certificates
sed -i 's|ssl_certificate /etc/nginx/certs/self-signed.crt;|ssl_certificate /etc/letsencrypt/live/everapharm.com/fullchain.pem;|g' nginx/nginx.conf
sed -i 's|ssl_certificate_key /etc/nginx/certs/self-signed.key;|ssl_certificate_key /etc/letsencrypt/live/everapharm.com/privkey.pem;|g' nginx/nginx.conf

# Start nginx
docker compose start nginx

# Setup auto-renewal
echo "0 12 * * * /usr/bin/certbot renew --quiet" | crontab -

echo "SSL setup completed!"
EOF
chmod +x /opt/everapharm/setup-ssl.sh

# Set permissions
chown -R everapharm:everapharm /opt/everapharm

echo "✅ Server setup completed!"
echo ""
echo "📋 Next steps:"
echo "1. Clone your repository to /opt/everapharm"
echo "2. Copy .env.production.template to .env.production and fill in values"
echo "3. Run: docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d"
echo "4. After DNS is configured, run: ./setup-ssl.sh"
echo ""
echo "🔐 Security reminders:"
echo "- Change default passwords"
echo "- Configure SSH key authentication"
echo "- Disable root login"
echo "- Keep system updated" 