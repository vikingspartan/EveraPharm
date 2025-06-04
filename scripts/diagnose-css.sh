#!/bin/bash

# Diagnostic script for CSS issues

echo "🔍 Diagnosing CSS issues on production..."
echo ""

# Check if we're in the right directory
if [ ! -f "docker-compose.yml" ]; then
    # Try common locations
    if [ -d "$HOME/everapharm" ] && [ -f "$HOME/everapharm/docker-compose.yml" ]; then
        cd "$HOME/everapharm"
    elif [ -d "/opt/everapharm" ] && [ -f "/opt/everapharm/docker-compose.yml" ]; then
        cd "/opt/everapharm"
    else
        echo "❌ Not in project directory and couldn't find it"
        echo "Please run this script from the everapharm project root"
        exit 1
    fi
fi

echo "📁 Checking web container's file structure..."
docker-compose -f docker-compose.yml -f docker-compose.prod.yml exec web sh -c "
    echo '=== Checking .next/static directory ==='
    ls -la .next/static/css/ 2>/dev/null || echo 'No CSS directory found!'
    echo ''
    echo '=== Checking for CSS files ==='
    find . -name '*.css' -type f | head -20
    echo ''
    echo '=== Checking public directory ==='
    ls -la public/ 2>/dev/null || echo 'No public directory found!'
    echo ''
    echo '=== Current working directory ==='
    pwd
    echo ''
    echo '=== Directory structure ==='
    ls -la
"

echo ""
echo "🌐 Testing CSS file accessibility..."
echo "Checking main site response:"
curl -s -I http://localhost | grep -E "(HTTP|Content-Type)" || echo "Failed to connect"

echo ""
echo "📊 Container logs (last 20 lines):"
docker-compose -f docker-compose.yml -f docker-compose.prod.yml logs --tail=20 web | grep -E "(error|Error|ERROR|css|CSS)"

echo ""
echo "🔧 Suggested fixes:"
echo "1. Run: ./scripts/fix-production-css.sh"
echo "2. Or switch to simple Dockerfile:"
echo "   - Edit docker-compose.yml"
echo "   - Change 'dockerfile: apps/web/Dockerfile' to 'dockerfile: apps/web/Dockerfile.simple'"
echo "   - Rebuild: docker-compose -f docker-compose.yml -f docker-compose.prod.yml build --no-cache web"
echo "   - Restart: docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d" 