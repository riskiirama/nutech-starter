// src/middlewares/auth.middleware.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) {
      return res.status(401).json({ status: 108, message: 'Token tidak valid atau kadaluwarsa', data: null });
    }

    const token = auth.split(' ')[1];
    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
      return res.status(401).json({ status: 108, message: 'Token tidak valid atau kadaluwarsa', data: null });
    }

    // token structure: { data: "<base64 json>" }
    if (!payload || !payload.data) {
      return res.status(401).json({ status: 108, message: 'Token tidak valid atau kadaluwarsa', data: null });
    }

    let decoded;
    try {
      const json = Buffer.from(payload.data, 'base64').toString('utf8');
      decoded = JSON.parse(json);
    } catch (e) {
      return res.status(401).json({ status: 108, message: 'Token tidak valid atau kadaluwarsa', data: null });
    }

    // attach user info to request
    req.user = {
      id: decoded.id,
      email: decoded.email
    };

    next();
  } catch (err) {
    console.error('Auth middleware error', err);
    return res.status(401).json({ status: 108, message: 'Token tidak valid atau kadaluwarsa', data: null });
  }
};
