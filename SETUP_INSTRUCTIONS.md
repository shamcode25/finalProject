# Quick Setup Instructions

## Current Status

✅ **Frontend**: Running on http://localhost:5173
⚠️ **Backend**: Needs PostgreSQL connection

## PostgreSQL Setup Options

### Option 1: Supabase (Recommended - Free & Easy)

1. Go to https://supabase.com
2. Sign up for free account
3. Create a new project
4. Go to Settings → Database
5. Copy the connection string (looks like: `postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres`)
6. Update `backend/.env`:
   ```
   DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres
   ```
7. Restart backend: `cd backend && npm start`

### Option 2: Local PostgreSQL

1. Install PostgreSQL locally:
   ```bash
   # macOS with Homebrew:
   brew install postgresql
   brew services start postgresql
   ```

2. Create database:
   ```bash
   createdb feedback_dashboard
   ```

3. Update `backend/.env`:
   ```
   DATABASE_URL=postgresql://localhost:5432/feedback_dashboard
   ```
   (If you have a password, use: `postgresql://username:password@localhost:5432/feedback_dashboard`)

4. Restart backend: `cd backend && npm start`

### Option 3: Railway PostgreSQL

1. Go to https://railway.app
2. Sign up and create a new project
3. Add PostgreSQL database
4. Copy the connection string
5. Update `backend/.env` with the connection string
6. Restart backend

### Option 4: Neon PostgreSQL

1. Go to https://neon.tech
2. Sign up for free account
3. Create a new project
4. Copy the connection string
5. Update `backend/.env`
6. Restart backend

## OpenAI API Key (Optional but Recommended)

1. Go to https://platform.openai.com/api-keys
2. Create a new API key
3. Update `backend/.env`:
   ```
   OPENAI_API_KEY=sk-your-key-here
   ```
4. Restart backend

**Note**: Without OpenAI key, the app will work but AI features will use fallback values.

## Testing the Application

1. **Frontend**: Open http://localhost:5173 in your browser
2. **Student View**: Submit anonymous feedback
3. **Professor View**: Go to http://localhost:5173/professor to see the dashboard

## Troubleshooting

### Backend won't start
- Check PostgreSQL connection string in `.env`
- Verify PostgreSQL is running (cloud or local)
- Check port 5001 is available
- For local: Ensure database exists (`createdb feedback_dashboard`)

### Frontend can't connect to backend
- Verify backend is running: `curl http://localhost:5001/health`
- Check browser console for errors
- Verify proxy settings in `vite.config.js`

### PostgreSQL Connection Error
- For cloud: Check connection string and credentials
- For local: Verify PostgreSQL service is running
- Check connection string format: `postgresql://user:password@host:port/database`
- Ensure database exists: `psql -l` to list databases

## Running the Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Both servers should now be running! 🚀

## Database Schema

The database schema is automatically created when you first start the backend. It includes:
- `feedbacks` table with all necessary columns
- Indexes for performance
- Proper constraints and data types

No manual migration needed!
