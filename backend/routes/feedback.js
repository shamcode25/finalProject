import express from 'express';
import Feedback from '../models/Feedback.js';
import { analyzeFeedback, generateFeedbackSummary } from '../services/openaiService.js';

const router = express.Router();

// POST /api/feedback - Submit new feedback
router.post('/', async (req, res) => {
  try {
    const { message, type, sessionId } = req.body;

    if (!message || !type) {
      return res.status(400).json({ error: 'Message and type are required' });
    }

    // Analyze feedback with OpenAI
    const aiAnalysis = await analyzeFeedback(message, type);

    // Create feedback with AI analysis
    const feedback = await Feedback.create({
      message,
      type,
      sessionId: sessionId || 'default-session',
      sentiment: aiAnalysis.sentiment,
      aiClassification: aiAnalysis.classification,
      confidence: aiAnalysis.confidence
    });

    // Emit real-time update via socket.io (handled in server.js)
    req.app.get('io').emit('new-feedback', feedback);

    res.status(201).json(feedback);
  } catch (error) {
    console.error('Error creating feedback:', error);
    res.status(500).json({ error: 'Failed to create feedback' });
  }
});

// GET /api/feedback - Get all feedback
router.get('/', async (req, res) => {
  try {
    const { sessionId, type, sentiment } = req.query;
    const queryParams = {};

    if (sessionId) queryParams.sessionId = sessionId;
    if (type) queryParams.type = type;
    if (sentiment) queryParams.sentiment = sentiment;

    const feedbacks = await Feedback.findAll(queryParams);

    res.json(feedbacks);
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ error: 'Failed to fetch feedback' });
  }
});

// GET /api/feedback/stats - Get analytics and statistics
router.get('/stats', async (req, res) => {
  try {
    const { sessionId } = req.query;
    const queryParams = sessionId ? { sessionId } : {};

    const total = await Feedback.count(queryParams);
    
    const byTypeRows = await Feedback.aggregateByField('type', queryParams);
    const byType = byTypeRows.reduce((acc, row) => {
      acc[row.type] = parseInt(row.count);
      return acc;
    }, {});

    const bySentimentRows = await Feedback.aggregateByField('sentiment', queryParams);
    const bySentiment = bySentimentRows.reduce((acc, row) => {
      acc[row.sentiment] = parseInt(row.count);
      return acc;
    }, {});

    const recentCount = await Feedback.countRecent(1, queryParams);

    const stats = {
      total,
      recentCount,
      byType,
      bySentiment
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// GET /api/feedback/summary - Get AI-generated summary
router.get('/summary', async (req, res) => {
  try {
    const { sessionId } = req.query;
    const queryParams = sessionId ? { sessionId } : {};

    const feedbacks = await Feedback.findAll(queryParams);
    const limitedFeedbacks = feedbacks.slice(0, 50);

    const summary = await generateFeedbackSummary(limitedFeedbacks);

    res.json(summary);
  } catch (error) {
    console.error('Error generating summary:', error);
    res.status(500).json({ error: 'Failed to generate summary' });
  }
});

// DELETE /api/feedback/:id - Delete feedback
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const feedback = await Feedback.deleteById(id);

    if (!feedback) {
      return res.status(404).json({ error: 'Feedback not found' });
    }

    // Emit deletion event
    req.app.get('io').emit('feedback-deleted', id);

    res.json({ message: 'Feedback deleted successfully' });
  } catch (error) {
    console.error('Error deleting feedback:', error);
    res.status(500).json({ error: 'Failed to delete feedback' });
  }
});

export default router;
