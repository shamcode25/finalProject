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
    const feedback = new Feedback({
      message,
      type,
      sessionId: sessionId || 'default-session',
      sentiment: aiAnalysis.sentiment,
      aiClassification: aiAnalysis.classification,
      confidence: aiAnalysis.confidence
    });

    await feedback.save();

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
    const query = {};

    if (sessionId) query.sessionId = sessionId;
    if (type) query.type = type;
    if (sentiment) query.sentiment = sentiment;

    const feedbacks = await Feedback.find(query)
      .sort({ timestamp: -1 })
      .limit(100);

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
    const query = sessionId ? { sessionId } : {};

    const total = await Feedback.countDocuments(query);
    
    const byType = await Feedback.aggregate([
      { $match: query },
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);

    const bySentiment = await Feedback.aggregate([
      { $match: query },
      { $group: { _id: '$sentiment', count: { $sum: 1 } } }
    ]);

    const recentCount = await Feedback.countDocuments({
      ...query,
      timestamp: { $gte: new Date(Date.now() - 60 * 60 * 1000) } // Last hour
    });

    const stats = {
      total,
      recentCount,
      byType: byType.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      bySentiment: bySentiment.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {})
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
    const query = sessionId ? { sessionId } : {};

    const feedbacks = await Feedback.find(query)
      .sort({ timestamp: -1 })
      .limit(50);

    const summary = await generateFeedbackSummary(feedbacks);

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
    const feedback = await Feedback.findByIdAndDelete(id);

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
