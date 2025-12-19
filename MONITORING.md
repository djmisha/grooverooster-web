# Monitoring and Logging Guide

This guide provides recommendations and instructions for setting up comprehensive monitoring and logging for the GrooveRooster Web application on your VPS.

## Table of Contents

1. [Overview](#overview)
2. [Container Monitoring](#container-monitoring)
3. [Application Logging](#application-logging)
4. [System Monitoring](#system-monitoring)
5. [Uptime Monitoring](#uptime-monitoring)
6. [Log Aggregation](#log-aggregation)
7. [Alerting](#alerting)
8. [Performance Monitoring](#performance-monitoring)

## Overview

Effective monitoring and logging are crucial for:
- **Early problem detection**: Identify issues before they affect users
- **Performance optimization**: Track resource usage and bottlenecks
- **Debugging**: Quickly diagnose and resolve issues
- **Security**: Detect and respond to security incidents
- **Capacity planning**: Understand usage patterns and plan scaling

## Container Monitoring

### Docker Stats

#### Basic Monitoring

View real-time container statistics:

```bash
# Monitor all containers
docker stats

# Monitor specific container
docker stats grooverooster-web

# One-time snapshot (no streaming)
docker stats --no-stream grooverooster-web
```

#### Automated Monitoring Script

Create a script for periodic monitoring:

```bash
nano /opt/grooverooster/monitor.sh
```

Add the following:

```bash
#!/bin/bash

# Container monitoring script
CONTAINER_NAME="grooverooster-web"
LOG_FILE="/var/log/grooverooster/container-stats.log"

# Create log directory
sudo mkdir -p /var/log/grooverooster

# Log timestamp
echo "=== $(date) ===" >> "$LOG_FILE"

# Get container stats
docker stats "$CONTAINER_NAME" --no-stream --format \
  "CPU: {{.CPUPerc}}\tMemory: {{.MemUsage}}\tNetwork I/O: {{.NetIO}}\tBlock I/O: {{.BlockIO}}" \
  >> "$LOG_FILE"

# Check if container is running
if ! docker ps | grep -q "$CONTAINER_NAME"; then
    echo "ALERT: Container $CONTAINER_NAME is not running!" >> "$LOG_FILE"
fi

echo "" >> "$LOG_FILE"
```

Make it executable and set up cron:

```bash
chmod +x /opt/grooverooster/monitor.sh

# Add to cron (runs every 5 minutes)
crontab -e
```

Add this line:
```
*/5 * * * * /opt/grooverooster/monitor.sh
```

### Docker Health Checks

Health checks are already configured in the Dockerfile. View health status:

```bash
# Check container health
docker ps --format "table {{.Names}}\t{{.Status}}"

# Detailed health check info
docker inspect --format='{{json .State.Health}}' grooverooster-web | jq
```

## Application Logging

### Viewing Logs

#### Docker Logs

```bash
# View recent logs
docker logs grooverooster-web

# Follow logs in real-time
docker logs grooverooster-web -f

# View last 100 lines
docker logs grooverooster-web --tail 100

# View logs with timestamps
docker logs grooverooster-web -t

# View logs since specific time
docker logs grooverooster-web --since 1h
docker logs grooverooster-web --since "2024-01-01T00:00:00"
```

#### Nginx Logs

```bash
# Access logs
sudo tail -f /var/log/nginx/grooverooster_access.log

# Error logs
sudo tail -f /var/log/nginx/grooverooster_error.log

# Search for errors
sudo grep "error" /var/log/nginx/grooverooster_error.log

# View last 100 lines
sudo tail -100 /var/log/nginx/grooverooster_access.log
```

### Log Rotation

Docker automatically rotates logs based on the configuration in `/etc/docker/daemon.json`:

```json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
```

For Nginx, configure logrotate:

```bash
sudo nano /etc/logrotate.d/nginx-grooverooster
```

Add:

```
/var/log/nginx/grooverooster_*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data adm
    sharedscripts
    postrotate
        if [ -f /var/run/nginx.pid ]; then
            kill -USR1 `cat /var/run/nginx.pid`
        fi
    endscript
}
```

## System Monitoring

### System Resource Monitoring

#### htop (Interactive Process Viewer)

```bash
# Install htop
sudo apt install -y htop

# Run htop
htop
```

#### System Statistics

```bash
# Disk usage
df -h

# Memory usage
free -h

# CPU information
lscpu

# System load
uptime

# I/O statistics
iostat

# Network statistics
netstat -tunlp
```

### Automated System Monitoring

Create a system monitoring script:

```bash
nano /opt/grooverooster/system-monitor.sh
```

Add:

```bash
#!/bin/bash

LOG_FILE="/var/log/grooverooster/system-stats.log"
ALERT_LOG="/var/log/grooverooster/alerts.log"

# Thresholds
CPU_THRESHOLD=80
MEMORY_THRESHOLD=80
DISK_THRESHOLD=85

# Create log directory
sudo mkdir -p /var/log/grooverooster

# Log timestamp
echo "=== $(date) ===" >> "$LOG_FILE"

# CPU Usage
CPU_USAGE=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1)
echo "CPU Usage: ${CPU_USAGE}%" >> "$LOG_FILE"

if (( $(echo "$CPU_USAGE > $CPU_THRESHOLD" | bc -l) )); then
    echo "$(date) - ALERT: CPU usage is ${CPU_USAGE}%" >> "$ALERT_LOG"
fi

# Memory Usage
MEMORY_USAGE=$(free | grep Mem | awk '{printf("%.0f", $3/$2 * 100)}')
echo "Memory Usage: ${MEMORY_USAGE}%" >> "$LOG_FILE"

if [ "$MEMORY_USAGE" -gt "$MEMORY_THRESHOLD" ]; then
    echo "$(date) - ALERT: Memory usage is ${MEMORY_USAGE}%" >> "$ALERT_LOG"
fi

# Disk Usage
DISK_USAGE=$(df -h / | awk 'NR==2 {print $5}' | cut -d'%' -f1)
echo "Disk Usage: ${DISK_USAGE}%" >> "$LOG_FILE"

if [ "$DISK_USAGE" -gt "$DISK_THRESHOLD" ]; then
    echo "$(date) - ALERT: Disk usage is ${DISK_USAGE}%" >> "$ALERT_LOG"
fi

echo "" >> "$LOG_FILE"
```

Make executable and schedule:

```bash
chmod +x /opt/grooverooster/system-monitor.sh

# Add to cron (runs every 5 minutes)
crontab -e
```

Add:
```
*/5 * * * * /opt/grooverooster/system-monitor.sh
```

## Uptime Monitoring

### Option 1: UptimeRobot (Free/Paid)

**Website**: https://uptimerobot.com

**Features**:
- Free plan: 50 monitors, 5-minute intervals
- HTTP(S) monitoring
- Keyword monitoring
- Email/SMS alerts
- Public status pages

**Setup**:
1. Create account at uptimerobot.com
2. Add new monitor:
   - Type: HTTP(s)
   - URL: https://www.grooverooster.com/api/health
   - Monitoring Interval: 5 minutes
3. Configure alert contacts
4. Set up status page (optional)

### Option 2: Uptime Kuma (Self-Hosted, Free)

**Website**: https://github.com/louislam/uptime-kuma

**Features**:
- Self-hosted
- Beautiful dashboard
- Multiple notification channels
- Status pages
- Docker support

**Setup**:

```bash
# Create directory
mkdir -p /opt/uptime-kuma

# Run with Docker
docker run -d \
  --name uptime-kuma \
  --restart=always \
  -p 3001:3001 \
  -v /opt/uptime-kuma:/app/data \
  louislam/uptime-kuma:1

# Access at http://your-vps-ip:3001
```

Configure monitoring:
1. Access web interface
2. Create admin account
3. Add monitor for https://www.grooverooster.com/api/health
4. Configure notifications

### Option 3: Healthchecks.io (Free/Paid)

**Website**: https://healthchecks.io

**Features**:
- Cron job monitoring
- HTTP monitoring
- Free plan: 20 checks
- Email/SMS/Slack alerts

**Setup**:
1. Create account
2. Create new check
3. Configure ping URL
4. Set up cron job on VPS:

```bash
# Add to cron
crontab -e
```

Add:
```
*/5 * * * * curl -fsS --retry 3 https://hc-ping.com/your-uuid > /dev/null
```

## Log Aggregation

### Option 1: Loki + Grafana (Self-Hosted)

**Best for**: Advanced users, full control, comprehensive dashboards

#### Install Loki

```bash
# Create directory
sudo mkdir -p /opt/loki

# Create Loki config
sudo nano /opt/loki/loki-config.yml
```

Add configuration:

```yaml
auth_enabled: false

server:
  http_listen_port: 3100

ingester:
  lifecycler:
    address: 127.0.0.1
    ring:
      kvstore:
        store: inmemory
      replication_factor: 1
  chunk_idle_period: 5m
  chunk_retain_period: 30s

schema_config:
  configs:
    - from: 2020-05-15
      store: boltdb
      object_store: filesystem
      schema: v11
      index:
        prefix: index_
        period: 168h

storage_config:
  boltdb:
    directory: /tmp/loki/index

  filesystem:
    directory: /tmp/loki/chunks

limits_config:
  enforce_metric_name: false
  reject_old_samples: true
  reject_old_samples_max_age: 168h

chunk_store_config:
  max_look_back_period: 0s

table_manager:
  retention_deletes_enabled: false
  retention_period: 0s
```

Run Loki:

```bash
docker run -d \
  --name loki \
  --restart=always \
  -v /opt/loki:/etc/loki \
  -p 3100:3100 \
  grafana/loki:latest \
  -config.file=/etc/loki/loki-config.yml
```

#### Install Promtail (Log Shipper)

```bash
# Create Promtail config
sudo nano /opt/loki/promtail-config.yml
```

Add:

```yaml
server:
  http_listen_port: 9080
  grpc_listen_port: 0

positions:
  filename: /tmp/positions.yaml

clients:
  - url: http://localhost:3100/loki/api/v1/push

scrape_configs:
  - job_name: grooverooster
    docker_sd_configs:
      - host: unix:///var/run/docker.sock
        refresh_interval: 5s
    relabel_configs:
      - source_labels: ['__meta_docker_container_name']
        regex: '/(.*)'
        target_label: 'container'
      - source_labels: ['__meta_docker_container_log_stream']
        target_label: 'stream'
```

Run Promtail:

```bash
docker run -d \
  --name promtail \
  --restart=always \
  -v /opt/loki/promtail-config.yml:/etc/promtail/config.yml \
  -v /var/lib/docker/containers:/var/lib/docker/containers:ro \
  -v /var/run/docker.sock:/var/run/docker.sock \
  grafana/promtail:latest \
  -config.file=/etc/promtail/config.yml
```

#### Install Grafana

```bash
docker run -d \
  --name grafana \
  --restart=always \
  -p 3002:3000 \
  -v grafana-storage:/var/lib/grafana \
  grafana/grafana:latest
```

Configure:
1. Access http://your-vps-ip:3002
2. Login (admin/admin)
3. Add Loki data source
4. Import dashboards

### Option 2: Papertrail (Cloud, Paid)

**Website**: https://www.papertrail.com

**Features**:
- Cloud-based log aggregation
- Real-time log viewing
- Alerts and graphs
- 50MB/month free

**Setup**:

```bash
# Install remote_syslog2
wget https://github.com/papertrail/remote_syslog2/releases/download/v0.21/remote-syslog2_0.21_amd64.deb
sudo dpkg -i remote-syslog2_0.21_amd64.deb

# Configure
sudo nano /etc/log_files.yml
```

Add your Papertrail configuration and log files.

### Option 3: Simple File-Based Logging

For basic setups, centralize logs locally:

```bash
# Create log aggregation script
sudo nano /opt/grooverooster/aggregate-logs.sh
```

Add:

```bash
#!/bin/bash

LOG_DIR="/var/log/grooverooster"
ARCHIVE_DIR="/var/log/grooverooster/archive"
DATE=$(date +%Y%m%d-%H%M%S)

# Create directories
mkdir -p "$LOG_DIR" "$ARCHIVE_DIR"

# Collect Docker logs
docker logs grooverooster-web --tail 1000 > "$LOG_DIR/docker-$DATE.log" 2>&1

# Copy Nginx logs
sudo cp /var/log/nginx/grooverooster_access.log "$LOG_DIR/nginx-access-$DATE.log"
sudo cp /var/log/nginx/grooverooster_error.log "$LOG_DIR/nginx-error-$DATE.log"

# Archive old logs (older than 7 days)
find "$LOG_DIR" -name "*.log" -mtime +7 -exec gzip {} \;
find "$LOG_DIR" -name "*.log.gz" -mtime +7 -exec mv {} "$ARCHIVE_DIR/" \;

# Delete very old archives (older than 30 days)
find "$ARCHIVE_DIR" -name "*.log.gz" -mtime +30 -delete
```

Make executable and schedule:

```bash
chmod +x /opt/grooverooster/aggregate-logs.sh

# Add to cron (daily at 2 AM)
crontab -e
```

Add:
```
0 2 * * * /opt/grooverooster/aggregate-logs.sh
```

## Alerting

### Email Alerts Script

Create an alerting script:

```bash
sudo apt install -y mailutils

# Create alert script
nano /opt/grooverooster/alert.sh
```

Add:

```bash
#!/bin/bash

ALERT_EMAIL="your-email@example.com"
CONTAINER_NAME="grooverooster-web"

# Check if container is running
if ! docker ps | grep -q "$CONTAINER_NAME"; then
    echo "CRITICAL: Container $CONTAINER_NAME is not running!" | \
    mail -s "GrooveRooster Alert: Container Down" "$ALERT_EMAIL"
fi

# Check health endpoint
if ! curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
    echo "CRITICAL: Health check failed for $CONTAINER_NAME!" | \
    mail -s "GrooveRooster Alert: Health Check Failed" "$ALERT_EMAIL"
fi

# Check disk space
DISK_USAGE=$(df -h / | awk 'NR==2 {print $5}' | cut -d'%' -f1)
if [ "$DISK_USAGE" -gt 90 ]; then
    echo "WARNING: Disk usage is at ${DISK_USAGE}%!" | \
    mail -s "GrooveRooster Alert: High Disk Usage" "$ALERT_EMAIL"
fi
```

Schedule:

```bash
chmod +x /opt/grooverooster/alert.sh

# Add to cron (every 5 minutes)
crontab -e
```

Add:
```
*/5 * * * * /opt/grooverooster/alert.sh
```

## Performance Monitoring

### Application Performance

#### Next.js Analytics

Consider integrating:
- Vercel Analytics (if using Vercel)
- Google Analytics
- Sentry for error tracking

#### Custom Performance Logging

Add performance logging to your Next.js app by creating a middleware or API route logging:

```typescript
// Example: Log slow requests
export async function middleware(request: Request) {
  const start = Date.now();
  const response = await next();
  const duration = Date.now() - start;
  
  if (duration > 1000) {
    console.warn(`Slow request: ${request.url} took ${duration}ms`);
  }
  
  return response;
}
```

### Database Performance

Monitor Supabase performance:
- Use Supabase Dashboard for query performance
- Enable slow query logging
- Monitor connection pool usage

### External API Performance

Create an API monitoring script:

```bash
nano /opt/grooverooster/api-monitor.sh
```

Add:

```bash
#!/bin/bash

LOG_FILE="/var/log/grooverooster/api-performance.log"

echo "=== $(date) ===" >> "$LOG_FILE"

# Test application health
HEALTH_TIME=$(curl -o /dev/null -s -w '%{time_total}' http://localhost:3000/api/health)
echo "Health Check: ${HEALTH_TIME}s" >> "$LOG_FILE"

# Test main page load
PAGE_TIME=$(curl -o /dev/null -s -w '%{time_total}' https://www.grooverooster.com)
echo "Page Load: ${PAGE_TIME}s" >> "$LOG_FILE"

echo "" >> "$LOG_FILE"
```

## Dashboard Setup

### Simple Terminal Dashboard

Use `watch` for a simple dashboard:

```bash
# Create dashboard script
nano /opt/grooverooster/dashboard.sh
```

Add:

```bash
#!/bin/bash

clear
echo "======================================"
echo "  GrooveRooster Monitoring Dashboard  "
echo "======================================"
echo ""

echo "=== Container Status ==="
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep grooverooster

echo ""
echo "=== Resource Usage ==="
docker stats grooverooster-web --no-stream --format "CPU: {{.CPUPerc}}\tMemory: {{.MemUsage}}"

echo ""
echo "=== Health Check ==="
curl -s http://localhost:3000/api/health | jq '.'

echo ""
echo "=== Recent Logs ==="
docker logs grooverooster-web --tail 10

echo ""
echo "=== System Resources ==="
echo "Disk Usage: $(df -h / | awk 'NR==2 {print $5}')"
echo "Memory Usage: $(free -h | awk 'NR==2 {print $3 "/" $2}')"
echo "Load Average: $(uptime | awk -F'load average:' '{print $2}')"
```

Run with watch:

```bash
chmod +x /opt/grooverooster/dashboard.sh
watch -n 10 /opt/grooverooster/dashboard.sh
```

## Recommended Monitoring Stack

### For Small to Medium Projects

**Free/Low-Cost Option**:
- UptimeRobot for uptime monitoring
- Docker logs with log rotation
- Simple monitoring scripts (provided above)
- Email alerts

**Total Cost**: Free to $10/month

### For Production/Enterprise

**Comprehensive Option**:
- Uptime Kuma (self-hosted) or Pingdom (paid)
- Loki + Grafana for log aggregation
- Prometheus for metrics
- PagerDuty or Opsgenie for alerting
- Sentry for error tracking

**Total Cost**: $50-200/month depending on scale

## Conclusion

Start with basic monitoring (Docker stats, logs, uptime monitoring) and gradually add more sophisticated solutions as your needs grow. The most important metrics to monitor are:

1. **Uptime**: Is the application accessible?
2. **Performance**: Response times and throughput
3. **Resources**: CPU, memory, disk usage
4. **Errors**: Application and system errors
5. **Security**: Failed login attempts, unusual traffic

Choose monitoring tools based on your budget, technical expertise, and specific requirements.
