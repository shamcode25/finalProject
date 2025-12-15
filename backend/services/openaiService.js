import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Analyze sentiment and classify feedback using OpenAI
 */
export async function analyzeFeedback(message, userType) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      // Fallback if no API key
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

Respond in JSON format: {"sentiment": "positive|negative|neutral", "classification": "category", "confidence": 0.0-1.0}`;

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
    
    // Try to parse JSON response
    let analysis;
    try {
      analysis = JSON.parse(responseText);
    } catch (e) {
      // Fallback parsing if JSON is wrapped in code blocks
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Invalid JSON response');
      }
    }

    return {
      sentiment: analysis.sentiment || 'neutral',
      classification: analysis.classification || userType || 'other',
      confidence: analysis.confidence || 0.5
    };
  } catch (error) {
    console.error('OpenAI API Error:', error.message);
    // Fallback response
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
        summary: 'No feedback available for summary.',
        keyPoints: [],
        recommendations: []
      };
    }

    const feedbackTexts = feedbacks
      .slice(-20) // Last 20 feedbacks
      .map(f => `[${f.type}] ${f.message}`)
      .join('\n');

    const prompt = `Analyze the following student feedback and provide:
1. A brief summary (2-3 sentences)
2. Key points (3-5 bullet points)
3. Recommendations for the professor (2-3 actionable items)

Feedback:
${feedbackTexts}

Respond in JSON format:
{
  "summary": "brief summary text",
  "keyPoints": ["point1", "point2", ...],
  "recommendations": ["rec1", "rec2", ...]
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an AI assistant that helps professors understand student feedback. Always respond with valid JSON only."
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
    
    let summary;
    try {
      summary = JSON.parse(responseText);
    } catch (e) {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        summary = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Invalid JSON response');
      }
    }

    return {
      summary: summary.summary || 'Summary generation failed.',
      keyPoints: summary.keyPoints || [],
      recommendations: summary.recommendations || []
    };
  } catch (error) {
    console.error('OpenAI Summary Error:', error.message);
    return {
      summary: 'Unable to generate summary at this time.',
      keyPoints: [],
      recommendations: []
    };
  }
}

