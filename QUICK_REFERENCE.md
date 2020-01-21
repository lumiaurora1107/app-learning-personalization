# Quick Reference Guide

## Project Structure at a Glance

```
📦 app-learning-personalization
├── 📂 app/                          # Next.js app directory
│   ├── api/                        # API routes for backend
│   │   ├── cards/generate/         # Generate study cards from topic
│   │   ├── cards/                  # Get cards for a topic
│   │   ├── feedback/submit/        # Submit feedback on cards
│   │   ├── topics/                 # CRUD operations for topics
│   │   └── learning-plan/          # Get adaptive learning plan
│   ├── study/[id]/page.tsx         # Study page for a topic
│   ├── layout.tsx                  # Root layout with Toaster
│   ├── page.tsx                    # Dashboard/Home page
│   └── globals.css                 # Global Tailwind styles
│
├── 📂 components/                   # React components
│   ├── StudyCard.tsx               # Flip card component
│   ├── TopicForm.tsx               # Create topic form
│   ├── TopicItem.tsx               # Topic list item
│   └── LearningPlanPreview.tsx      # Tomorrow's plan preview
│
├── 📂 lib/                          # Utilities and helpers
│   ├── prisma.ts                   # Prisma client singleton
│   ├── api.ts                      # API client functions
│   └── utils.ts                    # Helper functions
│
├── 📂 prisma/                       # Database
│   ├── schema.prisma               # Database models
│   └── migrations/                 # Migration history
│
├── 📂 types/                        # TypeScript types
│   └── index.ts                    # Shared type definitions
│
├── 📂 hooks/                        # Custom React hooks
│   └── useAsync.ts                 # Async operations hook
│
├── 📂 public/                       # Static assets
│
├── README.md                        # Main documentation
├── SETUP.md                         # Setup instructions
├── DEVELOPMENT.md                   # Developer guide
├── .env.example                     # Environment template
├── package.json                     # Dependencies
├── next.config.ts                   # Next.js config
└── tsconfig.json                   # TypeScript config
```

## Data Flow

```
User Input (Topic)
    ↓
Create Topic (POST /api/topics)
    ↓
Generate Cards (POST /api/cards/generate)
    ├─→ Call OpenAI API
    └─→ Save to Database
    ↓
Display Cards (GET /api/cards)
    ↓
User Studies & Gives Feedback
    ├─→ Understood ✅
    ├─→ Needs Review 📝
    └─→ Incorrect ❌
    ↓
Submit Feedback (POST /api/feedback/submit)
    ↓
Get Learning Plan (GET /api/learning-plan)
    ├─→ Analyze feedback patterns
    ├─→ Prioritize cards to review
    └─→ Generate tomorrow's plan
```

## Core Features & Implementation

| Feature | Files | Status |
|---------|-------|--------|
| Create Study Topics | `page.tsx`, `api/topics` | ✅ |
| Generate AI Cards | `api/cards/generate`, OpenAI | ✅ |
| Flip Card Interface | `StudyCard.tsx` | ✅ |
| Feedback System | `api/feedback/submit` | ✅ |
| Adaptive Learning Plan | `api/learning-plan` | ✅ |
| Dashboard | `page.tsx` | ✅ |
| Study Page | `study/[id]/page.tsx` | ✅ |

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, React 19, TypeScript |
| Styling | Tailwind CSS 4 |
| Forms | React Hook Form, Zod |
| UI Components | Sonner (Toasts) |
| Backend | Serverless Vercel Functions |
| Database | PostgreSQL + Prisma ORM |
| AI | OpenAI GPT-4o-mini |
| Build Tool | Next.js |

## Key Files to Know

### Frontend Entry Points
- `app/page.tsx` - Dashboard where users create topics
- `app/study/[id]/page.tsx` - Study cards for a topic

### API Endpoints
- `app/api/topics/route.ts` - Topic CRUD
- `app/api/cards/generate/route.ts` - Generate cards with OpenAI
- `app/api/cards/route.ts` - Get cards for topic
- `app/api/feedback/submit/route.ts` - Save feedback
- `app/api/learning-plan/route.ts` - Generate daily plan

### Components
- `components/StudyCard.tsx` - Main study card with flip
- `components/TopicForm.tsx` - Create new topic
- `components/LearningPlanPreview.tsx` - Tomorrow's preview

### Database
- `prisma/schema.prisma` - Database schema (5 models)

## Environment Variables

```bash
DATABASE_URL              # PostgreSQL connection
OPENAI_API_KEY           # OpenAI API key
NEXTAUTH_URL             # App URL
NEXTAUTH_SECRET          # Session secret
NEXT_PUBLIC_API_URL      # (Optional) API base URL
```

## Getting Started for Developers

### First Time Setup
```bash
npm install                    # Install dependencies
npx prisma migrate dev         # Setup database
npm run dev                    # Start dev server
# Open http://localhost:3000
```

### Common Commands
```bash
npm run dev              # Development server
npm run build            # Production build
npm run start           # Start production server
npx prisma studio      # View/edit database
npx prisma generate    # Regenerate Prisma client
npm run lint           # Check for linting errors
```

### Testing the App

1. **Create a topic**
   - Enter "React Hooks" or any topic
   - Click "Generate Study Cards"
   - Wait for AI to generate cards

2. **Study the cards**
   - Click cards to flip between Q&A
   - Review the explanation
   - Give feedback (understood/review/incorrect)

3. **Check learning plan**
   - System generates tomorrow's plan based on feedback
   - Shows cards that need more practice
   - Shows focus areas

## Performance Tips

### Frontend
- Components are optimized with proper state management
- API calls are batched intelligently
- Images lazy-loaded automatically

### Backend
- Database queries are minimal (only fetch what's needed)
- Prisma relationships are optimized
- API responses are cached by Next.js

### Database
- Proper indexes on frequently queried fields
- Foreign keys with cascading deletes
- Unique constraints where needed

## Debugging Checklist

- ✅ Database connected? → Check `.env.local` DATABASE_URL
- ✅ OpenAI key valid? → Test in `https://platform.openai.com/api-keys`
- ✅ API responding? → Check network tab in DevTools
- ✅ Cards generating? → Check OpenAI API usage/limits
- ✅ Feedback saving? → Check `npx prisma studio`

## Common Issues & Solutions

### "Cannot find module 'prisma'"
```bash
npx prisma generate
npm install
```

### "Database connection failed"
- Check DATABASE_URL is correct
- Ensure PostgreSQL is running
- Try connecting manually: `psql <url>`

### "OpenAI API Error"
- Verify API key is correct
- Check API usage/quota
- Ensure key has proper permissions

### Port 3000 in use
```bash
npm run dev -- -p 3001
```

## Roadmap

- ✅ Core MVP features
- 🔄 User authentication
- 🔄 Spaced repetition algorithm
- 🔄 Analytics dashboard
- 🔄 Mobile app
- 🔄 Collaborative learning

## Quick Links

- [API Documentation](./README.md#api-endpoints)
- [Setup Guide](./SETUP.md)
- [Development Guide](./DEVELOPMENT.md)
- [Database Schema](./prisma/schema.prisma)

---

**Questions?** Check the main README or DEVELOPMENT.md files!
