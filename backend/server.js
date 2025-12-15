import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import feedbackRoutes from './routes/feedback.js';
import { initializeDatabase } from './db/connection.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 5001;
const DATABASE_URL = process.env.DATABASE_URL || process.env.POSTGRESQL_URI;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Store io instance for use in routes
app.set('io', io);

// Routes
app.use('/api/feedback', feedbackRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Connect to PostgreSQL and initialize database
async function startServer() {
  try {
    if (!DATABASE_URL) {
      throw new Error('DATABASE_URL or POSTGRESQL_URI not set in environment variables');
    }

    await initializeDatabase();
    
    httpServer.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🔌 Socket.io server ready`);
      console.log(`📡 API available at http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('❌ PostgreSQL connection error:', error.message);
    console.log('\n💡 To fix this:');
    console.log('   1. Setup PostgreSQL database (local or cloud)');
    console.log('   2. Update DATABASE_URL in backend/.env');
    console.log('   3. Format: postgresql://user:password@host:port/database');
    console.log('   4. Or use: postgresql://localhost:5432/feedback_dashboard\n');
    console.log('⚠️  Starting server anyway, but database features will not work...\n');
    // Start server even without database for testing frontend
    httpServer.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT} (without database)`);
      console.log(`⚠️  Note: Database features disabled`);
    });
  }
}

startServer();

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

export default app;
