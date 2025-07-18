#!/bin/bash

# EveraPharma Local Development Setup
# This script sets up and runs the project locally for real-time development

echo "🚀 EveraPharma Local Development Setup"
echo "====================================="

# Check if we're in the project directory
if [ ! -f "package.json" ]; then
    echo "❌ Not in project directory!"
    echo "Please run this script from the everapharm project root"
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Check if .env.local exists for web app
if [ ! -f "apps/web/.env.local" ]; then
    echo "📝 Creating local environment file for web app..."
    cat > apps/web/.env.local << 'EOF'
# Local development environment
NEXT_PUBLIC_API_URL=http://localhost:3002/api
NODE_ENV=development
EOF
    echo "✅ Created apps/web/.env.local"
fi

# Check if .env exists for API
if [ ! -f "apps/api/.env" ]; then
    echo "📝 Creating local environment file for API..."
    cat > apps/api/.env << 'EOF'
# Local development environment
DATABASE_URL="postgresql://everapharm_user:dev_password@localhost:5433/everapharm_dev"
JWT_SECRET="local_development_jwt_secret_not_for_production"
NODE_ENV=development
PORT=3002
CORS_ORIGIN=http://localhost:3000,http://localhost:3001
EOF
    echo "✅ Created apps/api/.env"
fi

echo ""
echo "🎯 Choose development mode:"
echo "1. Frontend only (web app with hot reload)"
echo "2. Full stack (web + API + database)"
echo "3. Show running instructions"
read -p "Enter choice (1-3): " choice

case $choice in
    1)
        echo ""
        echo "🌐 Starting frontend development server..."
        echo "📝 Edit files in apps/web/app/page.tsx to see changes in real-time"
        echo "🔗 Your app will be available at: http://localhost:3000"
        echo ""
        npm run dev --workspace=apps/web
        ;;
    2)
        echo ""
        echo "🏗️ Starting full development stack..."
        echo "This will start:"
        echo "  - PostgreSQL database (port 5433)"
        echo "  - API server (port 3002)"
        echo "  - Web app (port 3000)"
        echo ""
        read -p "Continue? (y/N) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            # Start database in the background
            echo "🗄️ Starting database..."
            docker-compose -f docker-compose.dev.yml up -d postgres
            
            # Wait for database
            echo "⏳ Waiting for database to be ready..."
            sleep 10
            
            # Start API and Web in parallel
            echo "🚀 Starting API and Web servers..."
            npm run dev &
            
            echo ""
            echo "✅ Development servers starting!"
            echo "🔗 Web app: http://localhost:3000"
            echo "🔗 API: http://localhost:3002/api/health"
            echo ""
            echo "📝 Edit apps/web/app/page.tsx to see frontend changes"
            echo "📝 Edit apps/api/src/ files to see backend changes"
            echo ""
            echo "Press Ctrl+C to stop all servers"
            wait
        fi
        ;;
    3)
        echo ""
        echo "📋 Manual Development Instructions:"
        echo ""
        echo "🌐 Frontend Development (Hot Reload):"
        echo "  npm run dev --workspace=apps/web"
        echo "  → Opens http://localhost:3000"
        echo "  → Edit apps/web/app/page.tsx for real-time changes"
        echo ""
        echo "🔧 API Development:"
        echo "  npm run dev --workspace=apps/api"
        echo "  → API available at http://localhost:3002"
        echo ""
        echo "🗄️ Database (if needed):"
        echo "  docker-compose -f docker-compose.dev.yml up -d postgres"
        echo ""
        echo "🔍 View all development processes:"
        echo "  npm run dev  # Starts all workspaces"
        echo ""
        ;;
    *)
        echo "Invalid choice. Please run the script again."
        ;;
esac 