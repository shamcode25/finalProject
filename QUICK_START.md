# Quick Start - Connect to Supabase

## Your Connection String
```
postgresql://postgres:[YOUR_PASSWORD]@db.odxfqjnvoomwywjunadz.supabase.co:5432/postgres
```

## Steps to Complete Setup

### 1. Update Password in .env

**Option A: Using Terminal**
```bash
cd backend
# Replace 'your_actual_password' with your Supabase password
sed -i '' 's/\[YOUR_PASSWORD\]/your_actual_password/' .env
```

**Option B: Manual Edit**
```bash
cd backend
nano .env
# or
code .env
# Find [YOUR_PASSWORD] and replace with your actual password
```

### 2. Restart Backend Server

```bash
cd backend
# Stop current server if running (Ctrl+C)
npm start
```

### 3. Verify Connection

You should see in the console:
```
✅ Connected to PostgreSQL
✅ Database schema initialized
🚀 Server running on port 5001
```

### 4. Test the Application

1. Open http://localhost:5173
2. Submit feedback as a student
3. Go to http://localhost:5173/professor
4. See your feedback appear in real-time!

## Finding Your Password

If you forgot your Supabase password:
1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to Settings → Database
4. Click "Reset database password" if needed
5. Or check your project creation email

## Troubleshooting

**Connection Error?**
- Verify password is correct (no brackets)
- Check Supabase project is fully created
- Ensure connection string format is correct

**Schema not created?**
- Check backend console for errors
- Verify connection is successful first
- Schema auto-creates on first connection

---

**Once password is updated, restart the backend and you're ready to go!** 🚀

