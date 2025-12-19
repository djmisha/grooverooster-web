# Deployment Checklist

Use this checklist to ensure a smooth deployment of the GrooveRooster Web application using Docker.

## Pre-Deployment Checklist

### VPS Preparation
- [ ] VPS provisioned (Ubuntu 22.04 LTS, 2GB+ RAM, 20GB+ disk)
- [ ] Root or sudo access configured
- [ ] Domain name configured to point to VPS IP
- [ ] SSH access verified

### Local Setup
- [ ] Docker Desktop installed
- [ ] Git repository cloned
- [ ] SSH key generated for GitHub Actions

## VPS Initial Setup

Follow [VPS_SETUP.md](./VPS_SETUP.md) for detailed instructions.

### System Setup
- [ ] System packages updated (`apt update && apt upgrade`)
- [ ] Firewall configured (UFW - ports 22, 80, 443)
- [ ] SSH key authentication set up
- [ ] Deployment user created (optional)

### Docker Installation
- [ ] Docker installed and verified (`docker --version`)
- [ ] Docker Compose installed (`docker compose version`)
- [ ] User added to docker group
- [ ] Docker daemon configured (optional logging settings)

### Nginx Configuration
- [ ] Nginx installed
- [ ] Site configuration created (`/etc/nginx/sites-available/grooverooster`)
- [ ] Site enabled (symlink in `/etc/nginx/sites-enabled/`)
- [ ] Configuration tested (`nginx -t`)

### SSL Certificate
- [ ] Certbot installed
- [ ] SSL certificate obtained for domain
- [ ] Auto-renewal configured
- [ ] Certificate tested

### Deployment Directory
- [ ] Directory created at `/opt/grooverooster`
- [ ] Ownership set correctly
- [ ] `docker-compose.yml` copied
- [ ] `.env` file created from `.env.production.example`
- [ ] Environment variables filled in
- [ ] `.env` file secured (`chmod 600 .env`)
- [ ] `deploy.sh` script copied and made executable

### GitHub Container Registry
- [ ] GitHub Personal Access Token created
- [ ] Token added to `.env` file as `GITHUB_TOKEN`
- [ ] Docker login to GHCR tested

## GitHub Repository Setup

Follow [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

### GitHub Secrets
Navigate to: Repository → Settings → Secrets and variables → Actions

#### VPS Connection Secrets
- [ ] `VPS_HOST` (VPS IP or domain)
- [ ] `VPS_USERNAME` (SSH username)
- [ ] `VPS_SSH_PRIVATE_KEY` (SSH private key)
- [ ] `VPS_SSH_PORT` (default: 22)

#### Build-time Environment Variables
- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `NEXT_PUBLIC_API_KEY_EDMTRAIN`
- [ ] `NEXT_PUBLIC_API_URL_EDMTRAIN`
- [ ] `NEXT_PUBLIC_API_URL_EDMTRAIN_ARTIST`
- [ ] `NEXT_PUBLIC_API_KEY_LASTFM`
- [ ] `NEXT_PUBLIC_HCAPTCHA_SITE_KEY`
- [ ] `NEXT_PUBLIC_BASE_URL`

### Repository Configuration
- [ ] GitHub Actions enabled
- [ ] Workflow file present (`.github/workflows/deploy-production.yml`)
- [ ] Main branch set to `master`

## First Deployment

### Manual Deployment (Recommended for First Time)
SSH into VPS and run:
```bash
cd /opt/grooverooster
./deploy.sh
```

### Verification Steps
- [ ] Container running: `docker ps | grep grooverooster-web`
- [ ] Health check passes: `curl http://localhost:3000/api/health`
- [ ] Website accessible: `https://www.grooverooster.com`
- [ ] SSL working (green lock icon in browser)
- [ ] Login functionality works
- [ ] Events load correctly
- [ ] No console errors

### Logs Check
- [ ] Docker logs clean: `docker logs grooverooster-web --tail 50`
- [ ] Nginx access logs present: `sudo tail /var/log/nginx/grooverooster_access.log`
- [ ] Nginx error logs clean: `sudo tail /var/log/nginx/grooverooster_error.log`

## Automated Deployment Setup

### GitHub Actions Deployment
- [ ] Push to master branch (or merge PR)
- [ ] GitHub Actions workflow runs successfully
- [ ] Build and push stage completes
- [ ] Deploy stage completes
- [ ] Verify stage passes
- [ ] Website updates with new changes

### Test Rollback
- [ ] Know how to rollback (see DEPLOYMENT.md)
- [ ] Test manual rollback procedure
- [ ] Verify health checks after rollback

## Monitoring Setup

Follow [MONITORING.md](./MONITORING.md) for detailed options.

### Basic Monitoring (Minimum)
- [ ] Uptime monitoring configured (UptimeRobot or similar)
- [ ] Health check endpoint monitored
- [ ] Email alerts configured
- [ ] Manual log checking procedure established

### Advanced Monitoring (Recommended)
- [ ] Container monitoring scripts installed
- [ ] System monitoring scripts installed
- [ ] Log rotation configured
- [ ] Log aggregation tool set up (optional)
- [ ] Performance monitoring configured (optional)
- [ ] Dashboard access configured (optional)

## Post-Deployment Tasks

### Documentation
- [ ] Update internal documentation with VPS IP and credentials
- [ ] Document any custom configurations
- [ ] Save GitHub Secrets in secure location
- [ ] Document emergency contacts

### Security Audit
- [ ] Firewall rules verified
- [ ] SSH password authentication disabled (key-only)
- [ ] Secrets not committed to repository
- [ ] Environment files secured (chmod 600)
- [ ] Unnecessary services disabled
- [ ] System updates scheduled

### Backup Strategy
- [ ] Environment variables backed up (securely)
- [ ] Nginx configuration backed up
- [ ] SSL certificates backup location noted
- [ ] Database backup strategy documented (Supabase)
- [ ] Deployment scripts backed up

### Team Access
- [ ] Team members have VPS access (if needed)
- [ ] Team members have GitHub repository access
- [ ] Emergency procedures documented
- [ ] On-call rotation established (if applicable)

## Regular Maintenance Schedule

### Daily (Automated)
- [ ] Uptime monitoring active
- [ ] Automated health checks running
- [ ] Log rotation working

### Weekly
- [ ] Review application logs
- [ ] Check container resource usage
- [ ] Review uptime reports
- [ ] Check for security alerts

### Monthly
- [ ] Update Docker images (if new versions available)
- [ ] Review and rotate secrets (if needed)
- [ ] Update system packages: `apt update && apt upgrade`
- [ ] Backup configurations
- [ ] Review access logs for anomalies

### Quarterly
- [ ] Performance audit
- [ ] Security audit
- [ ] Review resource limits
- [ ] Update documentation
- [ ] Review monitoring effectiveness

## Troubleshooting Reference

### Quick Commands

```bash
# Check container status
docker ps

# View logs
docker logs grooverooster-web -f

# Restart container
docker-compose restart

# Stop container
docker-compose down

# Start container
docker-compose up -d

# Check Nginx status
sudo systemctl status nginx

# Test Nginx config
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx

# Check disk space
df -h

# Check memory usage
free -h

# Check system load
uptime

# Manual deployment
cd /opt/grooverooster && ./deploy.sh
```

### Common Issues

**Container won't start:**
1. Check logs: `docker logs grooverooster-web`
2. Verify environment variables: `docker exec grooverooster-web env`
3. Check disk space: `df -h`

**Website not accessible:**
1. Check container: `docker ps | grep grooverooster`
2. Check Nginx: `sudo systemctl status nginx`
3. Test locally: `curl http://localhost:3000/api/health`
4. Check firewall: `sudo ufw status`

**SSL issues:**
1. Check certificate: `sudo certbot certificates`
2. Renew: `sudo certbot renew`
3. Restart Nginx: `sudo systemctl restart nginx`

**High resource usage:**
1. Check stats: `docker stats grooverooster-web`
2. Review logs for errors
3. Check for memory leaks
4. Consider increasing resources

## Emergency Contacts

Document your emergency contacts here:

- **VPS Provider Support**: _____________
- **Domain Registrar**: _____________
- **On-Call Developer**: _____________
- **Team Lead**: _____________
- **Backup Contact**: _____________

## Important URLs

- **Production Website**: https://www.grooverooster.com
- **Health Check**: https://www.grooverooster.com/api/health
- **GitHub Repository**: https://github.com/djmisha/grooverooster-web
- **VPS Control Panel**: _____________
- **Uptime Monitor**: _____________
- **Monitoring Dashboard**: _____________

## Notes

Use this section for deployment-specific notes:

```
Deployment Date: _____________
Deployed By: _____________
VPS Provider: _____________
VPS IP: _____________
Notes:




```

---

**Tip**: Print this checklist and keep it handy for your first deployment. Check off items as you complete them.

**Reference Documents**:
- Detailed VPS setup: [VPS_SETUP.md](./VPS_SETUP.md)
- Deployment guide: [DEPLOYMENT.md](./DEPLOYMENT.md)
- Monitoring setup: [MONITORING.md](./MONITORING.md)
- Quick Docker reference: [DOCKER_QUICK_START.md](./DOCKER_QUICK_START.md)
- Implementation summary: [DOCKERIZATION_SUMMARY.md](./DOCKERIZATION_SUMMARY.md)
