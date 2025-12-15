# Deployment Guide

This guide provides step-by-step instructions for deploying the Real-Time Student Feedback Dashboard.

## Prerequisites

- GitHub account
- MongoDB Atlas account (free tier)
- OpenAI API key
- Vercel account (for frontend)
- Render account (for backend) - or Railway/Heroku

## Step 1: Setup MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (free tier M0)
4. Create a database user
5. Whitelist your IP address (or use 0.0.0.0/0 for all IPs)
6. Get your connection string:
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database password

## Step 2: Get OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new secret key
5. Copy the key (starts with `sk-`)

## Step 3: Deploy Backend to Render

### Option A: Using Render Dashboard

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `feedback-dashboard-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Root Directory**: Leave empty (or set to `backend` if deploying from root)
5. Add Environment Variables:
   - `MONGODB_URI`: Your MongoDB connection string
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `FRONTEND_URL`: Your frontend URL (update after deploying frontend)
   - `NODE_ENV`: `production`
6. Click "Create Web Service"
7. Wait for deployment to complete
8. Copy your backend URL (e.g., `https://feedback-dashboard-backend.onrender.com`)

### Option B: Using render.yaml

If you have `render.yaml` in your repository:

1. Go to Render Dashboard
2. Click "New +" → "Blueprint"
3. Connect your repository
4. Render will automatically detect and use `render.yaml`
5. Add environment variables as above

## Step 4: Deploy Frontend to Vercel

### Option A: Using Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

3. Login to Vercel:
   ```bash
   vercel login
   ```

4. Deploy:
   ```bash
   vercel
   ```

5. Follow the prompts:
   - Set up and deploy? **Yes**
   - Which scope? Select your account
   - Link to existing project? **No**
   - Project name? `feedback-dashboard-frontend`
   - Directory? `./`
   - Override settings? **No**

6. Add environment variable:
   ```bash
   vercel env add VITE_API_URL
   ```
   - Enter your backend URL (e.g., `https://feedback-dashboard-backend.onrender.com`)

7. Redeploy to apply environment variable:
   ```bash
   vercel --prod
   ```

### Option B: Using Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add Environment Variable:
   - **Key**: `VITE_API_URL`
   - **Value**: Your backend URL
6. Click "Deploy"
7. Wait for deployment to complete
8. Copy your frontend URL

## Step 5: Update Backend CORS

1. Go back to Render dashboard
2. Edit your backend service
3. Update the `FRONTEND_URL` environment variable with your Vercel frontend URL
4. Redeploy the backend service

## Step 6: Test Deployment

1. Visit your frontend URL
2. Test student feedback submission
3. Test professor dashboard
4. Verify real-time updates work
5. Check AI summary generation

## Troubleshooting

### Backend Issues

- **Connection refused**: Check that backend is running and URL is correct
- **CORS errors**: Verify `FRONTEND_URL` environment variable matches your frontend URL
- **MongoDB connection failed**: Check connection string and IP whitelist
- **OpenAI errors**: Verify API key is correct and has credits

### Frontend Issues

- **API calls failing**: Check `VITE_API_URL` environment variable
- **WebSocket connection failed**: Verify backend URL and CORS settings
- **Build errors**: Check Node.js version (should be 18+)

### Common Issues

1. **Environment variables not updating**: 
   - Redeploy after changing environment variables
   - Clear browser cache

2. **WebSocket not working**:
   - Check that Socket.io is properly configured
   - Verify CORS settings allow WebSocket connections

3. **AI features not working**:
   - Check OpenAI API key is set
   - Verify API key has available credits
   - Check backend logs for errors

## Alternative Deployment Options

### Railway

1. Go to [Railway](https://railway.app/)
2. Create new project from GitHub
3. Add MongoDB and configure environment variables
4. Deploy backend service
5. Deploy frontend service

### Heroku

1. Install Heroku CLI
2. Create Heroku app: `heroku create feedback-dashboard-backend`
3. Add MongoDB addon: `heroku addons:create mongolab`
4. Set environment variables: `heroku config:set OPENAI_API_KEY=...`
5. Deploy: `git push heroku main`

## Monitoring

- **Render**: Check logs in Render dashboard
- **Vercel**: Check logs in Vercel dashboard
- **MongoDB Atlas**: Monitor database usage
- **OpenAI**: Monitor API usage in OpenAI dashboard

## Cost Estimates

- **MongoDB Atlas**: Free tier (512MB storage)
- **Render**: Free tier (spins down after inactivity)
- **Vercel**: Free tier (generous limits)
- **OpenAI**: Pay-as-you-go (very affordable for this use case)

## Security Notes

- Never commit `.env` files
- Use environment variables for all secrets
- Enable MongoDB IP whitelisting
- Use HTTPS for all connections
- Regularly rotate API keys

