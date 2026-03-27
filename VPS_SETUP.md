# VPS Setup Guide for GrooveRooster Web

This guide provides step-by-step instructions for setting up a Virtual Private Server (VPS) to host the GrooveRooster Web application using Docker.

## Prerequisites

- A Linux VPS (Ubuntu 22.04 LTS or later recommended)
- Root or sudo access to the VPS
- Domain name configured to point to your VPS
- SSH access to the VPS

## Step 1: Initial Server Setup

### 1.1 Update System Packages

```bash
sudo apt update
sudo apt upgrade -y
```

### 1.2 Create a Deployment User (Optional but Recommended)

```bash
# Create a user for deployments
sudo adduser grooverooster

# Add user to sudo group
sudo usermod -aG sudo grooverooster

# Switch to the new user
su - grooverooster
```

### 1.3 Set Up SSH Key Authentication

On your local machine (or GitHub Actions):

```bash
# Generate SSH key pair (if not already done)
ssh-keygen -t ed25519 -C "grooverooster-deployment"

# Copy the public key to VPS
ssh-copy-id grooverooster@your-vps-ip
```

### 1.4 Configure Firewall

```bash
# Allow SSH
sudo ufw allow 22/tcp

# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

## Step 2: Install Docker and Docker Compose

### 2.1 Install Docker

```bash
# Remove old versions if any
sudo apt remove docker docker-engine docker.io containerd runc

# Install prerequisites
sudo apt install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

# Add Docker's official GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Set up the stable repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Verify installation
docker --version
docker compose version
```

### 2.2 Configure Docker for Non-Root User

```bash
# Add user to docker group
sudo usermod -aG docker $USER

# Apply the new group membership (log out and back in, or run)
newgrp docker

# Test Docker without sudo
docker run hello-world
```

### 2.3 Configure Docker Daemon (Optional)

Create `/etc/docker/daemon.json` for Docker optimizations:

```bash
sudo tee /etc/docker/daemon.json > /dev/null <<EOF
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  },
  "storage-driver": "overlay2"
}
EOF

sudo systemctl restart docker
```

## Step 3: Set Up Nginx as Reverse Proxy

### 3.1 Install Nginx

```bash
sudo apt install -y nginx
```

### 3.2 Configure Nginx for GrooveRooster

Create a new Nginx configuration file:

```bash
sudo nano /etc/nginx/sites-available/grooverooster
```

Add the following configuration:

```nginx
# Rate limiting zone
limit_req_zone $binary_remote_addr zone=grooverooster_limit:10m rate=10r/s;

# Upstream configuration
upstream grooverooster_backend {
    server localhost:3000;
    keepalive 32;
}

# HTTP to HTTPS redirect
server {
    listen 80;
    listen [::]:80;
    server_name www.grooverooster.com grooverooster.com;

    # Redirect all HTTP traffic to HTTPS
    return 301 https://www.grooverooster.com$request_uri;
}

# HTTPS configuration
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name www.grooverooster.com grooverooster.com;

    # SSL certificates (configured by Certbot later)
    ssl_certificate /etc/letsencrypt/live/www.grooverooster.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/www.grooverooster.com/privkey.pem;
    ssl_trusted_certificate /etc/letsencrypt/live/www.grooverooster.com/chain.pem;

    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384';
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    ssl_stapling on;
    ssl_stapling_verify on;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Logging
    access_log /var/log/nginx/grooverooster_access.log;
    error_log /var/log/nginx/grooverooster_error.log;

    # Client body size limit
    client_max_body_size 10M;

    # Rate limiting
    limit_req zone=grooverooster_limit burst=20 nodelay;

    # Proxy settings
    location / {
        proxy_pass http://grooverooster_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Health check endpoint (bypasses rate limiting)
    location /api/health {
        proxy_pass http://grooverooster_backend;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        access_log off;
    }

    # Static files caching
    location /_next/static {
        proxy_pass http://grooverooster_backend;
        proxy_cache_valid 200 60m;
        add_header Cache-Control "public, immutable";
    }
}
```

### 3.3 Enable the Site

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/grooverooster /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Reload Nginx (don't restart yet, SSL certs needed first)
# sudo systemctl reload nginx
```

## Step 4: Set Up SSL with Let's Encrypt

### 4.1 Install Certbot

```bash
sudo apt install -y certbot python3-certbot-nginx
```

### 4.2 Obtain SSL Certificate

```bash
# Make sure Nginx is stopped temporarily
sudo systemctl stop nginx

# Obtain certificate using standalone mode
sudo certbot certonly --standalone -d www.grooverooster.com -d grooverooster.com

# Or if Nginx is running and configured
sudo certbot --nginx -d www.grooverooster.com -d grooverooster.com
```

### 4.3 Set Up Auto-Renewal

```bash
# Test renewal
sudo certbot renew --dry-run

# Certbot automatically sets up a cron job for renewal
# Verify it exists:
sudo systemctl list-timers | grep certbot
```

### 4.4 Start Nginx

```bash
sudo systemctl start nginx
sudo systemctl enable nginx
sudo systemctl status nginx
```

## Step 5: Set Up Deployment Directory

### 5.1 Create Directory Structure

```bash
# Create deployment directory
sudo mkdir -p /opt/grooverooster
sudo chown $USER:$USER /opt/grooverooster
cd /opt/grooverooster
```

### 5.2 Create docker-compose.yml

Copy the `docker-compose.yml` from the repository:

```bash
curl -o docker-compose.yml https://raw.githubusercontent.com/djmisha/grooverooster-web/master/docker-compose.yml
```

Or create it manually (see the docker-compose.yml in the repository).

### 5.3 Create .env File

```bash
cd /opt/grooverooster
nano .env
```

Add all required environment variables (see `.env.example` from the repository):

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_URL=your-project-url.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Third-Party API Keys
NEXT_PUBLIC_API_KEY_EDMTRAIN=your-edmtrain-api-key
NEXT_PUBLIC_API_URL_EDMTRAIN=https://edmtrain.com/api/events
NEXT_PUBLIC_API_URL_EDMTRAIN_ARTIST=https://edmtrain.com/api/artists
NEXT_PUBLIC_API_KEY_LASTFM=your-lastfm-api-key
API_KEY_TICKETMASTER=your-ticketmaster-api-key
API_KEY_SDHM=your-sdhm-api-key
API_URL_SDHM=your-sdhm-api-url

# Authentication & Security
API_ALLOWED_TOKENS=token1,token2,token3

# HCaptcha Configuration
NEXT_PUBLIC_HCAPTCHA_SITE_KEY=your-hcaptcha-site-key
HCAPTCHA_SECRET_KEY=your-hcaptcha-secret-key

# Application Configuration
NEXT_PUBLIC_BASE_URL=https://www.grooverooster.com

# GitHub Token for pulling private images (if needed)
GITHUB_TOKEN=your-github-personal-access-token

# Environment
NODE_ENV=production
```

**Important:** Secure the .env file:

```bash
chmod 600 .env
```

### 5.4 Copy Deployment Script

```bash
cd /opt/grooverooster
curl -o deploy.sh https://raw.githubusercontent.com/djmisha/grooverooster-web/master/deployment/deploy.sh
chmod +x deploy.sh
```

## Step 6: Configure GitHub Container Registry Access

### 6.1 Create GitHub Personal Access Token

1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token with the following scopes:
   - `read:packages` (for pulling images)
   - `write:packages` (for pushing images, if needed)
3. Copy the token and add it to the `.env` file as `GITHUB_TOKEN`

### 6.2 Login to GitHub Container Registry

```bash
cd /opt/grooverooster
echo "$GITHUB_TOKEN" | docker login ghcr.io -u djmisha --password-stdin
```

## Step 7: Configure GitHub Actions Secrets

In your GitHub repository, go to Settings → Secrets and variables → Actions, and add the following secrets:

### Required Secrets:

1. **VPS Connection:**
   - `VPS_HOST`: Your VPS IP address or domain
   - `VPS_USERNAME`: SSH username (e.g., `grooverooster`)
   - `VPS_SSH_PRIVATE_KEY`: Private SSH key for authentication
   - `VPS_SSH_PORT`: SSH port (default: 22)

2. **Environment Variables (same as .env file):**
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_API_KEY_EDMTRAIN`
   - `NEXT_PUBLIC_API_URL_EDMTRAIN`
   - `NEXT_PUBLIC_API_URL_EDMTRAIN_ARTIST`
   - `NEXT_PUBLIC_API_KEY_LASTFM`
   - `NEXT_PUBLIC_HCAPTCHA_SITE_KEY`
   - `NEXT_PUBLIC_BASE_URL`

Note: `GITHUB_TOKEN` is automatically provided by GitHub Actions.

## Step 8: Initial Deployment

### 8.1 Manual First Deployment

For the first deployment, run manually to ensure everything works:

```bash
cd /opt/grooverooster

# Pull the latest image
docker pull ghcr.io/djmisha/grooverooster-web:latest

# Start the application
docker-compose up -d

# Check container status
docker ps

# Check logs
docker logs grooverooster-web -f

# Test the health endpoint
curl http://localhost:3000/api/health

# Test via Nginx
curl https://www.grooverooster.com/api/health
```

### 8.2 Verify Deployment

1. Open your browser and navigate to `https://www.grooverooster.com`
2. Check that the application loads correctly
3. Test key functionality (login, event browsing, etc.)

## Step 9: Set Up Monitoring (Optional but Recommended)

See `MONITORING.md` for detailed monitoring and logging setup instructions.

## Troubleshooting

### Container Won't Start

```bash
# Check container logs
docker logs grooverooster-web

# Check environment variables
docker exec grooverooster-web env

# Restart container
docker-compose restart
```

### SSL Certificate Issues

```bash
# Check certificate status
sudo certbot certificates

# Renew certificate manually
sudo certbot renew --force-renewal

# Restart Nginx
sudo systemctl restart nginx
```

### Port Already in Use

```bash
# Check what's using port 3000
sudo lsof -i :3000

# Or using ss
sudo ss -tlnp | grep :3000
```

### Nginx Configuration Issues

```bash
# Test configuration
sudo nginx -t

# Check logs
sudo tail -f /var/log/nginx/grooverooster_error.log
```

### Docker Disk Space Issues

```bash
# Check disk usage
df -h

# Clean up Docker
docker system prune -a

# Remove unused volumes
docker volume prune
```

## Maintenance

### Regular Updates

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Update Docker images (handled by CI/CD, but can be done manually)
cd /opt/grooverooster
./deploy.sh
```

### Backup

Regularly backup:

1. Environment variables (`.env` file)
2. Nginx configuration
3. SSL certificates
4. Application data (if storing locally)

### Monitoring

- Check application logs regularly
- Monitor Docker resource usage
- Set up uptime monitoring
- Monitor SSL certificate expiration

## Security Best Practices

1. **Keep system updated:** Regular security updates
2. **Use strong SSH keys:** Disable password authentication
3. **Firewall rules:** Only allow necessary ports
4. **Regular backups:** Automate backup process
5. **Monitor logs:** Set up log aggregation and alerting
6. **Rotate secrets:** Regularly rotate API keys and tokens
7. **Use non-root users:** Run applications as non-root
8. **Enable Docker security:** Use AppArmor/SELinux profiles

## Next Steps

1. Set up monitoring and logging (see `MONITORING.md`)
2. Configure automated backups
3. Set up alerting for critical issues
4. Consider setting up a staging environment
5. Document any custom configurations

## Support

For issues or questions:

- Check application logs: `docker logs grooverooster-web`
- Check Nginx logs: `sudo tail -f /var/log/nginx/grooverooster_error.log`
- Review deployment documentation in the repository
