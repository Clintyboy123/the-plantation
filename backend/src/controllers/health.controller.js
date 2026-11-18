const { sequelize } = require('../models');

// GET /api/health - used by Docker's health check and for quick manual checks.
exports.check = async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({ success: true, message: 'API is operational', database: 'connected' });
  } catch (error) {
    console.error('[health] database check failed:', error.message);
    res.status(503).json({ success: false, message: 'API is running but the database is unreachable', database: 'disconnected' });
  }
};
