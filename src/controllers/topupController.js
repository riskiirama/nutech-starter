// src/controllers/topup.controller.js
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
 * Top Up Balance Controller
 */
exports.store = async (req, res) => {
  try {
    // Ambil user_id dari payload JWT
    const userId = req.user.id;

    // Ambil amount dari body
    const { top_up_amount } = req.body;

    // Validasi amount
    const numericAmount = parseFloat(top_up_amount);
    if (!top_up_amount || Number.isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({
        status: 102,
        message: 'Paramter amount hanya boleh angka dan tidak boleh lebih kecil dari 0',
        data: null
      });
    }

    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      const invoiceNumber = generateInvoice();

      // Insert transaction_history sebagai TOPUP
      await conn.query(
        `INSERT INTO transaction_history 
          (user_id, invoice_number, transaction_type, description, total_amount, created_on)
         VALUES (?, ?, 'TOPUP', ?, ?, NOW())`,
        [userId, invoiceNumber, 'Top Up balance', numericAmount]
      );

      // Lock dan update balance
      const [balanceRows] = await conn.query(
        'SELECT amount FROM balance WHERE user_id = ? FOR UPDATE',
        [userId]
      );

      let newBalance;
      if (!balanceRows.length) {
        // Jika belum ada saldo, buat baru
        await conn.query(
          'INSERT INTO balance (user_id, amount) VALUES (?, ?)',
          [userId, numericAmount]
        );
        newBalance = numericAmount;
      } else {
        const currentBalance = parseFloat(balanceRows[0].amount);
        newBalance = currentBalance + numericAmount;
        await conn.query(
          'UPDATE balance SET amount = ? WHERE user_id = ?',
          [newBalance, userId]
        );
      }

      await conn.commit();

      // Response sukses hanya menampilkan balance
      return res.json({
        status: 0,
        message: 'Top Up Balance berhasil',
        data: {
          balance: newBalance
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
