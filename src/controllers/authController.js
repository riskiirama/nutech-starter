const pool = require('../models/db');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
require('dotenv').config();


// Pastikan folder uploads ada
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `profile_${req.user.id}${ext}`);
  }
});

// Filter hanya JPEG & PNG
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['.jpeg', '.jpg', '.png'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'profile_image'));
  }
};
exports.upload = multer({ storage, fileFilter });

// ==================================================
// REGISTER
// ==================================================
exports.register = async (req, res) => {
  const { email, first_name, last_name, password } = req.body;

  if (!email || !first_name || !last_name || !password) {
    return res.status(400).json({
      status: 101,
      message: "Parameter tidak lengkap",
      data: null
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      status: 102,
      message: "Parameter email tidak sesuai format",
      data: null
    });
  }

  const conn = await pool.getConnection();
  try {
    const [check] = await conn.query("SELECT id FROM users WHERE email = ?", [email]);

    if (check.length) {
      return res.status(409).json({
        status: 103,
        message: "Email sudah digunakan",
        data: null
      });
    }

    const hash = await bcrypt.hash(password, 10);

    const [result] = await conn.query(
      `INSERT INTO users (email, first_name, last_name, password)
       VALUES (?, ?, ?, ?)`,
      [email, first_name, last_name, hash]
    );

    await conn.query(
      "INSERT INTO balance (user_id, amount) VALUES (?, ?)",
      [result.insertId, 0]
    );

    return res.json({
      status: 0,
      message: "Registrasi berhasil silahkan login",
      data: null
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: 500,
      message: "Server error",
      data: null
    });
  } finally {
    conn.release();
  }
};


// ==================================================
// LOGIN
// ==================================================
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      status: 101,
      message: "Parameter tidak lengkap",
      data: null
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      status: 102,
      message: "Parameter email tidak sesuai format",
      data: null
    });
  }

  const conn = await pool.getConnection();

  try {
    const [rows] = await conn.query(
      "SELECT id, email, first_name, last_name, password FROM users WHERE email = ?",
      [email]
    );

    if (!rows.length) {
      return res.status(401).json({
        status: 103,
        message: "Username atau password salah",
        data: null
      });
    }

    const user = rows[0];

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({
        status: 103,
        message: "Username atau password salah",
        data: null
      });
    }

    const tokenPayload = {
      id: user.id,
      email: user.email
    };

    const token = jwt.sign(
      {
        data: Buffer.from(JSON.stringify(tokenPayload)).toString("base64")
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    return res.json({
      status: 0,
      message: "Login Sukses",
      data: { token }
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: 500,
      message: "Server error",
      data: null
    });
  } finally {
    conn.release();
  }
};

// ==================================================
// GET PROFILE
// ==================================================
exports.getProfile = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(
      `SELECT email, first_name, last_name, 
              CONCAT(first_name, ' ', last_name) AS name,
              profile_image
       FROM users WHERE id = ?`,
      [req.user.id]
    );

    if (!rows.length) {
      return res.status(404).json({
        status: 404,
        message: "User tidak ditemukan",
        data: null
      });
    }

    const user = rows[0];

    return res.json({
      status: 0,
      message: "Sukses",
      data: {
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        name: user.name,
        profile_image: user.profile_image
          ? `http://192.168.1.8:3000/uploads/${user.profile_image}`
          : null
      }
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: 500,
      message: "Server error",
      data: null
    });
  } finally {
    conn.release();
  }
};
// ==================================================
// UPDATE PROFILE
// ==================================================
exports.updateProfile = async (req, res) => {
  const { first_name, last_name } = req.body;

  if (!first_name || !last_name) {
    return res.status(400).json({
      status: 101,
      message: "Parameter tidak lengkap",
      data: null
    });
  }

  const conn = await pool.getConnection();
  try {
    // Cek user
    const [check] = await conn.query('SELECT id FROM users WHERE id = ?', [req.user.id]);
    if (!check.length) {
      return res.status(404).json({
        status: 404,
        message: "User tidak ditemukan",
        data: null
      });
    }

    // Update data
    await conn.query(
      `UPDATE users SET first_name = ?, last_name = ? WHERE id = ?`,
      [first_name, last_name, req.user.id]
    );

    // Ambil data terbaru
    const [rows] = await conn.query(
      'SELECT email, first_name, last_name, profile_image FROM users WHERE id = ?',
      [req.user.id]
    );

    const user = rows[0];

    return res.json({
      status: 0,
      message: "Update Profile berhasil",
      data: {
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        profile_image: user.profile_image
          ? `http://192.168.1.8:3000/uploads/${user.profile_image}`
          : null
      }
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: 500,
      message: "Server error",
      data: null
    });
  } finally {
    conn.release();
  }
};

// ==================================================
// UPDATE PROFILE IMAGE
// ==================================================
exports.updateProfileImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      status: 102,
      message: "Format Image tidak sesuai",
      data: null
    });
  }

  const conn = await pool.getConnection();
  try {
    // Update profile_image
    await conn.query(
      `UPDATE users SET profile_image = ? WHERE id = ?`,
      [req.file.filename, req.user.id]
    );

    // Ambil data user terbaru
    const [rows] = await conn.query(
      'SELECT email, first_name, last_name, profile_image FROM users WHERE id = ?',
      [req.user.id]
    );

    const user = rows[0];

    return res.json({
      status: 0,
      message: "Update Profile Image berhasil",
      data: {
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        profile_image: user.profile_image
          ? `http://192.168.1.8:3000/uploads/${user.profile_image}`
          : null
      }
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: 500,
      message: "Server error",
      data: null
    });
  } finally {
    conn.release();
  }
};
