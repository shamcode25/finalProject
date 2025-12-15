# Quick Deployment Steps

## 1. Push to GitHub
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

## 2. Deploy Backend (Render)
1. Go to https://render.com → New Web Service
2. Connect GitHub repo
3. Settings:
   - Root Directory: `backend`
   - Build: `npm install`
   - Start: `npm start`
4. Add Environment Variables:
   - `DATABASE_URL` (your Supabase connection string)
   - `FRONTEND_URL` (will update after frontend deploy)
   - `OPENAI_API_KEY` (your OpenAI key)
   - `NODE_ENV=production`
   - `PORT=10000`
5. Deploy and copy backend URL

## 3. Deploy Frontend (Vercel)
1. Go to https://vercel.com → Add Project
2. Import GitHub repo
3. Settings:
   - Root Directory: `frontend`
   - Framework: Vite
4. Add Environment Variables:
   - `VITE_API_URL` = `https://your-backend.onrender.com/api`
   - `VITE_SOCKET_URL` = `https://your-backend.onrender.com`
5. Deploy and copy frontend URL

## 4. Update Backend
- Go back to Render
- Update `FRONTEND_URL` with your Vercel URL
- Redeploy

## Done! 🎉
