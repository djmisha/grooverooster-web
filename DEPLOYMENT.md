# Deployment Documentation

This document provides comprehensive instructions for deploying the GrooveRooster Web application to a production VPS using Docker and GitHub Actions.

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Architecture](#architecture)
4. [Initial Setup](#initial-setup)
5. [CI/CD Pipeline](#cicd-pipeline)
6. [Deployment Process](#deployment-process)
7. [Rollback Strategy](#rollback-strategy)
8. [Troubleshooting](#troubleshooting)

## Overview

The GrooveRooster Web application is deployed using a containerized approach with Docker. The CI/CD pipeline is built with GitHub Actions and automatically deploys to the production VPS when changes are merged to the `master` branch.

### Key Technologies

- **Docker**: Containerization platform
- **Docker Compose**: Multi-container orchestration
- **GitHub Actions**: CI/CD automation
- **Nginx**: Reverse proxy and SSL termination
- **Let's Encrypt**: SSL certificates

## Prerequisites

Before starting the deployment process, ensure you have:

### On the VPS
- Ubuntu 22.04 LTS or later
- Docker and Docker Compose installed
- Nginx configured as reverse proxy
- SSL certificates from Let's Encrypt
- SSH access configured

See `VPS_SETUP.md` for detailed setup instructions.

### On GitHub
- Repository access
- GitHub Actions enabled
- Required secrets configured

## Architecture

### Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Internet                              │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ HTTPS (443)
                         │
┌────────────────────────▼────────────────────────────────────┐
│                    Nginx Reverse Proxy                       │
│  - SSL Termination                                           │
│  - Rate Limiting                                             │
│  - Static File Caching                                       │
│  - Security Headers                                          │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ HTTP (3000)
                         │
┌────────────────────────▼────────────────────────────────────┐
│              Docker Container                                │
│  ┌───────────────────────────────────────────────────────┐  │
│  │     Next.js Application (Standalone)                  │  │
│  │  - Node.js 20                                         │  │
│  │  - Production Build                                   │  │
│  │  - Health Check Endpoint                              │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                         │
                         │
┌────────────────────────▼────────────────────────────────────┐
│                  External Services                           │
│  - Supabase (Database & Auth)                                │
│  - EDM Train API                                             │
│  - Last.fm API                                               │
│  - Ticketmaster API                                          │
│  - HCaptcha                                                  │
└─────────────────────────────────────────────────────────────┘
```

### CI/CD Pipeline Flow

```
┌──────────────┐
│   Git Push   │
│  to master   │
└──────┬───────┘
       │
       ▼
┌──────────────────────────┐
│   GitHub Actions         │
│   ┌──────────────────┐   │
│   │  Build Stage     │   │
│   │  - Checkout      │   │
│   │  - Build Docker  │   │
│   │  - Push to GHCR  │   │
│   └─────┬────────────┘   │
│         │                │
│         ▼                │
│   ┌──────────────────┐   │
│   │  Deploy Stage    │   │
│   │  - SSH to VPS    │   │
│   │  - Pull Image    │   │
│   │  - Start App     │   │
│   └─────┬────────────┘   │
│         │                │
│         ▼                │
│   ┌──────────────────┐   │
│   │  Verify Stage    │   │
│   │  - Health Check  │   │
│   │  - Notify        │   │
│   └──────────────────┘   │
└──────────────────────────┘
```

## Initial Setup

### 1. VPS Setup

Follow the complete setup guide in `VPS_SETUP.md`. Key steps:

1. Install Docker and Docker Compose
2. Set up Nginx as reverse proxy
3. Configure SSL with Let's Encrypt
4. Create deployment directory structure
5. Configure environment variables

### 2. GitHub Repository Setup

#### 2.1 Configure GitHub Secrets

Navigate to your repository: Settings → Secrets and variables → Actions

Add the following secrets:

**VPS Connection Secrets:**
- `VPS_HOST`: Your VPS IP or domain (e.g., `203.0.113.1`)
- `VPS_USERNAME`: SSH username (e.g., `grooverooster`)
- `VPS_SSH_PRIVATE_KEY`: Your SSH private key
- `VPS_SSH_PORT`: SSH port (default: `22`)

**Application Secrets (Build-time):**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_API_KEY_EDMTRAIN`
- `NEXT_PUBLIC_API_URL_EDMTRAIN`
- `NEXT_PUBLIC_API_URL_EDMTRAIN_ARTIST`
- `NEXT_PUBLIC_API_KEY_LASTFM`
- `NEXT_PUBLIC_HCAPTCHA_SITE_KEY`
- `NEXT_PUBLIC_BASE_URL`

#### 2.2 Generate SSH Key for GitHub Actions

On your local machine or VPS:

```bash
# Generate SSH key pair
ssh-keygen -t ed25519 -f ~/.ssh/grooverooster_deploy -C "GitHub Actions Deploy"

# Copy public key to VPS
ssh-copy-id -i ~/.ssh/grooverooster_deploy.pub grooverooster@your-vps-ip

# Display private key (add this to GitHub Secrets as VPS_SSH_PRIVATE_KEY)
cat ~/.ssh/grooverooster_deploy
```

#### 2.3 Enable GitHub Container Registry

The workflow automatically uses GitHub Container Registry (ghcr.io) with the repository's `GITHUB_TOKEN`.

### 3. VPS Environment Configuration

On your VPS at `/opt/grooverooster/.env`:

```bash
# Runtime environment variables (server-side only)
SUPABASE_URL=your-project-url.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

API_KEY_TICKETMASTER=your-ticketmaster-api-key
API_KEY_SDHM=your-sdhm-api-key
API_URL_SDHM=your-sdhm-api-url

API_ALLOWED_TOKENS=token1,token2,token3

HCAPTCHA_SECRET_KEY=your-hcaptcha-secret-key

# GitHub token for pulling images
GITHUB_TOKEN=your-github-personal-access-token

NODE_ENV=production
```

## CI/CD Pipeline

### Workflow Triggers

The deployment workflow (`.github/workflows/deploy-production.yml`) is triggered by:

1. **Automatic**: Push to `master` branch
2. **Manual**: Via GitHub Actions UI (workflow_dispatch)

### Pipeline Stages

#### Stage 1: Build and Push

**Duration**: ~5-10 minutes

1. Checks out the repository code
2. Sets up Docker Buildx for optimized builds
3. Logs in to GitHub Container Registry
4. Builds the Docker image with build-time environment variables
5. Pushes the image to GHCR with tags:
   - `latest` (for master branch)
   - `master-{commit-sha}` (specific version)

**Image Optimizations:**
- Multi-stage build reduces final image size
- Layer caching speeds up builds
- Standalone Next.js output minimizes dependencies

#### Stage 2: Deploy

**Duration**: ~2-3 minutes

1. SSHs into the VPS
2. Authenticates with GitHub Container Registry
3. Pulls the latest image
4. Stops the existing container
5. Starts a new container with the updated image
6. Removes old images to save disk space

#### Stage 3: Verify

**Duration**: ~30 seconds

1. Checks if the container is running
2. Tests the health check endpoint
3. Reports deployment status

### Monitoring the Pipeline

View pipeline status:
1. Go to your repository on GitHub
2. Click the "Actions" tab
3. Select the latest "Deploy to Production VPS" workflow run

## Deployment Process

### Automatic Deployment

1. **Develop and Test**: Make changes on a feature branch
2. **Create PR**: Open a pull request to `master`
3. **Code Review**: Review and approve the PR
4. **Merge**: Merge the PR to `master`
5. **Auto Deploy**: GitHub Actions automatically deploys

### Manual Deployment

#### Option 1: Via GitHub Actions UI

1. Go to GitHub repository → Actions
2. Select "Deploy to Production VPS" workflow
3. Click "Run workflow"
4. Select `master` branch
5. Click "Run workflow" button

#### Option 2: Via VPS

SSH into the VPS and run:

```bash
cd /opt/grooverooster
./deploy.sh
```

### Post-Deployment Verification

After deployment, verify:

1. **Container Status**:
```bash
docker ps | grep grooverooster-web
```

2. **Application Logs**:
```bash
docker logs grooverooster-web --tail 100 -f
```

3. **Health Check**:
```bash
curl http://localhost:3000/api/health
curl https://www.grooverooster.com/api/health
```

4. **Website Access**:
   - Open https://www.grooverooster.com in browser
   - Test key features

## Rollback Strategy

### Quick Rollback

If issues are detected after deployment:

#### Option 1: Rollback to Previous Image

```bash
# SSH into VPS
ssh grooverooster@your-vps-ip

# Navigate to deployment directory
cd /opt/grooverooster

# Stop current container
docker-compose down

# List available images
docker images | grep grooverooster-web

# Update docker-compose.yml to use specific tag
# Change:
#   image: ghcr.io/djmisha/grooverooster-web:latest
# To:
#   image: ghcr.io/djmisha/grooverooster-web:master-PREVIOUS_SHA

# Start with previous version
docker-compose up -d

# Verify
curl http://localhost:3000/api/health
```

#### Option 2: Revert Git Commit

```bash
# On your local machine
git revert HEAD
git push origin master

# This triggers automatic deployment of the reverted code
```

### Emergency Rollback

For critical issues:

```bash
# SSH into VPS
ssh grooverooster@your-vps-ip

# Stop the application
cd /opt/grooverooster
docker-compose down

# Edit docker-compose.yml to pin to known good version
nano docker-compose.yml

# Start with known good version
docker-compose up -d
```

## Troubleshooting

### Build Failures

**Issue**: Docker build fails in GitHub Actions

**Solutions**:
1. Check GitHub Actions logs for specific errors
2. Verify all required secrets are set
3. Ensure build-time environment variables are correct
4. Test build locally:
```bash
docker build \
  --build-arg NEXT_PUBLIC_SUPABASE_URL=your-url \
  --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key \
  # ... other args
  -t grooverooster-web:test .
```

### Deployment Failures

**Issue**: SSH connection fails

**Solutions**:
1. Verify VPS is accessible: `ping your-vps-ip`
2. Check SSH key is correctly added to GitHub Secrets
3. Verify SSH port is correct (default: 22)
4. Test SSH manually: `ssh -i ~/.ssh/key grooverooster@vps-ip`

**Issue**: Docker pull fails

**Solutions**:
1. Verify GitHub token has correct permissions
2. Check VPS can access ghcr.io: `curl https://ghcr.io`
3. Re-authenticate: `echo $TOKEN | docker login ghcr.io -u username --password-stdin`

### Runtime Issues

**Issue**: Container starts but application doesn't work

**Solutions**:
1. Check logs: `docker logs grooverooster-web -f`
2. Verify environment variables: `docker exec grooverooster-web env`
3. Check health endpoint: `curl http://localhost:3000/api/health`
4. Verify database connectivity
5. Check API keys are valid

**Issue**: High memory usage

**Solutions**:
1. Check container stats: `docker stats grooverooster-web`
2. Review memory limits in `docker-compose.yml`
3. Check for memory leaks in application logs
4. Consider increasing VPS resources

**Issue**: SSL certificate issues

**Solutions**:
1. Check certificate status: `sudo certbot certificates`
2. Renew manually: `sudo certbot renew`
3. Verify Nginx configuration: `sudo nginx -t`
4. Check certificate files exist in `/etc/letsencrypt/live/`

### Performance Issues

**Issue**: Slow response times

**Solutions**:
1. Check Nginx logs for bottlenecks
2. Review application logs for slow queries
3. Monitor CPU/memory usage
4. Check external API response times
5. Review Next.js build for optimization opportunities

**Issue**: Rate limiting triggered

**Solutions**:
1. Review Nginx rate limit settings
2. Adjust limits in `/etc/nginx/sites-available/grooverooster`
3. Reload Nginx: `sudo systemctl reload nginx`

## Best Practices

### Security

1. **Secrets Management**:
   - Never commit secrets to repository
   - Rotate secrets regularly
   - Use GitHub Secrets for CI/CD
   - Secure .env files on VPS (chmod 600)

2. **Container Security**:
   - Run as non-root user (already configured)
   - Keep base images updated
   - Scan for vulnerabilities regularly
   - Limit container resources

3. **Network Security**:
   - Use HTTPS only
   - Configure firewall rules
   - Enable rate limiting
   - Regular security updates

### Maintenance

1. **Regular Updates**:
   - Update dependencies monthly
   - Update Docker images
   - Update system packages
   - Renew SSL certificates (automated)

2. **Monitoring**:
   - Set up uptime monitoring
   - Monitor application logs
   - Track resource usage
   - Set up alerts for critical issues

3. **Backups**:
   - Backup environment variables
   - Backup Nginx configuration
   - Document custom configurations
   - Keep previous Docker images

### Optimization

1. **Docker Image**:
   - Use multi-stage builds (implemented)
   - Minimize layers
   - Use .dockerignore effectively
   - Enable build caching

2. **Application**:
   - Enable Next.js standalone output (implemented)
   - Use production build
   - Optimize bundle size
   - Enable caching

3. **Infrastructure**:
   - Use Nginx caching for static assets
   - Enable compression
   - Use CDN for static files (optional)
   - Optimize database queries

## Support and Resources

### Documentation
- [VPS Setup Guide](./VPS_SETUP.md)
- [Monitoring Guide](./MONITORING.md)
- [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)

### Logs Location

**On VPS**:
- Docker logs: `docker logs grooverooster-web`
- Nginx access: `/var/log/nginx/grooverooster_access.log`
- Nginx error: `/var/log/nginx/grooverooster_error.log`
- System logs: `journalctl -u docker`

**On GitHub**:
- Actions logs: Repository → Actions → Select workflow run

### Useful Commands

```bash
# Check container status
docker ps

# View logs
docker logs grooverooster-web -f

# Restart container
docker-compose restart

# Check resource usage
docker stats grooverooster-web

# Execute command in container
docker exec grooverooster-web <command>

# Update and redeploy
./deploy.sh

# Check Nginx status
sudo systemctl status nginx

# Test Nginx configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

## Conclusion

This deployment setup provides a robust, secure, and automated way to deploy the GrooveRooster Web application. The use of Docker ensures consistency across environments, while GitHub Actions automates the deployment process.

For additional help or questions, refer to the other documentation files or contact the development team.
