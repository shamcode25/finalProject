# Real-Time Student Feedback Dashboard

A full-stack web application that enables students to submit anonymous feedback during class, while professors can view real-time feedback with AI-powered analytics to improve engagement.

## 🚀 Features

### For Students
- **Anonymous Feedback Submission**: Submit feedback without revealing identity
- **Multiple Feedback Types**: Choose from confused, too fast, too slow, great, question, or other
- **Real-time Confirmation**: Instant feedback on submission
- **Responsive Design**: Works seamlessly on web and mobile devices

### For Professors
- **Real-Time Dashboard**: Live updates of student feedback via WebSocket
- **AI-Powered Analytics**: 
  - Automatic sentiment analysis (positive, negative, neutral)
  - Text classification using OpenAI
  - AI-generated summaries with key points and recommendations
  - Confidence scoring for AI analysis
- **Advanced Filtering**: Filter feedback by type and sentiment
- **Statistics Dashboard**: View total feedback, recent activity, and engagement metrics
- **Delete Functionality**: Remove inappropriate feedback

## 🛠️ Tech Stack

### Frontend
- **React 19** with Vite
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Axios** for HTTP requests
- **Socket.io Client** for real-time updates

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose
- **Socket.io** for WebSocket connections
- **OpenAI API** for sentiment analysis and text classification

### Deployment
- Frontend: Vercel (recommended)
- Backend: Render or Railway
- Database: MongoDB Atlas

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB Atlas account (free tier) or local MongoDB
- OpenAI API key (for AI features)

## 🔧 Installation

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
PORT=5000
MONGODB_URI=your_mongodb_connection_string
OPENAI_API_KEY=your_openai_api_key
FRONTEND_URL=http://localhost:5173
```

Start the backend server:

```bash
npm start
# or for development with auto-reload
npm run dev
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:5000
```

Start the development server:

```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## 📡 API Endpoints

### Feedback Endpoints

- `POST /api/feedback` - Submit new feedback
  ```json
  {
    "message": "The lecture was too fast",
    "type": "too-fast",
    "sessionId": "default-session"
  }
  ```

- `GET /api/feedback` - Get all feedback
  - Query params: `sessionId`, `type`, `sentiment`, `limit`

- `GET /api/feedback/stats` - Get analytics and statistics
  - Query params: `sessionId`

- `GET /api/feedback/summary` - Get AI-generated summary
  - Query params: `sessionId`, `limit`

- `DELETE /api/feedback/:id` - Delete feedback

### Health Check

- `GET /api/health` - Server health check

## 🎯 Usage

### Student View
1. Navigate to `/student` or click "Submit Feedback"
2. Select a feedback type
3. Enter your message
4. Click "Submit Feedback"
5. Receive instant confirmation

### Professor View
1. Navigate to `/professor` or click "View Dashboard"
2. View real-time feedback feed
3. Check AI-generated summary for insights
4. Filter feedback by type or sentiment
5. View statistics and analytics
6. Delete inappropriate feedback if needed

## 🚢 Deployment

### Backend Deployment (Render)

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set build command: `cd backend && npm install`
4. Set start command: `cd backend && npm start`
5. Add environment variables:
   - `MONGODB_URI`
   - `OPENAI_API_KEY`
   - `FRONTEND_URL` (your frontend URL)
   - `PORT` (Render will set this automatically)

### Frontend Deployment (Vercel)

1. Install Vercel CLI: `npm i -g vercel`
2. Navigate to frontend directory: `cd frontend`
3. Run: `vercel`
4. Set environment variable:
   - `VITE_API_URL` (your backend URL)

### Database Setup (MongoDB Atlas)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string
4. Add it to your backend `.env` file

## 🔐 Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/feedback-dashboard
OPENAI_API_KEY=sk-...
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000
```

## 📊 Features Breakdown

### AI Integration
- **Sentiment Analysis**: Automatically analyzes each feedback for positive, negative, or neutral sentiment
- **Text Classification**: Classifies feedback into appropriate categories
- **Smart Summaries**: Generates comprehensive summaries with key points and actionable recommendations
- **Confidence Scoring**: Provides confidence levels for AI analysis

### Real-Time Features
- WebSocket connections for instant updates
- Professors see new feedback immediately
- No page refresh needed

### Responsive Design
- Mobile-first approach
- Works on all screen sizes
- Touch-friendly interface

## 🧪 Testing

### Manual Testing Checklist
- [ ] Submit feedback as a student
- [ ] View feedback as a professor
- [ ] Test real-time updates (open two browser windows)
- [ ] Test filtering functionality
- [ ] Test AI summary generation
- [ ] Test delete functionality
- [ ] Test responsive design on mobile

## 📝 Project Structure

```
FinalProject/
├── backend/
│   ├── models/
│   │   └── Feedback.js
│   ├── routes/
│   │   └── feedback.js
│   ├── services/
│   │   └── openaiService.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── StudentView.jsx
│   │   │   └── ProfessorView.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   └── socket.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
└── README.md
```

## 🎓 Learning Outcomes

This project demonstrates:
- Full-stack development with React and Express
- RESTful API design
- Real-time communication with WebSockets
- Database integration with MongoDB
- AI/ML integration with OpenAI API
- Responsive web design
- Error handling and validation
- Deployment to cloud platforms

## 🔮 Future Enhancements

- User authentication and session management
- Multiple class sessions
- Export analytics as CSV/PDF
- Dark mode toggle
- Email notifications
- Feedback history and trends
- Student engagement scoring

## 📄 License

This project is open source and available under the MIT License.

## 👥 Contributors

- [Your Name]

## 🙏 Acknowledgments

- OpenAI for providing the API for sentiment analysis
- MongoDB Atlas for database hosting
- Vercel and Render for deployment platforms

## 📞 Support

For issues or questions, please open an issue in the repository.

---

**Note**: Make sure to add your OpenAI API key and MongoDB connection string before running the application. The AI features will gracefully degrade if the OpenAI API key is not provided.

