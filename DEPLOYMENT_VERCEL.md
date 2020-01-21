# Deployment Guide - Vercel

This guide explains how to deploy the Personalized Learning Platform to Vercel.

## Prerequisites

- GitHub account with repository push access
- Vercel account (free at https://vercel.com)
- PostgreSQL database configured
- OpenAI API key

## Step 1: Prepare Your Repository

1. **Initialize Git (if not already done)**
```bash
git init
git add .
git commit -m "Initial commit: Personalized Learning Platform"
```

2. **Create repository on GitHub**
   - Go to https://github.com/new
   - Create new repository
   - Follow GitHub's instructions to push your code

```bash
git remote add origin https://github.com/YOUR_USERNAME/app-learning-personalization.git
git branch -M main
git push -u origin main
```

## Step 2: Set Up Database

### Option A: Vercel Postgres (Recommended)

1. **Create Vercel Project first** (skip if you already have)

2. **Add Postgres to project**
   - Go to Vercel Dashboard → Your Project
   - Click "Storage" tab
   - Click "Create Database" → Postgres
   - Accept terms and click "Continue"

3. **Copy connection string**
   - The connection string will be automatically added to `.env.local`
   - It will also be in the project settings

### Option B: External Database (Railway, Neon, etc.)

1. **Create database on your provider**
2. **Copy connection string**
3. **Add to Vercel environment variables** (see Step 3)

## Step 3: Deploy to Vercel

### Method A: GitHub Integration (Recommended)

1. **Go to Vercel Dashboard**
   - Click "New Project"
   - Click "Import Git Repository"
   - Select your GitHub repository

2. **Configure Project**
   - Framework Preset: `Next.js`
   - Root Directory: `.` (leave as default)
   - Build Command: `npm run build` (default)

3. **Add Environment Variables**
   - Click "Environment Variables"
   - Add the following variables:
   
   ```
   DATABASE_URL          → Your PostgreSQL connection string
   OPENAI_API_KEY        → Your OpenAI API key
   NEXTAUTH_URL          → https://your-domain.com
   NEXTAUTH_SECRET       → Generate: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete (~3-5 minutes)

### Method B: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# For production
vercel --prod
```

## Step 4: Run Database Migrations

After deployment, you need to run Prisma migrations on your production database.

### Option A: Using Vercel Dashboard

1. In Vercel project → Settings → Environment variables
2. Copy the full DATABASE_URL value
3. Run locally:
```bash
RUNNING_IN_PRODUCTION=true npx prisma migrate deploy
```

### Option B: Using Vercel CLI

```bash
vercel env pull  # Pull environment variables
npx prisma migrate deploy
```

## Post-Deployment

### 1. Verify Deployment

- Visit your Vercel deployment URL
- Test creating a topic
- Test generating study cards
- Verify feedback system works

### 2. Update DNS (if using custom domain)

1. Go to Vercel → Project Settings → Domains
2. Add your custom domain
3. Follow Vercel's DNS configuration instructions

### 3. Monitor Deployment

- Check deployment logs: Vercel Dashboard → Deployments
- Monitor errors: Vercel Dashboard → Functions
- Check API calls: Vercel Dashboard → Usage

## Environment Variables Reference

| Variable | Value | Required |
|----------|-------|----------|
| `DATABASE_URL` | PostgreSQL connection string | ✅ |
| `OPENAI_API_KEY` | Your OpenAI API key | ✅ |
| `NEXTAUTH_URL` | Your domain URL | ✅ |
| `NEXTAUTH_SECRET` | Random secret (32+ chars) | ✅ |
| `NEXT_PUBLIC_API_URL` | API base URL (optional) | ❌ |

## Troubleshooting

### Deployment Failed

1. **Check build logs**
   - Vercel Dashboard → Deployments → Failed deployment
   - Look for error messages

2. **Common issues**
   - Missing environment variables
   - TypeScript errors
   - Missing dependencies

### Database Connection Error

```bash
# Verify connection string
vercel env pull
echo $DATABASE_URL  # On Windows: $env:DATABASE_URL

# Test connection
psql $DATABASE_URL -c "SELECT 1"
```

### "Prisma client not found"

```bash
# Regenerate Prisma client in Vercel build
# Add to package.json scripts:
"postinstall": "prisma generate"
```

Then redeploy.

### OpenAI API Not Working

1. Check API key is correct
2. Verify key has sufficient credits
3. Check rate limits haven't been exceeded
4. Test key locally: `echo $OPENAI_API_KEY`

## Performance Optimization

### Database
- Vercel Postgres auto-scales
- Check query performance: `EXPLAIN ANALYZE` in database

### API
- Responses are cached by default
- Use Vercel Analytics to monitor

### Frontend
- Automatic image optimization
- Static pages pre-rendered

## Monitoring & Maintenance

### Regular Tasks

- Check Vercel Dashboard weekly
- Monitor OpenAI usage
- Review database size
- Check error logs

### Scaling

Vercel automatically scales, but:
- Monitor database connections
- Check rate limits for OpenAI
- Consider caching strategies

## Rolling Back

```bash
# Via Vercel Dashboard
# Deployments → Click deployment → Promote to Production

# Or via CLI
vercel rollback
```

## Custom Domain

1. **Add domain in Vercel**
   - Settings → Domains
   - Add your domain
   - Follow DNS setup

2. **Update NEXTAUTH_URL**
   - Environment variables
   - Change to your custom domain
   - Redeploy

## SSL Certificate

Vercel automatically provides SSL for:
- `*.vercel.app` domains
- Custom domains (auto-configured)

No action needed!

## Backup & Recovery

### Database Backups

For Vercel Postgres:
- Automatic daily backups
- Access in Vercel Dashboard
- Can select backup point for restore

For external databases:
- Configure backups with your provider
- Test restore procedures

### Code Backups

- GitHub is your backup
- Vercel stores all deployments
- Can rollback to any previous deployment

## Cost Estimation

### Vercel (Free tier includes)
- Unlimited deployments
- 1 Postgres database (500 MB)
- 100 GB bandwidth

### Costs may apply for
1. **Database** (>500 MB storage)
   - ~$0.25/MB/month

2. **OpenAI API**
   - ~$0.15 per 1M input tokens
   - ~$0.60 per 1M output tokens

3. **Bandwidth** (>100 GB/month)
   - ~$0.50 per GB

**Estimate**: Small project = $5-20/month

## Getting Help

- [Vercel Docs](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Prisma Deployment](https://www.prisma.io/docs/guides/deployment)
- Vercel Support Dashboard

---

**Deployed successfully?** 🎉 Connect with your team and start using the platform!
