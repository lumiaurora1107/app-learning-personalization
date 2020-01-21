# Development Guide

## Architecture Overview

### Frontend (Next.js)
- **Pages**: Located in `app/` directory
- **Components**: Reusable React components in `components/`
- **Client-side**: Uses React hooks and state management

### Backend (Serverless API)
- **API Routes**: Located in `app/api/` directory
- **Database**: Prisma ORM with PostgreSQL
- **External Services**: OpenAI API for content generation

### Database Layer
- **ORM**: Prisma with PostgreSQL
- **Models**: User, Topic, StudyCard, Feedback, LearningPlan
- **Migrations**: Managed through Prisma migrations

## Development Workflow

### 1. Adding a New Feature

#### Example: Add ability to export cards

1. **Update Database Schema** (`prisma/schema.prisma`)
```prisma
model StudyCardExport {
  id String @id @default(cuid())
  cardsId String[]
  format String // "pdf" or "csv"
  // ... other fields
}
```

2. **Create Migration**
```bash
npx prisma migrate dev --name add_exports
```

3. **Create API Endpoint** (`app/api/cards/export/route.ts`)
```typescript
export async function POST(request: NextRequest) {
  // Implementation
}
```

4. **Create Frontend Component** (`components/ExportButton.tsx`)
```typescript
export function ExportButton({ cardIds }: Props) {
  // Implementation
}
```

5. **Update Page/Component** to use the new component

### 2. Database Changes

```bash
# Create migration
npx prisma migrate dev --name description_of_change

# Revert migration (development only)
npx prisma migrate resolve --rolled-back <migration_name>

# View database
npx prisma studio
```

### 3. Testing Locally

```bash
# Development server
npm run dev

# Run linter
npm run lint

# Check for TypeScript errors
npx tsc --noEmit
```

## Common Tasks

### Add a new API endpoint

1. Create file: `app/api/[resource]/[action]/route.ts`
2. Implement handlers: `POST`, `GET`, `PUT`, `DELETE`
3. Add to `lib/api.ts` for client-side usage
4. Update components to use new endpoint

### Add a new page

1. Create directory: `app/[pageName]`
2. Create file: `app/[pageName]/page.tsx`
3. Make it client component with `"use client"`
4. Import components and add navigation

### Add a new component

1. Create file: `components/ComponentName.tsx`
2. Export component as default or named export
3. Use TypeScript interfaces for props
4. Add to pages as needed

## Code Style & Standards

### TypeScript
- Always use types for props: `interface ComponentProps { ... }`
- Avoid `any` type
- Use `const` for variables

### React Components
```typescript
interface Props {
  title: string;
  onClick?: () => void;
}

export function ComponentName({ title, onClick }: Props) {
  return <div>{title}</div>;
}
```

### API Routes
```typescript
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    // Validation
    // Processing
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ error: "message" }, { status: 500 });
  }
}
```

## Debugging

### Frontend
- Use browser DevTools
- Console logs: `console.log()`, `console.error()`
- React DevTools browser extension

### Backend
- Check server logs in terminal
- Use Prisma Studio: `npx prisma studio`
- Add debug logs in API routes

### Database
```bash
# Access database directly
psql <DATABASE_URL>

# Common queries
SELECT * FROM "StudyCard";
SELECT * FROM "Feedback";
```

## Performance Optimization

### Frontend
- Use `React.memo()` for expensive components
- Lazy load components: `React.lazy()`
- Optimize images with `next/image`

### Backend
- Use database indexes for frequently queried fields
- Implement caching where appropriate
- Batch operations when possible

### Database
- Check query performance: `EXPLAIN ANALYZE`
- Add indexes for foreign keys and search fields

## Deployment Checklist

- [ ] All environment variables set
- [ ] Database migrations run: `npx prisma migrate deploy`
- [ ] Build successfully: `npm run build`
- [ ] No TypeScript errors
- [ ] API keys secured and rotated
- [ ] Tests passing (if applicable)
- [ ] Performance optimized
- [ ] Security review completed

## Useful Commands

```bash
# Development
npm run dev              # Start dev server

# Database
npx prisma studio      # View database GUI
npx prisma generate    # Generate Prisma client
npx prisma migrate dev # Create migration

# Build & Deploy
npm run build           # Build for production
npm run start          # Start production server

# Linting
npm run lint           # Run ESLint
npm run lint --fix     # Fix linting issues

# Type Checking
npx tsc --noEmit      # Check for TS errors
```

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [React Docs](https://react.dev)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [OpenAI API Docs](https://platform.openai.com/docs)

## Getting Help

1. Check the main README.md
2. Review similar components/endpoints
3. Check Prisma Studio for data issues
4. Review browser console for frontend errors
5. Check terminal for API errors
