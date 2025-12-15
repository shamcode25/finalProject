# Next Steps - Getting Your Application Running

## Current Status
- ✅ Frontend: Running on http://localhost:5173
- ⚠️ Backend: Needs PostgreSQL connection
- ❌ PostgreSQL: Not set up yet

## Step-by-Step Guide

### Option 1: Quick Setup with Supabase (Recommended - 5 minutes)

1. **Create Supabase Account**
   - Go to https://supabase.com
   - Click "Start your project" and sign up (free)

2. **Create New Project**
   - Click "New Project"
   - Choose organization (or create one)
   - Fill in:
     - Project name: `feedback-dashboard`
     - Database password: (save this!)
     - Region: Choose closest to you
   - Click "Create new project" (takes ~2 minutes)

3. **Get Connection String**
   - Once project is ready, go to Settings → Database
   - Scroll to "Connection string"
   - Select "URI" tab
   - Copy the connection string (looks like: `postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres`)
   - Replace `[YOUR-PASSWORD]` with the password you set

4. **Update Backend Configuration**
   ```bash
   cd backend
   # Edit .env file and update:
   DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres
   ```

5. **Restart Backend**
   ```bash
   # Stop current backend (Ctrl+C if running in terminal)
   npm start
   ```

6. **Test the Application**
   - Open http://localhost:5173
   - Try submitting feedback as a student
   - Check the professor dashboard at http://localhost:5173/professor

---

### Option 2: Local PostgreSQL Setup

1. **Install PostgreSQL**
   ```bash
   # macOS with Homebrew:
   brew install postgresql@14
   brew services start postgresql@14
   
   # Or download installer from:
   # https://www.postgresql.org/download/macosx/
   ```

2. **Create Database**
   ```bash
   createdb feedback_dashboard
   # Or if you need to specify user:
   createdb -U your_username feedback_dashboard
   ```

3. **Update Backend Configuration**
   ```bash
   cd backend
   # Edit .env file:
   DATABASE_URL=postgresql://localhost:5432/feedback_dashboard
   # Or with username/password:
   DATABASE_URL=postgresql://username:password@localhost:5432/feedback_dashboard
   ```

4. **Restart Backend**
   ```bash
   npm start
   ```

---

### Step 3: Add OpenAI API Key (Optional but Recommended)

1. **Get API Key**
   - Go to https://platform.openai.com/api-keys
   - Sign up or log in
   - Click "Create new secret key"
   - Copy the key (starts with `sk-`)

2. **Add to Backend**
   ```bash
   cd backend
   # Edit .env file:
   OPENAI_API_KEY=sk-your-actual-key-here
   ```

3. **Restart Backend**
   - This enables AI-powered sentiment analysis and summaries

---

### Step 4: Test Everything

1. **Start Both Servers** (if not already running)
   
   Terminal 1 - Backend:
   ```bash
   cd backend
   npm start
   ```
   
   Terminal 2 - Frontend:
   ```bash
   cd frontend
   npm run dev
   ```

2. **Test Student View**
   - Go to http://localhost:5173
   - Submit feedback with different types
   - Verify you get success message

3. **Test Professor View**
   - Go to http://localhost:5173/professor
   - See your submitted feedback appear in real-time
   - Check statistics
   - Click "Generate" to get AI summary

4. **Test Real-Time Updates**
   - Open two browser windows
   - Submit feedback in one (student view)
   - See it appear instantly in the other (professor view)

---

### Step 5: Deployment (For Production)

Once everything works locally:

1. **Deploy Backend to Render**
   - Push code to GitHub
   - Connect to Render
   - Set environment variables
   - Deploy

2. **Deploy Frontend to Vercel**
   - Connect GitHub repo
   - Set root directory to `frontend`
   - Add environment variables
   - Deploy

3. **Update README**
   - Add your live deployment links

---

## Troubleshooting

### Backend won't connect to PostgreSQL
- ✅ Check connection string format
- ✅ Verify database exists (for local)
- ✅ Check credentials are correct
- ✅ For Supabase: Check if project is fully created

### Frontend can't reach backend
- ✅ Verify backend is running on port 5001
- ✅ Check browser console for errors
- ✅ Verify CORS settings

### Database schema not created
- ✅ Check backend logs for errors
- ✅ Verify database connection is working
- ✅ Schema auto-creates on first successful connection

---

## Quick Commands Reference

```bash
# Check if servers are running
lsof -ti:5173 && echo "Frontend running" || echo "Frontend not running"
lsof -ti:5001 && echo "Backend running" || echo "Backend not running"

# Start backend
cd backend && npm start

# Start frontend  
cd frontend && npm run dev

# Check PostgreSQL connection (local)
psql -l

# Test backend health
curl http://localhost:5001/health
```

---

## What You Should See When Working

✅ Backend console shows:
```
✅ Connected to PostgreSQL
✅ Database schema initialized
🚀 Server running on port 5001
🔌 Socket.io server ready
```

✅ Frontend accessible at: http://localhost:5173

✅ Can submit feedback and see it in professor dashboard

---

**Ready to proceed?** Choose Option 1 (Supabase) for the fastest setup! 🚀

