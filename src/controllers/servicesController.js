const pool = require('../models/db');

exports.index = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(
      `SELECT service_code, service_name, service_icon, service_tariff FROM services`
    );

    // Jika service_icon null, beri default URL
    const data = rows.map(r => ({
      service_code: r.service_code,
      service_name: r.service_name,
      service_icon: r.service_icon
        ? r.service_icon
        : "https://nutech-integrasi.app/dummy.jpg",
      service_tariff: r.service_tariff
    }));

    return res.json({
      status: 0,
      message: "Sukses",
      data: data
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
