#!/bin/bash

# CPU Monitoring Script for EveraPharma
# This script helps identify what's causing high CPU usage

echo "🔍 EveraPharma CPU Monitoring"
echo "============================"

# Check Docker container CPU usage
echo ""
echo "📊 Docker Container CPU Usage:"
docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.Name}}" || echo "Docker not running or no containers found"

echo ""
echo "🔄 Container Health Status:"
docker-compose ps || echo "Docker Compose not available"

echo ""
echo "⚡ Top Processes by CPU Usage:"
ps aux --sort=-%cpu | head -10

echo ""
echo "🏥 API Health Check History (last 10):"
journalctl -u docker -n 10 --no-pager | grep "health" || echo "No health check logs found"

echo ""
echo "📝 Recent API Logs (checking for high-frequency operations):"
docker-compose logs api --tail=20 --timestamps || echo "No API logs available"

echo ""
echo "🗄️ Database Connection Count:"
docker-compose exec -T postgres psql -U everapharm_user -d everapharm_prod -c "SELECT count(*) as active_connections FROM pg_stat_activity WHERE state = 'active';" 2>/dev/null || echo "Database not accessible"

echo ""
echo "📊 System Resource Usage:"
echo "CPU: $(cat /proc/loadavg)"
echo "Memory: $(free -h | grep Mem)"
echo "Disk I/O: $(iostat -c 1 1 | tail -n +4)" 2>/dev/null || echo "iostat not available"

echo ""
echo "💡 CPU Optimization Recommendations:"
echo "1. Health checks reduced from 10s/30s to 60s/120s intervals"
echo "2. Prisma logging optimized for production"
echo "3. Consider setting resource limits in docker-compose.yml"
echo "4. Monitor for memory leaks causing high CPU garbage collection" 