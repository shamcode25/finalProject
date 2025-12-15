import pool from '../db/connection.js';

class Feedback {
  static async create(data) {
    const {
      message,
      type,
      sessionId = 'default-session',
      sentiment = 'neutral',
      aiClassification = '',
      confidence = 0
    } = data;

    const query = `
      INSERT INTO feedbacks (message, type, session_id, sentiment, ai_classification, confidence)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;

    const values = [message, type, sessionId, sentiment, aiClassification, confidence];
    const result = await pool.query(query, values);
    return this.mapRowToFeedback(result.rows[0]);
  }

  static async findAll(queryParams = {}) {
    let query = 'SELECT * FROM feedbacks WHERE 1=1';
    const values = [];
    let paramCount = 1;

    if (queryParams.sessionId) {
      query += ` AND session_id = $${paramCount}`;
      values.push(queryParams.sessionId);
      paramCount++;
    }

    if (queryParams.type) {
      query += ` AND type = $${paramCount}`;
      values.push(queryParams.type);
      paramCount++;
    }

    if (queryParams.sentiment) {
      query += ` AND sentiment = $${paramCount}`;
      values.push(queryParams.sentiment);
      paramCount++;
    }

    query += ' ORDER BY created_at DESC LIMIT 100';

    const result = await pool.query(query, values);
    return result.rows.map(row => this.mapRowToFeedback(row));
  }

  static async findById(id) {
    const query = 'SELECT * FROM feedbacks WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows.length > 0 ? this.mapRowToFeedback(result.rows[0]) : null;
  }

  static async deleteById(id) {
    const query = 'DELETE FROM feedbacks WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows.length > 0 ? this.mapRowToFeedback(result.rows[0]) : null;
  }

  static async count(queryParams = {}) {
    let query = 'SELECT COUNT(*) FROM feedbacks WHERE 1=1';
    const values = [];
    let paramCount = 1;

    if (queryParams.sessionId) {
      query += ` AND session_id = $${paramCount}`;
      values.push(queryParams.sessionId);
      paramCount++;
    }

    const result = await pool.query(query, values);
    return parseInt(result.rows[0].count);
  }

  static async aggregateByField(field, queryParams = {}) {
    let query = `SELECT ${field}, COUNT(*) as count FROM feedbacks WHERE 1=1`;
    const values = [];
    let paramCount = 1;

    if (queryParams.sessionId) {
      query += ` AND session_id = $${paramCount}`;
      values.push(queryParams.sessionId);
      paramCount++;
    }

    query += ` GROUP BY ${field}`;

    const result = await pool.query(query, values);
    return result.rows;
  }

  static async countRecent(hours = 1, queryParams = {}) {
    let query = `
      SELECT COUNT(*) FROM feedbacks 
      WHERE created_at >= NOW() - INTERVAL '${hours} hour'
    `;
    const values = [];
    let paramCount = 1;

    if (queryParams.sessionId) {
      query += ` AND session_id = $${paramCount}`;
      values.push(queryParams.sessionId);
      paramCount++;
    }

    const result = await pool.query(query, values);
    return parseInt(result.rows[0].count);
  }

  // Map PostgreSQL row to feedback object (convert snake_case to camelCase)
  static mapRowToFeedback(row) {
    if (!row) return null;
    return {
      _id: row.id.toString(),
      id: row.id.toString(),
      message: row.message,
      type: row.type,
      sessionId: row.session_id,
      sentiment: row.sentiment,
      aiClassification: row.ai_classification,
      confidence: parseFloat(row.confidence),
      timestamp: row.created_at,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }
}

export default Feedback;
