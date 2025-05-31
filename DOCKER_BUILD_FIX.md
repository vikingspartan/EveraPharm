# Docker Build Fix Summary

## Issues Fixed

### 1. API Docker Build - Prisma Client Generation
The Docker build was failing because the Prisma client wasn't being generated in the expected location within the monorepo structure.

**Solution:**
- Updated API Dockerfile to copy Prisma schema files before installing dependencies
- Generate Prisma client in both build and production stages
- Use `cd` instead of `WORKDIR` for temporary directory changes
- Added proper file ownership for the non-root user

### 2. API Import Issues
- Changed `bcrypt` to `bcryptjs` in seed.prod.ts (matching package.json)

### 3. Web App Build - Prisma Client Imports
The web app was importing enums directly from `@prisma/client`, which shouldn't be available in the frontend.

**Solution:**
- Created `apps/web/lib/types.ts` with local enum definitions
- Updated all imports from `@prisma/client` to use the local types file
- Fixed PaymentStatus enum value (COMPLETED → PAID)

### 4. Updated Deployment Script
- Added Prisma client generation step before running migrations

## Files Modified

### API Changes:
- `apps/api/Dockerfile` - Fixed Prisma generation
- `packages/database/prisma/seed.prod.ts` - Fixed bcrypt import
- `scripts/deploy.sh` - Added Prisma generation step

### Web App Changes:
- `apps/web/lib/types.ts` - Created local enum definitions
- `apps/web/app/admin/orders/page.tsx` - Updated imports
- `apps/web/app/orders/[id]/page.tsx` - Updated imports, fixed PaymentStatus
- `apps/web/app/orders/page.tsx` - Updated imports
- `apps/web/app/checkout/page.tsx` - Updated imports
- `apps/web/components/checkout/PaymentForm.tsx` - Updated imports
- `apps/web/Dockerfile` - Minor improvements

## Quick Deployment Commands

On your production server:

```bash
# 1. Pull the latest changes
cd /opt/everapharm
git pull origin main

# 2. Set up environment variables
cp env.production.example .env.production
# Edit .env.production with your actual values

# 3. Generate secure passwords
./scripts/generate-secrets.sh

# 4. Build and deploy
./scripts/deploy.sh
```

## Troubleshooting

If you still encounter issues:

1. **Clear Docker cache**:
   ```bash
   docker system prune -a
   ```

2. **Build with no cache**:
   ```bash
   docker-compose build --no-cache
   ```

3. **Check logs**:
   ```bash
   docker-compose logs api
   docker-compose logs web
   ```

4. **Manual Prisma generation**:
   ```bash
   docker-compose run --rm api sh -c "cd packages/database && npx prisma generate"
   ```

## Testing Locally

Before deploying to production, test the build locally:

```bash
./scripts/test-docker-build.sh
```

This will build the images with test environment variables to ensure everything works correctly. 