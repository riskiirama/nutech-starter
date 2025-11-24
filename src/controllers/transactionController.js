// src/controllers/transaction.controller.js
const pool = require('../models/db');

/**
 * Generate invoice number format: INVYYYYMMDDHHMMSS-<random4>
 */
function generateInvoice() {
  const d = new Date();
  const stamp = d.toISOString().replace(/[-:T.Z]/g, '').slice(0, 14);
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `INV${stamp}-${rand}`;
}

/**
 * Transaction Controller
 */




exports.index = async (req, res) => {
  try {
    const userId = req.user.id; // Ambil user dari JWT
    const offset = parseInt(req.query.offset) || 0;
    const limit = parseInt(req.query.limit) || 10;

    const conn = await pool.getConnection();
    try {
      // Ambil total transaksi user (opsional)
      const [totalRows] = await conn.query(
        'SELECT COUNT(*) AS total FROM transaction_history WHERE user_id = ?',
        [userId]
      );
      const total = totalRows[0].total;

      // Ambil transaction history dengan limit & offset
      const [rows] = await conn.query(
        `SELECT invoice_number, transaction_type, description, total_amount, created_on
         FROM transaction_history
         WHERE user_id = ?
         ORDER BY created_on DESC
         LIMIT ? OFFSET ?`,
        [userId, limit, offset]
      );

      return res.json({
        status: 0,
        message: 'Get History Berhasil',
        data: {
          offset,
          limit,
          total,
          records: rows
        }
      });

    } catch (err) {
      console.error(err);
      return res.status(500).json({ status: 500, message: 'Server error', data: null });
    } finally {
      conn.release();
    }

  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: 500, message: 'Server error', data: null });
  }
};

exports.store = async (req, res) => {
  try {
    const userId = req.user.id; // Ambil user dari JWT
    const { service_code } = req.body;

    if (!service_code) {
      return res.status(400).json({
        status: 102,
        message: 'Service atau Layanan tidak ditemukan',
        data: null
      });
    }

    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      // Cari service di database
      const [serviceRows] = await conn.query(
        'SELECT service_code, service_name, service_tariff FROM services WHERE service_code = ?',
        [service_code]
      );

      if (!serviceRows.length) {
        return res.status(400).json({
          status: 102,
          message: 'Service atau Layanan tidak ditemukan',
          data: null
        });
      }

      const service = serviceRows[0];

      // Lock dan cek saldo user
      const [balanceRows] = await conn.query(
        'SELECT amount FROM balance WHERE user_id = ? FOR UPDATE',
        [userId]
      );

      const currentBalance = balanceRows.length ? parseFloat(balanceRows[0].amount) : 0;

      if (currentBalance < service.service_tariff) {
        return res.status(400).json({
          status: 103,
          message: 'Saldo tidak mencukupi',
          data: null
        });
      }

      // Kurangi saldo
      const newBalance = currentBalance - service.service_tariff;
      if (balanceRows.length) {
        await conn.query('UPDATE balance SET amount = ? WHERE user_id = ?', [newBalance, userId]);
      } else {
        // jika saldo belum ada (jarang) buat row
        await conn.query('INSERT INTO balance (user_id, amount) VALUES (?, ?)', [userId, newBalance]);
      }

      // Insert transaction_history sebagai PAYMENT
      const invoiceNumber = generateInvoice();
      await conn.query(
        `INSERT INTO transaction_history 
          (user_id, invoice_number, transaction_type, description, total_amount, created_on)
         VALUES (?, ?, ?, ?, ?, NOW())`,
        [userId,invoiceNumber, service.service_code, `Pembayaran ${service.service_name}`, service.service_tariff]
      );

      await conn.commit();

      // Response sukses
      return res.json({
        status: 0,
        message: 'Transaksi berhasil',
        data: {
          invoice_number: invoiceNumber,
          service_code: service.service_code,
          service_name: service.service_name,
          transaction_type: 'PAYMENT',
          total_amount: service.service_tariff,
          created_on: new Date().toISOString()
        }
      });

    } catch (err) {
      await conn.rollback();
      console.error(err);
      return res.status(500).json({ status: 500, message: 'Server error', data: null });
    } finally {
      conn.release();
    }

  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: 500, message: 'Server error', data: null });
  }
};
