// src/controllers/history.controller.js
const pool = require('../models/db');

exports.getHistory = async (req, res) => {
  const userId = req.user.id;
  const offset = parseInt(req.query.offset || '0', 10);
  const limit = req.query.limit ? parseInt(req.query.limit, 10) : null;

  const conn = await pool.getConnection();
  try {
    let sql = 'SELECT invoice_number, transaction_type, description, total_amount, created_on FROM transaction_history WHERE user_id = ? ORDER BY created_on DESC';
    const params = [userId];
    if (limit !== null && !Number.isNaN(limit)) {
      sql += ' LIMIT ? OFFSET ?';
      params.push(limit, offset);
    }

    const [rows] = await conn.query(sql, params);

    // Map results to expected format
    const records = rows.map(r => ({
      invoice_number: r.invoice_number,
      transaction_type: r.transaction_type,
      description: r.description,
      total_amount: parseFloat(r.total_amount),
      created_on: new Date(r.created_on).toISOString()
    }));

    return res.json({
      status: 0,
      message: 'Get History Berhasil',
      data: {
        offset: offset,
        limit: limit === null ? (records.length) : limit,
        records
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: 500, message: 'Server error', data: null });
  } finally {
    conn.release();
  }
};
