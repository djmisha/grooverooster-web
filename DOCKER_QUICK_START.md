# Docker Quick Start Guide

This guide helps you quickly get started with Docker for GrooveRooster Web.

## Local Development with Docker

### Prerequisites
- Docker Desktop installed ([Download](https://www.docker.com/products/docker-desktop))
- Docker Compose installed (included with Docker Desktop)
- `.env.local` file with all required environment variables

### Quick Start

1. **Copy environment variables**:
   ```bash
   cp .env.example .env.local
   # Edit .env.local and fill in your actual values
   ```

2. **Build and run**:
   ```bash
   docker-compose up --build
   ```

3. **Access the application**:
   - Open http://localhost:3000 in your browser

4. **Stop the application**:
   ```bash
   docker-compose down
   ```

### Common Commands

```bash
# Build the Docker image
docker build -t grooverooster-web .

# Run in detached mode (background)
docker-compose up -d

# View logs
docker-compose logs -f

# Restart the application
docker-compose restart

# Stop and remove containers
docker-compose down

# Remove containers and volumes
docker-compose down -v

# Rebuild without cache
docker-compose build --no-cache

# Check container status
docker ps

# Execute command in container
docker exec -it grooverooster-web sh
```

## Production Deployment

For production deployment to a VPS, follow these guides in order:

1. **[VPS_SETUP.md](./VPS_SETUP.md)** - Initial server setup, Docker installation, Nginx configuration
2. **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Comprehensive deployment guide with CI/CD
3. **[MONITORING.md](./MONITORING.md)** - Monitoring and logging setup

### Quick Production Deployment Steps

1. **Set up VPS** (Follow VPS_SETUP.md):
   - Install Docker and Docker Compose
   - Configure Nginx as reverse proxy
   - Set up SSL with Let's Encrypt
   - Create deployment directory at `/opt/grooverooster`

2. **Configure GitHub** (Follow DEPLOYMENT.md):
   - Add GitHub Secrets for VPS connection
   - Add environment variable secrets
   - Workflow triggers automatically on push to `master`

3. **First Deployment**:
   - Merge code to `master` branch
   - GitHub Actions automatically builds and deploys
   - Or manually trigger via GitHub Actions UI

## Docker Image Details

### Image Size
The production image is optimized using:
- Multi-stage builds
- Alpine Linux base (minimal size)
- Next.js standalone output
- Only production dependencies

Expected size: ~150-250MB (compared to 1GB+ without optimization)

### Security Features
- Runs as non-root user (nextjs:nodejs)
- Minimal attack surface (Alpine Linux)
- No development dependencies
- Security headers configured

### Health Check
The image includes a health check endpoint at `/api/health`:
- Interval: 30 seconds
- Timeout: 10 seconds
- Start period: 40 seconds
- Retries: 3

## Troubleshooting

### Build fails with "Cannot find module"
**Solution**: Clear build cache and rebuild
```bash
docker-compose build --no-cache
```

### Container starts but application doesn't respond
**Solution**: Check logs and environment variables
```bash
docker logs grooverooster-web
docker exec grooverooster-web env | grep NEXT_PUBLIC
```

### "Permission denied" errors
**Solution**: Ensure proper file permissions
```bash
# On Linux/macOS
chmod 644 .env.local
```

### Port 3000 already in use
**Solution**: Stop other services or change port in docker-compose.yml
```bash
# Find what's using port 3000
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Or change port in docker-compose.yml
ports:
  - "3001:3000"  # Map to port 3001 instead
```

### Build fails with "NEXT_PUBLIC_* not found"
**Solution**: Ensure build args are passed correctly
```bash
# For local builds, set environment variables first
export NEXT_PUBLIC_SUPABASE_URL=your-url
export NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
# ... etc

# Then build
docker-compose build
```

### Out of disk space
**Solution**: Clean up Docker resources
```bash
# Remove unused images
docker image prune -a

# Remove unused volumes
docker volume prune

# Remove everything unused
docker system prune -a --volumes
```

## Environment Variables

### Build-time Variables (NEXT_PUBLIC_*)
These are embedded into the JavaScript bundle during build:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_API_KEY_EDMTRAIN`
- `NEXT_PUBLIC_API_URL_EDMTRAIN`
- `NEXT_PUBLIC_API_URL_EDMTRAIN_ARTIST`
- `NEXT_PUBLIC_API_KEY_LASTFM`
- `NEXT_PUBLIC_HCAPTCHA_SITE_KEY`
- `NEXT_PUBLIC_BASE_URL`

### Runtime Variables
These are used by the server at runtime:
- `SUPABASE_SERVICE_ROLE_KEY`
- `API_KEY_TICKETMASTER`
- `API_KEY_SDHM`
- `API_URL_SDHM`
- `API_ALLOWED_TOKENS`
- `HCAPTCHA_SECRET_KEY`
- `NODE_ENV`

## Best Practices

### Development
1. Use `.env.local` for local development (not committed)
2. Never commit sensitive keys
3. Use Docker for consistent development environment
4. Test Docker builds before pushing to production

### Production
1. Use secrets management for sensitive data
2. Regularly update base images
3. Monitor resource usage
4. Set up automated backups
5. Use health checks for monitoring
6. Implement log rotation

## Additional Resources

- [Next.js Docker Documentation](https://nextjs.org/docs/deployment#docker-image)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Next.js Standalone Output](https://nextjs.org/docs/advanced-features/output-file-tracing)

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review container logs: `docker logs grooverooster-web`
3. Check the comprehensive guides:
   - `VPS_SETUP.md` for server setup
   - `DEPLOYMENT.md` for deployment
   - `MONITORING.md` for monitoring
