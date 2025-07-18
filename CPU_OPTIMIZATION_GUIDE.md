# CPU Optimization Guide for EveraPharma

## Problem: High CPU Usage with Zero Users

This guide addresses the periodic CPU spikes reaching 100% even when no users are active on the platform.

## Root Causes Identified

### 1. **Frequent Health Checks** ⚡
- **Problem**: Health checks running every 10-30 seconds create constant CPU load
- **Solution**: Optimized intervals to 60s (PostgreSQL) and 120s (API)
- **Impact**: ~80% reduction in health check overhead

### 2. **Verbose Database Logging** 📝
- **Problem**: Prisma logging every query (`['query', 'info', 'warn', 'error']`)
- **Solution**: Production logging reduced to `['warn', 'error']` only
- **Impact**: Significant reduction in I/O and CPU from log processing

### 3. **Rate Limiting Memory Operations** 🔒
- **Problem**: Express rate limiter cleanup operations every 15 minutes
- **Solution**: Already optimized, but consider Redis for high-traffic scenarios
- **Impact**: Minimal, but worth monitoring

### 4. **Container Resource Competition** 🏗️
- **Problem**: No CPU limits causing resource competition
- **Solution**: Added resource limits per container
- **Impact**: Prevents CPU hogging by any single service

## Applied Optimizations

### Health Check Intervals
```yaml
# Before (High CPU)
healthcheck:
  interval: 10s    # PostgreSQL
  interval: 30s    # API

# After (Optimized)
healthcheck:
  interval: 60s    # PostgreSQL
  interval: 120s   # API
```

### Prisma Logging
```typescript
// Before (High CPU)
log: ['query', 'info', 'warn', 'error']

// After (Optimized)
log: process.env.NODE_ENV === 'production' 
  ? ['warn', 'error']           // Production: minimal logging
  : ['query', 'info', 'warn', 'error'] // Development: full logging
```

### Resource Limits
```yaml
deploy:
  resources:
    limits:
      cpus: '1.0'      # API limit
      memory: 512M
    reservations:
      memory: 256M
```

## Deployment Instructions

### 1. Apply Optimizations
```bash
# On your production server
cd /opt/everapharm
git pull origin main

# Rebuild with optimizations
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### 2. Monitor CPU Usage
```bash
# Use the new monitoring script
./scripts/monitor-cpu.sh

# Watch real-time CPU usage
docker stats

# Check system load
htop  # or top
```

### 3. Verify Health Checks
```bash
# Check health check logs (should be less frequent now)
docker-compose logs api | grep health

# Verify containers are healthy
docker-compose ps
```

## Monitoring Commands

### Real-time Monitoring
```bash
# Container CPU usage
docker stats everapharm-api everapharm-web everapharm-db

# System CPU load
cat /proc/loadavg

# Process tree
ps aux --sort=-%cpu | head -10
```

### Health Check Monitoring
```bash
# API health check frequency
docker-compose logs api --since 10m | grep "GET /api/health" | wc -l

# PostgreSQL health checks
docker-compose logs postgres --since 10m | grep "pg_isready" | wc -l
```

### Database Connection Monitoring
```bash
# Active connections
docker-compose exec postgres psql -U everapharm_user -d everapharm_prod -c "
  SELECT count(*) as active_connections, state 
  FROM pg_stat_activity 
  GROUP BY state;
"
```

## Expected Results

After applying these optimizations, you should see:

1. **Reduced CPU Spikes**: From 100% spikes to <20% baseline
2. **Lower Health Check Frequency**: 6x reduction in health check operations
3. **Minimal Database Logging**: Significant reduction in log I/O
4. **Stable Memory Usage**: Resource limits prevent memory leaks

## Additional Optimizations (If Needed)

### 1. Disable Health Checks Entirely (Temporary)
```yaml
# In docker-compose.yml - remove healthcheck blocks entirely
# Use external monitoring instead (UptimeRobot, etc.)
```

### 2. Switch to Redis Rate Limiting
```typescript
// For high-traffic scenarios
import { ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerStorageRedisService } from 'nestjs-throttler-storage-redis';
```

### 3. Database Connection Pooling
```typescript
// Optimize Prisma connection pool
constructor() {
  super({
    log: ['warn', 'error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL + '?connection_limit=5&pool_timeout=20'
      }
    }
  });
}
```

### 4. Node.js Performance Tuning
```bash
# Add to Dockerfile CMD
NODE_OPTIONS="--max-old-space-size=256 --gc-interval=100"
```

## Troubleshooting

### If CPU is Still High:

1. **Check for Memory Leaks**:
   ```bash
   docker stats --format "table {{.Container}}\t{{.MemUsage}}\t{{.CPUPerc}}"
   ```

2. **Identify Specific Process**:
   ```bash
   docker exec -it everapharm-api top
   ```

3. **Check for Infinite Loops**:
   ```bash
   docker-compose logs api --follow | grep -E "error|warn|timeout"
   ```

4. **Database Query Performance**:
   ```sql
   -- Enable slow query logging
   SELECT query, calls, total_time, mean_time 
   FROM pg_stat_statements 
   ORDER BY total_time DESC 
   LIMIT 10;
   ```

## Monitoring Alerts

Set up monitoring for:
- CPU usage > 50% for 5 minutes
- Memory usage > 80%
- Health check failures
- Database connection count > 20

## Emergency CPU Fix

If CPU is critically high:
```bash
# Quick fix: disable health checks temporarily
docker-compose down
# Edit docker-compose.yml to comment out healthcheck blocks
docker-compose up -d

# Monitor without health checks
watch docker stats
```

## Contact

For persistent CPU issues:
1. Run `./scripts/monitor-cpu.sh` and share output
2. Check logs: `docker-compose logs api --tail=100`
3. Monitor for 10 minutes: `docker stats --format "table {{.Container}}\t{{.CPUPerc}}" > cpu_usage.log` 