import express from 'express';
import Feedback from '../models/Feedback.js';
import { analyzeFeedback, generateFeedbackSummary } from '../services/openaiService.js';

const router = express.Router();

// POST /api/feedback - Submit new feedback
router.post('/', async (req, res) => {
  try {
    const { message, type, sessionId } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Analyze feedback with OpenAI
    const aiAnalysis = await analyzeFeedback(message, type);

    // Create feedback with AI analysis
    const feedback = new Feedback({
      message: message.trim(),
      type: type || 'other',
      sessionId: sessionId || 'default-session',
      sentiment: aiAnalysis.sentiment,
      aiClassification: aiAnalysis.classification,
      confidence: aiAnalysis.confidence
    });

    await feedback.save();

    // Emit to Socket.io (will be handled in server.js)
    if (req.io) {
      req.io.emit('new-feedback', feedback);
    }

    res.status(201).json({
      success: true,
      feedback: feedback
    });
  } catch (error) {
    console.error('Error creating feedback:', error);
    res.status(500).json({ error: 'Failed to create feedback' });
  }
});

// GET /api/feedback - Get all feedback
router.get('/', async (req, res) => {
  try {
    const { sessionId, type, sentiment, limit = 50 } = req.query;
    
    const query = {};
    if (sessionId) query.sessionId = sessionId;
    if (type) query.type = type;
    if (sentiment) query.sentiment = sentiment;

    const feedbacks = await Feedback.find(query)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      count: feedbacks.length,
      feedbacks: feedbacks
    });
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
    
    // Count by type
    const byType = await Feedback.aggregate([
      { $match: query },
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);

    // Count by sentiment
    const bySentiment = await Feedback.aggregate([
      { $match: query },
      { $group: { _id: '$sentiment', count: { $sum: 1 } } }
    ]);

    // Recent feedback (last hour)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentCount = await Feedback.countDocuments({
      ...query,
      timestamp: { $gte: oneHourAgo }
    });

    // Average confidence
    const avgConfidence = await Feedback.aggregate([
      { $match: query },
      { $group: { _id: null, avg: { $avg: '$confidence' } } }
    ]);

    res.json({
      success: true,
      stats: {
        total,
        recent: recentCount,
        byType: byType.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        bySentiment: bySentiment.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        avgConfidence: avgConfidence[0]?.avg || 0
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// GET /api/feedback/summary - Get AI-generated summary
router.get('/summary', async (req, res) => {
  try {
    const { sessionId, limit = 20 } = req.query;
    const query = sessionId ? { sessionId } : {};

    const feedbacks = await Feedback.find(query)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit));

    const summary = await generateFeedbackSummary(feedbacks);

    res.json({
      success: true,
      summary: summary
    });
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

    if (req.io) {
      req.io.emit('feedback-deleted', { id });
    }

    res.json({
      success: true,
      message: 'Feedback deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting feedback:', error);
    res.status(500).json({ error: 'Failed to delete feedback' });
  }
});

export default router;

