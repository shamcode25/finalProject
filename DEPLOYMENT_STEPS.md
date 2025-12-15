# Deployment Steps - Step by Step

## Prerequisites Checklist
- [x] Code pushed to GitHub: https://github.com/shamcode25/finalProject
- [ ] Render account created
- [ ] Vercel account created

---

## STEP 1: Deploy Backend to Render

### 1.1 Create Render Account
1. Go to **https://render.com**
2. Click **"Get Started for Free"**
3. Sign up with **GitHub** (recommended - easier to connect repo)
4. Authorize Render to access your GitHub

### 1.2 Create New Web Service
1. In Render dashboard, click **"New +"** button (top right)
2. Select **"Web Service"**
3. Click **"Connect account"** if GitHub isn't connected
4. Find and select your repository: **`shamcode25/finalProject`**
5. Click **"Connect"**

### 1.3 Configure Backend Service
Fill in these settings:

**Basic Settings:**
- **Name**: `feedback-dashboard-backend`
- **Region**: Choose closest to you (e.g., `Oregon (US West)`)
- **Branch**: `main`
- **Root Directory**: `backend` ⚠️ **IMPORTANT**
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

**Advanced Settings:**
- Click **"Advanced"** to expand
- **Auto-Deploy**: `Yes` (deploys on every push)

### 1.4 Add Environment Variables
Click **"Add Environment Variable"** and add each one:

1. **NODE_ENV**
   - Key: `NODE_ENV`
   - Value: `production`

2. **PORT**
   - Key: `PORT`
   - Value: `10000`

3. **DATABASE_URL**
   - Key: `DATABASE_URL`
   - Value: `postgresql://postgres.lbxplpedvwkshhelrzgi:Eh%40tasham113902@aws-1-us-east-2.pooler.supabase.com:6543/postgres`

4. **OPENAI_API_KEY**
   - Key: `OPENAI_API_KEY`
   - Value: `your_openai_api_key_here` (use your actual key from backend/.env)

5. **FRONTEND_URL** (temporary - update after frontend deploy)
   - Key: `FRONTEND_URL`
   - Value: `https://placeholder.vercel.app` (we'll update this later)

### 1.5 Deploy
1. Scroll down and click **"Create Web Service"**
2. Wait for deployment (5-10 minutes)
3. Watch the build logs - it should show:
   - ✅ Installing dependencies
   - ✅ Building...
   - ✅ Starting server
4. Once deployed, copy your backend URL:
   - It will look like: `https://feedback-dashboard-backend.onrender.com`
   - **SAVE THIS URL** - you'll need it for frontend!

### 1.6 Test Backend
1. Open your backend URL in browser
2. Add `/health` to the end: `https://your-backend.onrender.com/health`
3. Should see: `{"status":"ok","message":"Server is running"}`

---

## STEP 2: Deploy Frontend to Vercel

### 2.1 Create Vercel Account
1. Go to **https://vercel.com**
2. Click **"Sign Up"**
3. Sign up with **GitHub** (recommended)
4. Authorize Vercel to access your GitHub

### 2.2 Import Project
1. In Vercel dashboard, click **"Add New..."**
2. Select **"Project"**
3. Find your repository: **`shamcode25/finalProject`**
4. Click **"Import"**

### 2.3 Configure Frontend
**Project Settings:**
- **Project Name**: `feedback-dashboard` (or leave default)
- **Framework Preset**: `Vite` (should auto-detect)
- **Root Directory**: `frontend` ⚠️ **IMPORTANT - Click "Edit" and set to `frontend`**
- **Build Command**: `npm run build` (auto-filled)
- **Output Directory**: `dist` (auto-filled)
- **Install Command**: `npm install` (auto-filled)

### 2.4 Add Environment Variables
Click **"Environment Variables"** and add:

1. **VITE_API_URL**
   - Key: `VITE_API_URL`
   - Value: `https://your-backend-url.onrender.com/api`
   - ⚠️ Replace `your-backend-url` with your actual Render backend URL from Step 1.5

2. **VITE_SOCKET_URL**
   - Key: `VITE_SOCKET_URL`
   - Value: `https://your-backend-url.onrender.com`
   - ⚠️ Replace `your-backend-url` with your actual Render backend URL from Step 1.5

**Example** (if your backend is `feedback-dashboard-backend.onrender.com`):
- `VITE_API_URL` = `https://feedback-dashboard-backend.onrender.com/api`
- `VITE_SOCKET_URL` = `https://feedback-dashboard-backend.onrender.com`

### 2.5 Deploy
1. Click **"Deploy"** button
2. Wait for deployment (2-3 minutes)
3. Watch the build process
4. Once complete, copy your frontend URL:
   - It will look like: `https://feedback-dashboard.vercel.app`
   - **SAVE THIS URL**

### 2.6 Test Frontend
1. Open your Vercel URL in browser
2. Should see the feedback dashboard
3. Try submitting feedback (may not work yet until Step 3)

---

## STEP 3: Update Backend with Frontend URL

### 3.1 Update Render Environment Variable
1. Go back to **Render dashboard**
2. Click on your backend service: `feedback-dashboard-backend`
3. Go to **"Environment"** tab
4. Find `FRONTEND_URL` variable
5. Click **"Edit"** (pencil icon)
6. Update value to your Vercel frontend URL:
   - Example: `https://feedback-dashboard.vercel.app`
7. Click **"Save Changes"**
8. This will trigger an automatic redeploy (wait 2-3 minutes)

---

## STEP 4: Final Testing

### 4.1 Test Complete Application
1. Open your **Vercel frontend URL**
2. Go to student view
3. Submit a test feedback
4. Open professor view in another tab: `https://your-frontend.vercel.app/professor`
5. Verify:
   - ✅ Feedback appears in real-time
   - ✅ Statistics update
   - ✅ No console errors

### 4.2 Verify Backend Health
- Visit: `https://your-backend.onrender.com/health`
- Should return: `{"status":"ok","message":"Server is running"}`

### 4.3 Test API Endpoints
- Test stats: `https://your-backend.onrender.com/api/feedback/stats`
- Should return JSON with statistics

---

## Troubleshooting

### Backend won't start
- Check Render logs (click "Logs" tab)
- Verify all environment variables are set
- Check that `Root Directory` is set to `backend`

### Frontend can't connect to backend
- Verify `VITE_API_URL` is correct in Vercel
- Check backend is running (visit `/health` endpoint)
- Check browser console for CORS errors

### Database connection errors
- Verify `DATABASE_URL` is correct in Render
- Check Supabase project is active
- Ensure connection pooler URL is used (port 6543)

### WebSocket not working
- Verify `VITE_SOCKET_URL` is set in Vercel
- Check `FRONTEND_URL` is correct in Render
- Ensure both URLs use `https://`

---

## Your Deployment URLs

After deployment, you'll have:

- **Frontend**: `https://your-frontend.vercel.app`
- **Backend**: `https://your-backend.onrender.com`
- **Health Check**: `https://your-backend.onrender.com/health`

---

## Next Steps After Deployment

1. ✅ Test all features
2. ✅ Share your deployment links
3. ✅ Update README.md with live URLs
4. ✅ Monitor usage and performance
5. ✅ Set up custom domain (optional)

---

**Ready? Let's start with Step 1!** 🚀

