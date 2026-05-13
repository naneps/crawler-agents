const db = require('../utils/db');

exports.getStats = async (req, res) => {
    try {
        const stats = await db.getGlobalStats();
        res.json({ success: true, stats });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getUsers = async (req, res) => {
    try {
        const [users] = await db.pool.query('SELECT id, username, role, created_at FROM users ORDER BY created_at DESC');
        res.json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
