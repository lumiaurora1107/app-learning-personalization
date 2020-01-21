# Personalized Learning Platform 📚

An AI-powered adaptive learning platform that generates study cards based on user input and adjusts the daily learning plan based on feedback.

## Features ✨

- **AI-Generated Study Cards**: Automatically generate study cards for any topic using OpenAI
- **Flip Card Interface**: Interactive card design with question/answer reveal
- **Smart Feedback System**: Track performance with status (understood, needs review, incorrect)
- **Adaptive Learning Plans**: Daily study plans generated based on performance and areas needing improvement
- **Progress Tracking**: Monitor your learning journey with card progress

## Tech Stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS 4
- **Backend**: Serverless API routes (Vercel Functions)
- **Database**: PostgreSQL with Prisma ORM
- **AI**: OpenAI GPT-4 for content generation
- **UI Components**: Sonner for notifications

## Prerequisites

- Node.js 18+ 
- PostgreSQL database (local or cloud like Vercel Postgres, Railway, Neon)
- OpenAI API key

## Installation

1. **Clone the repository**
```bash
cd app-learning-personalization
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
Create `.env.local` file:
```bash
# Database Configuration
DATABASE_URL="postgresql://user:password@localhost:5432/study_cards_db"

# OpenAI API
OPENAI_API_KEY="your-openai-api-key"

# App Configuration  
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-a-random-secret"
```

4. **Set up the database**
```bash
# Create database tables
npx prisma migrate dev --name init

# Generate Prisma client
npx prisma generate
```

5. **Run the development server**
```bash
npm run dev
```

Visit http://localhost:3000 in your browser.

## How to Use

### 1. Create a Topic
- Enter a topic you want to study (e.g., "React Hooks", "Spanish Verbs")
- Optionally add a description with specific areas to focus on
- Click "Generate Study Cards"

### 2. Study
- View generated study cards with questions and answers
- Click a card to flip between question and answer
- Review the explanation for better understanding

### 3. Provide Feedback
After studying each card, provide feedback:
- **I got it wrong**: Mark if your answer was incorrect
- **Need more practice**: Mark if you're unsure
- **I understood**: Mark if you fully understand the concept

### 4. Review Your Plan
- The system automatically generates your study plan for tomorrow
- Focus on cards that need more practice and areas of difficulty
- Review newly incorrect cards first

## Project Structure

```
├── app/
│   ├── api/               # Serverless API routes
│   │   ├── cards/         # Study card endpoints
│   │   ├── feedback/      # Feedback submission
│   │   ├── learning-plan/ # Daily plan generation
│   │   └── topics/        # Topic management
│   ├── study/[id]/        # Study page for topic
│   ├── page.tsx           # Dashboard
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── StudyCard.tsx      # Study card component
│   ├── TopicForm.tsx      # Topic creation form
│   ├── TopicItem.tsx      # Topic list item
│   └── LearningPlanPreview.tsx
├── lib/
│   ├── prisma.ts          # Prisma client
│   └── api.ts             # API client functions
├── prisma/
│   └── schema.prisma      # Database schema
```

## Database Schema

### User
- id, name, email, password
- relationships: topics, studyCards, feedback, learningPlans

### Topic
- id, title, description, userId
- relationships: studyCards, learningPlans

### StudyCard
- id, question, answer, explanation, difficulty, topicId, userId
- relationships: feedback

### Feedback
- id, cardId, userId, status, rating, notes, reviewedAt
- Statuses: "understood", "needs_review", "incorrect"

### LearningPlan
- id, userId, topicId, planDate, cardIds, focusAreas
- Generated daily based on feedback patterns

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/topics` | Create a new topic |
| GET | `/api/topics?userId={id}` | Get all topics for user |
| POST | `/api/cards/generate` | Generate study cards |
| GET | `/api/cards?topicId={id}&userId={id}` | Get cards for topic |
| POST | `/api/feedback/submit` | Submit feedback on a card |
| GET | `/api/learning-plan?userId={id}` | Get daily learning plan |

## Deployment

### Deploy to Vercel

1. Push your repository to GitHub
2. Connect to Vercel
3. Set environment variables in Vercel dashboard:
   - `DATABASE_URL`
   - `OPENAI_API_KEY`
   - `NEXTAUTH_SECRET`

4. Deploy

### Database Options

- **Vercel Postgres**: Fully managed PostgreSQL
- **Railway**: Simple PostgreSQL hosting
- **Neon**: Serverless PostgreSQL
- **Local PostgreSQL**: For development

## Future Enhancements

- [ ] User authentication with NextAuth
- [ ] Spaced repetition algorithm
- [ ] Study statistics and analytics dashboard
- [ ] Multi-language support
- [ ] Study groups and collaborative learning
- [ ] Mobile app (React Native)
- [ ] Export study cards (CSV, PDF)
- [ ] Custom card templates

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## License

MIT License - feel free to use this project as you wish.

## Support

For questions or issues, please create an issue in the repository.

---

**Happy Learning! 🎓**
