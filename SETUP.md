# Setup Instructions

This guide will help you set up the Personalized Learning Platform locally.

## Quick Start (5 minutes)

### 1. Prerequisites
- Node.js 18+
- PostgreSQL (local) or cloud database account
- OpenAI API key (get one at https://platform.openai.com/api-keys)

### 2. Environment Setup

Create `.env.local`:

```bash
# PostgreSQL Connection
DATABASE_URL="postgresql://postgres:password@localhost:5432/study_cards_db"

# OpenAI
OPENAI_API_KEY="sk-your-api-key-here"

# Auth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="$(openssl rand -base64 32)"
```

### 3. Install & Run

```bash
# Install dependencies
npm install

# Setup database
npx prisma migrate dev --name init

# Start development server
npm run dev
```

Open http://localhost:3000 🎉

## Database Setup Options

### Option A: Local PostgreSQL

1. Install PostgreSQL
2. Create database:
```sql
CREATE DATABASE study_cards_db;
```
3. Update `DATABASE_URL` in `.env.local`

### Option B: Docker (Recommended)

```bash
# Run PostgreSQL in Docker
docker run --name study-postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=study_cards_db \
  -p 5432:5432 \
  -d postgres:15

# Update DATABASE_URL
# DATABASE_URL="postgresql://postgres:password@localhost:5432/study_cards_db"
```

### Option C: Cloud Database

#### Vercel Postgres
```bash
# In Vercel dashboard or CLI
vercel postgres create

# Use provided connection string
```

#### Railway
- Create new project
- Add PostgreSQL database
- Copy connection string

#### Neon
- Sign up at https://neon.tech
- Create new project
- Copy connection string

### Option D: Supabase
- Go to https://supabase.com
- Create new project
- Use PostgreSQL connection string

## Running Migrations

```bash
# Create initial schema
npx prisma migrate dev --name init

# View database with Prisma Studio
npx prisma studio
```

## Getting Your API Keys

### OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Create new secret key
3. Copy and paste into `.env.local`

Note: Store securely, never commit to repo!

## Testing the Setup

```bash
# Run the app
npm run dev

# Test in browser: http://localhost:3000

# Try:
# 1. Enter a topic (e.g., "Biology Photosynthesis")
# 2. Click "Generate Study Cards"
# 3. Review the generated cards
# 4. Provide feedback
```

## Troubleshooting

### "Cannot connect to database"
- Check DATABASE_URL is correct
- Ensure PostgreSQL is running
- Try `psql -U postgres -h localhost` to test connection

### "OpenAI API Error"
- Verify API key is correct
- Check you have API credits
- Ensure key has proper permissions

### "Prisma client not found"
```bash
npx prisma generate
```

### Port 3000 already in use
```bash
npm run dev -- -p 3001
```

## Next Steps

1. ✅ Setup complete
2. 📚 Create your first topic
3. 🎯 Generate study cards
4. 💡 Review and provide feedback
5. 📊 Watch your learning plan adapt

## Production Deployment

See main README.md for Vercel deployment instructions.

Need help? Create an issue on GitHub!
