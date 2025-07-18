#!/bin/bash
# Emergency cleanup script for demo preparation

echo "🧹 Emergency Docker Cleanup for Demo"
echo "===================================="

# Stop all containers
echo "1️⃣ Stopping all containers..."
docker stop $(docker ps -aq) 2>/dev/null || true

# Remove all stopped containers
echo "2️⃣ Removing stopped containers..."
docker container prune -f

# Remove all unused images
echo "3️⃣ Removing unused images..."
docker image prune -a -f

# Remove all unused volumes
echo "4️⃣ Removing unused volumes..."
docker volume prune -f

# Remove build cache
echo "5️⃣ Removing build cache..."
docker builder prune -a -f

# Show disk usage
echo ""
echo "📊 Current disk usage:"
df -h /

echo ""
echo "🐳 Docker disk usage:"
docker system df

echo ""
echo "✅ Cleanup complete! You should now have more space." 