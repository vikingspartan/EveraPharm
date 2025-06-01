#!/bin/bash

# Script to detect Docker Compose version and set appropriate command

# Try docker compose (v2)
if docker compose version &> /dev/null; then
    export DOCKER_COMPOSE="docker compose"
    echo "✅ Detected Docker Compose v2"
# Try docker-compose (v1)
elif docker-compose version &> /dev/null; then
    export DOCKER_COMPOSE="docker-compose"
    echo "✅ Detected Docker Compose v1"
else
    echo "❌ Docker Compose not found!"
    echo "Please install Docker Compose:"
    echo "  For v1: sudo apt-get install docker-compose"
    echo "  For v2: sudo apt-get install docker-compose-plugin"
    exit 1
fi

echo "Using command: $DOCKER_COMPOSE" 