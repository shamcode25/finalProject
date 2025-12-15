# Real-Time Student Feedback Dashboard

A full-stack web application that allows students to submit anonymous feedback during class, while professors can view real-time feedback with AI-powered analytics to improve engagement.

## 🚀 Features

### For Students
- **Anonymous Feedback Submission**: Submit feedback without revealing identity
- **Multiple Feedback Types**: Choose from confused, too fast, too slow, great, question, or other
- **Real-time Confirmation**: Instant feedback on submission status
- **Mobile-Friendly**: Responsive design works on all devices

### For Professors
- **Real-Time Dashboard**: Live updates as students submit feedback
- **AI-Powered Analytics**: 
  - Automatic sentiment analysis (positive, negative, neutral)
  - Text classification using OpenAI
  - AI-generated summaries with key insights and recommendations
- **Statistics Dashboard**: 
  - Total feedback count
  - Feedback by type and sentiment
  - Recent activity tracking
- **Filtering**: Filter feedback by type or sentiment
- **Delete Functionality**: Remove feedback when needed

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API calls
- **Socket.io Client** - Real-time WebSocket communication

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **PostgreSQL** - Relational database
- **pg (node-postgres)** - PostgreSQL client for Node.js
- **Socket.io** - Real-time bidirectional communication
- **OpenAI API** - AI-powered sentiment analysis and text classification

## 📋 Prerequisites

Before you begin, ensure you have:
- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL (local installation or cloud database like Supabase, Railway, or Neon)
- OpenAI API key (optional, but recommended for full functionality)

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd FinalProject
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
PORT=5001
DATABASE_URL=postgresql://localhost:5432/feedback_dashboard
# Or use cloud PostgreSQL (Supabase, Railway, Neon, etc.):
# DATABASE_URL=postgresql://user:password@host:5432/database
OPENAI_API_KEY=your_openai_api_key_here
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

**Note**: 
- If you don't have an OpenAI API key, the app will still work but with limited AI features (fallback to basic classification).
- The database schema will be automatically created on first run.

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Create a `.env` file in the `frontend` directory (optional):

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### 4. Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm start
# or for development with auto-reload:
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 📡 API Endpoints

### Feedback Endpoints

- `POST /api/feedback` - Submit new feedback
  ```json
  {
    "message": "This is too fast",
    "type": "too-fast",
    "sessionId": "default-session"
  }
  ```

- `GET /api/feedback` - Get all feedback
  - Query params: `?sessionId=xxx&type=xxx&sentiment=xxx`

- `GET /api/feedback/stats` - Get statistics
  - Query params: `?sessionId=xxx`

- `GET /api/feedback/summary` - Get AI-generated summary
  - Query params: `?sessionId=xxx`

- `DELETE /api/feedback/:id` - Delete feedback

### Health Check

- `GET /health` - Server health status

## 🎯 Usage

### Student View (`/`)
1. Navigate to the student view
2. Select a feedback type (confused, too fast, too slow, great, question, other)
3. Optionally add a message
4. Click "Submit Feedback"
5. Receive instant confirmation

### Professor View (`/professor`)
1. Navigate to the professor dashboard
2. View real-time feedback as it arrives
3. Check statistics and analytics
4. Click "Generate" to get AI-powered summary
5. Filter feedback by type or sentiment
6. Delete feedback if needed

## 🚢 Deployment

### Backend Deployment (Render/Railway)

1. **Push to GitHub** (if not already done)

2. **Deploy on Render:**
   - Go to [Render](https://render.com)
   - Create a new Web Service
   - Connect your GitHub repository
   - Set build command: `cd backend && npm install`
   - Set start command: `cd backend && npm start`
   - Add environment variables:
     - `DATABASE_URL` (your PostgreSQL connection string)
     - `OPENAI_API_KEY` (your OpenAI API key)
     - `FRONTEND_URL` (your frontend URL)
     - `NODE_ENV=production`

3. **Update Frontend Environment Variables:**
   - Set `VITE_API_URL` to your Render backend URL
   - Set `VITE_SOCKET_URL` to your Render backend URL

### Frontend Deployment (Vercel)

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy:**
   ```bash
   cd frontend
   vercel
   ```

3. **Or use Vercel Dashboard:**
   - Go to [Vercel](https://vercel.com)
   - Import your GitHub repository
   - Set root directory to `frontend`
   - Add environment variables:
     - `VITE_API_URL` (your backend URL)
     - `VITE_SOCKET_URL` (your backend URL)
   - Deploy

### PostgreSQL Setup

#### Option 1: Local PostgreSQL

1. Install PostgreSQL:
   ```bash
   # macOS with Homebrew:
   brew install postgresql
   brew services start postgresql
   
   # Or download from: https://www.postgresql.org/download/
   ```

2. Create database:
   ```bash
   createdb feedback_dashboard
   # Or using psql:
   psql -c "CREATE DATABASE feedback_dashboard;"
   ```

3. Update `.env`:
   ```
   DATABASE_URL=postgresql://localhost:5432/feedback_dashboard
   ```

#### Option 2: Cloud PostgreSQL (Recommended)

**Supabase (Free Tier):**
1. Sign up at [Supabase](https://supabase.com)
2. Create a new project
3. Go to Settings → Database
4. Copy the connection string
5. Update `.env` with the connection string

**Railway:**
1. Sign up at [Railway](https://railway.app)
2. Create a new PostgreSQL database
3. Copy the connection string
4. Update `.env`

**Neon (Free Tier):**
1. Sign up at [Neon](https://neon.tech)
2. Create a new project
3. Copy the connection string
4. Update `.env`

The database schema (tables) will be automatically created when you start the server.

## 🧪 Testing

### Manual Testing Checklist

- [ ] Submit feedback from student view
- [ ] Verify feedback appears in professor dashboard
- [ ] Test real-time updates (open two browser windows)
- [ ] Test filtering by type and sentiment
- [ ] Test AI summary generation
- [ ] Test delete functionality
- [ ] Test responsive design on mobile
- [ ] Verify error handling (disconnect backend, etc.)

## 📊 Project Structure

```
FinalProject/
├── backend/
│   ├── models/
│   │   └── Feedback.js          # MongoDB schema
│   ├── routes/
│   │   └── feedback.js          # API routes
│   ├── services/
│   │   └── openaiService.js     # OpenAI integration
│   ├── server.js                # Express server
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/          # Reusable components
│   │   ├── pages/               # Page components
│   │   ├── services/            # API and socket services
│   │   └── App.jsx              # Main app component
│   └── package.json
└── README.md
```

## 🎨 Features Highlights

### AI Integration
- **Sentiment Analysis**: Automatically classifies feedback as positive, negative, or neutral
- **Text Classification**: AI suggests the most appropriate feedback category
- **Smart Summaries**: Generates actionable insights and recommendations for professors

### Real-Time Updates
- WebSocket connection for instant updates
- No page refresh needed
- Live feedback counter

### Responsive Design
- Mobile-first approach
- Works seamlessly on phones, tablets, and desktops
- Modern, clean UI with Tailwind CSS

## 🔒 Security & Privacy

- All feedback is anonymous (no user identification stored)
- CORS configured for secure cross-origin requests
- Environment variables for sensitive data
- Input validation on backend

## 🐛 Troubleshooting

### Backend won't start
- Check MongoDB connection string
- Verify PORT is not in use
- Check environment variables

### Frontend can't connect to backend
- Verify backend is running
- Check CORS settings
- Verify API URL in environment variables

### OpenAI features not working
- Verify OpenAI API key is set
- Check API key has sufficient credits
- App will fallback to basic features if API unavailable

### Real-time updates not working
- Check Socket.io connection
- Verify WebSocket is enabled
- Check browser console for errors

## 📝 License

This project is open source and available for educational purposes.

## 👨‍💻 Development

### Git Commit Strategy

This project follows conventional commits:
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Test additions/changes

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Commit with clear messages
5. Push and create a pull request

## 🎓 Learning Outcomes

This project demonstrates:
- Full-stack development (React + Express)
- Database integration (MongoDB)
- Real-time communication (WebSocket)
- AI/ML integration (OpenAI API)
- RESTful API design
- Responsive web design
- Error handling and validation
- Deployment to cloud platforms

## 🔗 Live Demo

[Add your deployment link here after deploying]

Example:
- Frontend: https://feedback-dashboard.vercel.app
- Backend: https://feedback-dashboard.onrender.com

## 📧 Contact

For questions or issues, please open an issue on GitHub.

---

**Built with ❤️ for improving classroom engagement**
