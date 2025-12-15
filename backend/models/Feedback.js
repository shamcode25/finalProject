import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['confused', 'too-fast', 'too-slow', 'great', 'question', 'other'],
    default: 'other'
  },
  sessionId: {
    type: String,
    default: 'default-session'
  },
  sentiment: {
    type: String,
    enum: ['positive', 'negative', 'neutral'],
    default: 'neutral'
  },
  aiClassification: {
    type: String,
    default: ''
  },
  confidence: {
    type: Number,
    default: 0
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export default mongoose.model('Feedback', feedbackSchema);

