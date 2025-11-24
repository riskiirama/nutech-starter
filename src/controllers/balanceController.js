// src/controllers/balance.controller.js
const pool = require('../models/db');

exports.index = async (req, res) => {
  const userId = req.user.id;

  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query('SELECT amount FROM balance WHERE user_id = ?', [userId]);
    if (!rows.length) {
      // If no balance row -> treat as zero (or return not found)
      return res.json({ status: 0, message: 'Get Balance Berhasil', data: { balance: 0 } });
    }

    const balance = parseFloat(rows[0].amount);
    return res.json({ status: 0, message: 'Get Balance Berhasil', data: { balance } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: 500, message: 'Server error', data: null });
  } finally {
    conn.release();
  }
};
