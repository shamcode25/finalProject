import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Analyze sentiment and classify feedback using OpenAI
 */
export async function analyzeFeedback(message, userType) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      // Fallback if no API key is provided
      return {
        sentiment: 'neutral',
        classification: userType || 'other',
        confidence: 0.5
      };
    }

    const prompt = `Analyze the following student feedback and provide:
1. Sentiment: positive, negative, or neutral
2. Classification: one of these categories - confused, too-fast, too-slow, great, question, or other
3. Confidence: a number between 0 and 1

Feedback: "${message}"
User selected type: ${userType}

Respond in JSON format:
{
  "sentiment": "positive|negative|neutral",
  "classification": "confused|too-fast|too-slow|great|question|other",
  "confidence": 0.0-1.0
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an AI assistant that analyzes student feedback. Always respond with valid JSON only."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 150
    });

    const responseText = completion.choices[0].message.content.trim();
    // Extract JSON from response (handle cases where response might have markdown)
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const analysis = JSON.parse(jsonMatch[0]);
      return {
        sentiment: analysis.sentiment || 'neutral',
        classification: analysis.classification || userType || 'other',
        confidence: analysis.confidence || 0.5
      };
    }

    // Fallback if parsing fails
    return {
      sentiment: 'neutral',
      classification: userType || 'other',
      confidence: 0.5
    };
  } catch (error) {
    console.error('OpenAI API Error:', error.message);
    console.error('Error details:', error.response?.data || error);
    // Return fallback values on error
    return {
      sentiment: 'neutral',
      classification: userType || 'other',
      confidence: 0.5
    };
  }
}

/**
 * Generate a summary of feedback for professors
 */
export async function generateFeedbackSummary(feedbacks) {
  try {
    if (!process.env.OPENAI_API_KEY || feedbacks.length === 0) {
      return {
        summary: 'No feedback available to summarize.',
        keyInsights: [],
        recommendations: []
      };
    }

    const feedbackText = feedbacks
      .slice(-20) // Last 20 feedbacks
      .map(f => `[${f.type}] ${f.message}`)
      .join('\n');

    const prompt = `As an educational consultant, analyze the following student feedback from a class session and provide:
1. A brief summary (2-3 sentences)
2. Key insights (3-5 bullet points)
3. Actionable recommendations (2-3 suggestions)

Student Feedback:
${feedbackText}

Respond in JSON format:
{
  "summary": "brief summary text",
  "keyInsights": ["insight1", "insight2", ...],
  "recommendations": ["recommendation1", "recommendation2", ...]
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an educational consultant helping professors improve their teaching. Always respond with valid JSON only."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.5,
      max_tokens: 300
    });

    const responseText = completion.choices[0].message.content.trim();
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    return {
      summary: 'Unable to generate summary at this time.',
      keyInsights: [],
      recommendations: []
    };
  } catch (error) {
    console.error('OpenAI Summary Error:', error.message);
    return {
      summary: 'Error generating summary. Please try again later.',
      keyInsights: [],
      recommendations: []
    };
  }
}
