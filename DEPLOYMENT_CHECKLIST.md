# EveraPharma Deployment Checklist

Use this checklist before deploying to production.

## Pre-Deployment Checks

### Code Quality
- [ ] All tests pass (`npm run test`)
- [ ] No TypeScript errors (`npm run check-types`)
- [ ] No linting errors (`npm run lint`)
- [ ] Code has been reviewed
- [ ] Sensitive data is not hardcoded

### Database
- [ ] All migrations are up to date
- [ ] Migration scripts have been tested
- [ ] Database backup exists
- [ ] Seed data is appropriate for production

### Environment Variables
- [ ] Production .env files are created
- [ ] All required variables are set
- [ ] Secrets are secure (use `./scripts/generate-secrets.sh`)
- [ ] API URLs are correct
- [ ] CORS origins include production domains

### Docker
- [ ] Images build successfully
- [ ] Containers run without errors
- [ ] Health checks pass
- [ ] Resource limits are appropriate

### Security
- [ ] Admin password will be changed after deployment
- [ ] JWT secret is unique and secure
- [ ] Database password is strong
- [ ] SSL certificates are ready
- [ ] Firewall rules are configured

### Infrastructure
- [ ] DigitalOcean droplet is provisioned
- [ ] Server has adequate resources
- [ ] Backups are enabled
- [ ] Monitoring is configured
- [ ] DNS records are configured

### Testing
- [ ] Local Docker deployment works
- [ ] API endpoints respond correctly
- [ ] Frontend loads without errors
- [ ] Authentication flow works
- [ ] Admin panel is accessible

## Deployment Steps

1. **Final Code Check**
   ```bash
   npm run lint
   npm run check-types
   npm run build:prod
   ```

2. **Test Docker Build Locally**
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.dev.yml build
   docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
   ```

3. **Push to Repository**
   ```bash
   git add .
   git commit -m "Deploy: your deployment message"
   git push origin main
   ```

4. **Deploy to Server**
   - GitHub Actions will automatically deploy
   - Or manually: `ssh user@server 'cd /opt/everapharm && ./scripts/deploy.sh'`

5. **Post-Deployment Verification**
   - [ ] Check health endpoint: `curl https://api.everapharm.com/api/health`
   - [ ] Load website: https://everapharm.com
   - [ ] Test login functionality
   - [ ] Verify admin panel access
   - [ ] Check logs for errors

## Rollback Plan

If deployment fails:

1. **Immediate Rollback**
   ```bash
   cd /opt/everapharm
   git checkout HEAD~1
   ./scripts/deploy.sh
   ```

2. **Database Rollback**
   ```bash
   # Restore from backup
   docker-compose exec -T postgres psql -U everapharm_user everapharm_prod < /opt/everapharm/backups/latest_backup.sql
   ```

3. **Emergency Contacts**
   - DevOps Lead: ___________
   - Database Admin: ___________
   - On-call Engineer: ___________

## Post-Deployment Tasks

- [ ] Change admin password
- [ ] Test all critical user flows
- [ ] Monitor error logs for 24 hours
- [ ] Update status page
- [ ] Notify team of successful deployment
- [ ] Document any issues encountered

## Notes

_Add deployment-specific notes here:_

- Date: ___________
- Deployed by: ___________
- Version: ___________
- Issues encountered: ___________
- Resolution: ___________ 