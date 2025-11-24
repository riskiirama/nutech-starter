const pool = require('../models/db');
require('dotenv').config();
exports.banner = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(
      'SELECT banner_name, banner_image, description FROM banner'
    );

    return res.json({
      status: 0,
      message: "Sukses",
      data: rows
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: 500,
      message: "Server error",
      data: []
    });
  } finally {
    conn.release();
  }};