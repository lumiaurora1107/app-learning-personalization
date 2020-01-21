@echo off
REM Setup script for Windows

echo 🚀 Setting up Personalized Learning Platform...

REM Check if .env.local exists
if not exist .env.local (
    echo 📝 Creating .env.local from example...
    copy .env.example .env.local
    echo ✅ .env.local created. Please update with your values.
    exit /b 1
)

REM Install dependencies
if not exist node_modules (
    echo 📦 Installing dependencies...
    call npm install
)

REM Setup Prisma
echo 🗄️  Setting up database...
call npx prisma migrate dev --name init

echo.
echo ✅ Setup complete!
echo.
echo To start the development server:
echo   npm run dev
echo.
echo Then visit: http://localhost:3000
