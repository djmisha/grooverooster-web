#!/bin/bash

# Deploy script for GrooveRooster Web Application
# This script should be placed on the VPS at /opt/grooverooster/deploy.sh

set -e  # Exit on any error

# Configuration
DOCKER_REGISTRY="ghcr.io"
GITHUB_USER="djmisha"
IMAGE_NAME="grooverooster-web"
CONTAINER_NAME="grooverooster-web"
DEPLOY_DIR="/opt/grooverooster"
ENV_FILE="${DEPLOY_DIR}/.env"

echo "=========================================="
echo "GrooveRooster Deployment Script"
echo "=========================================="
echo "Started at: $(date)"
echo ""

# Check if running as root or with sudo
if [ "$EUID" -ne 0 ]; then 
    echo "⚠️  Warning: Not running as root. Some operations may require sudo."
fi

# Navigate to deployment directory
cd "$DEPLOY_DIR" || exit 1

# Check if .env file exists
if [ ! -f "$ENV_FILE" ]; then
    echo "❌ Error: .env file not found at $ENV_FILE"
    echo "Please create it using .env.example as a template"
    exit 1
fi

# Load environment variables
echo "📋 Loading environment variables..."
set -a
source "$ENV_FILE"
set +a

# Login to GitHub Container Registry
echo "🔐 Logging in to GitHub Container Registry..."
if [ -z "$GITHUB_TOKEN" ]; then
    echo "❌ Error: GITHUB_TOKEN not set in .env file"
    exit 1
fi
echo "$GITHUB_TOKEN" | docker login "$DOCKER_REGISTRY" -u "$GITHUB_USER" --password-stdin

# Pull latest image
echo "📥 Pulling latest Docker image..."
docker pull "${DOCKER_REGISTRY}/${GITHUB_USER}/${IMAGE_NAME}:latest"

# Stop and remove old container
echo "🛑 Stopping existing container..."
docker-compose down || true

# Start new container
echo "🚀 Starting new container..."
docker-compose up -d

# Wait for container to be healthy
echo "⏳ Waiting for container to be healthy..."
sleep 10

# Check if container is running
if ! docker ps | grep -q "$CONTAINER_NAME"; then
    echo "❌ Error: Container is not running!"
    docker logs "$CONTAINER_NAME" --tail 50
    exit 1
fi

# Check health endpoint
echo "🏥 Checking application health..."
if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
    echo "✅ Health check passed!"
else
    echo "❌ Health check failed!"
    docker logs "$CONTAINER_NAME" --tail 50
    exit 1
fi

# Clean up old images
echo "🧹 Cleaning up old Docker images..."
docker image prune -f

echo ""
echo "=========================================="
echo "✅ Deployment completed successfully!"
echo "=========================================="
echo "Finished at: $(date)"
echo ""
echo "Container status:"
docker ps --filter "name=$CONTAINER_NAME" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
