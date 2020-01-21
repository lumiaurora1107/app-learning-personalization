# Troubleshooting Guide

## Common Issues & Solutions

### Installation & Setup

#### Issue: `npm install` fails with dependency conflicts
```bash
# Solution 1: Use npm cache clean
npm cache clean --force
npm install

# Solution 2: Use newer npm version
npm install -g npm@latest
npm install

# Solution 3: Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Issue: `prisma generate` fails
```bash
# Solution
npx prisma generate
npm install @prisma/client@latest
```

#### Issue: `.env.local` file not found
```bash
# Solution
cp .env.example .env.local
# Then edit .env.local with your actual values
```

### Database Issues

#### Issue: "Cannot connect to database"
```bash
# Check connection string format
# Correct: postgresql://user:password@host:5432/database

# Test connection
psql postgresql://user:password@host:5432/database -c "SELECT 1"

# If psql not found, install PostgreSQL client
```

#### Issue: "Migration failed"
```bash
# Reset database (CAUTION: deletes all data)
npx prisma migrate reset

# Or manually:
npx prisma migrate deploy
npx prisma generate
```

#### Issue: "No database provider specified"
- Check DATABASE_URL in `.env.local`
- Ensure it's a PostgreSQL connection
- Format: `postgresql://user:password@host:port/db`

#### Issue: "Unique constraint violated"
- Topic already exists for that user
- Create a new topic with different name
- Or delete old topic first

### Development Server Issues

#### Issue: "Port 3000 already in use"
```bash
# Solution 1: Use different port
npm run dev -- -p 3001

# Solution 2: Kill process on port 3000
# On Windows:
netstat -a -n -o | find "3000"
taskkill /pid <PID> /f

# On Mac/Linux:
lsof -ti:3000 | xargs kill -9
```

#### Issue: "Cannot find module" errors
```bash
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules .next
npm install
```

#### Issue: TypeScript errors but code looks correct
```bash
# Regenerate types
npx prisma generate

# Check tsconfig.json is valid
npx tsc --noEmit
```

### API & Backend Issues

#### Issue: API returns 500 error
1. Check server logs in terminal for detailed error
2. Verify environment variables are set
3. Check database connection
4. Verify OpenAI API key is valid

#### Issue: "OpenAI API error: 401 Unauthorized"
```bash
# Check API key
echo $OPENAI_API_KEY  # Should print your key

# Solution
1. Verify key in dashboard: https://platform.openai.com/api-keys
2. Ensure it has not expired or been revoked
3. Check you have API credits
4. Update .env.local with correct key
5. Restart dev server
```

#### Issue: "OpenAI API error: 429 Rate limit exceeded"
```bash
# Meaning: Too many requests too quickly

# Solutions
1. Wait a few minutes before trying again
2. Upgrade OpenAI plan for higher limits
3. Implement rate limiting in your code
4. Check https://status.openai.com for service status
```

#### Issue: "OpenAI API error: 503 Service unavailable"
- OpenAI service is down
- Check https://status.openai.com
- Wait and try again later

#### Issue: Study cards not generating
1. Check OpenAI API key in `.env.local`
2. Verify API is responding (check status.openai.com)
3. Check browser console for error messages
4. Try creating a simple topic first

### Frontend Issues

#### Issue: Page shows "Loading..." forever
1. Check browser console for errors (F12)
2. Check if API is responding
3. Verify database connection
4. Check localStorage - try clearing it:
```javascript
// In browser console
localStorage.clear()
location.reload()
```

#### Issue: Study cards not showing
1. Verify cards were generated (check Prisma Studio)
2. Check userId in localStorage
3. Try generating more cards
4. Check API response in Network tab

#### Issue: Feedback button not working
1. Check browser console for errors
2. Verify database connection
3. Check if card exists in database
4. Try refreshing page

#### Issue: Styling looks broken (no Tailwind)
```bash
# Rebuild CSS
npm run dev

# If still broken:
rm -rf .next
npm run dev
```

### Deployment Issues

#### Issue: Deployment fails on Vercel
1. Check build logs in Vercel dashboard
2. Verify all environment variables are set
3. Run locally first: `npm run build`
4. Ensure all dependencies are in package.json (not just package-lock.json)

#### Issue: Database not working on Vercel
```bash
# Verify environment variable is set
vercel env pull

# Run migrations
npx prisma migrate deploy

# See migration status
npx prisma migrate status
```

#### Issue: "Next.js build fails"
```bash
# Check locally first
npm run build

# Common fixes
1. Clear cache: rm -rf .next
2. Check for TypeScript errors
3. Ensure all imports are correct
4. Check environment variables
```

## Debugging Techniques

### Option 1: Browser DevTools

```
1. Press F12 to open DevTools
2. Check Console tab for errors
3. Check Network tab to see API calls
4. Check localStorage: Application → Local Storage
```

### Option 2: Server Logs

```bash
# Logs appear in the terminal running "npm run dev"
# Look for errors or unusual behavior
# Add console.log to API routes for debugging
```

### Option 3: Database Inspection

```bash
# View all data
npx prisma studio

# Then browse tables to verify data is being saved
```

### Option 4: API Testing

```bash
# Test API with curl
curl http://localhost:3000/api/topics?userId=test_user

# Test with created data
curl -X POST http://localhost:3000/api/topics \
  -H "Content-Type: application/json" \
  -d '{"userId":"test","title":"Test Topic"}'
```

## Debugging Steps Template

### When something breaks:

1. **Where does it break?**
   - Frontend (UI)? Check browser console
   - Backend (API)? Check server logs
   - Database? Check Prisma Studio

2. **What error message?**
   - Read the full error message carefully
   - Search error in project documentation
   - Search on Stack Overflow or GitHub

3. **Recent changes?**
   - Did it work before? What changed?
   - Try reversing the change
   - Check git diff

4. **Minimal reproduction?**
   - Can you replicate the issue consistently?
   - Does it happen on fresh reload?
   - Does it happen in different browser?

5. **Environment check?**
   - Are all env variables set?
   - Is database running?
   - Is dev server running?

## Performance Debugging

### Slow API responses

```bash
# Add timing to API routes
import { performance } from "perf_hooks";

const start = performance.now();
// ... your code
const time = performance.now() - start;
console.log(`API took ${time}ms`);
```

### Slow page load

```
1. Open DevTools → Performance tab
2. Click record and reload page
3. Stop recording and analyze timeline
4. Look for long tasks or expensive renders
```

### Database slow queries

```sql
-- In PostgreSQL
EXPLAIN ANALYZE SELECT * FROM "StudyCard" WHERE "userId" = 'xxx';

-- If Seq Scan (slow), add index:
CREATE INDEX idx_studycard_userid ON "StudyCard"("userId");
```

## Getting More Help

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Tailwind Docs](https://tailwindcss.com/docs)
- [OpenAI Docs](https://platform.openai.com/docs)

### Resources
- Search GitHub issues: https://github.com/search
- Stack Overflow: https://stackoverflow.com/questions/tagged/nextjs
- Discord communities for respective tools

### Collecting Debug Info

When asking for help, provide:
1. Full error message (with stack trace)
2. Steps to reproduce
3. `.env.example` (NOT `.env.local`!)
4. Relevant code snippet
5. OS and Node version: `node --version`

## Quick Fixes (Try These First!)

```bash
# 1. Clear cache
npm cache clean --force

# 2. Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# 3. Regenerate Prisma
npx prisma generate

# 4. Reset Next.js cache
rm -rf .next

# 5. Restart dev server
npm run dev

# Still broken? 
# 6. Reset database (⚠️ loses data)
npx prisma migrate reset
```

---

**Still stuck?** 
1. Check the main README
2. Review DEVELOPMENT.md
3. Search existing issues
4. Create detailed bug report
