const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'crawlgen',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function initDb() {
  const connection = await pool.getConnection();
  try {
    // Sources Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS sources (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        baseUrl TEXT NOT NULL,
        categories JSON NOT NULL,
        selectors JSON NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Users Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        api_key VARCHAR(100) UNIQUE NOT NULL,
        role ENUM('admin', 'user') DEFAULT 'user',
        plan ENUM('free', 'pro', 'enterprise') DEFAULT 'free',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Add plan column if upgrading existing DB
    try {
      await connection.query(`ALTER TABLE users ADD COLUMN plan ENUM('free','pro','enterprise') DEFAULT 'free'`);
    } catch (_) { /* column already exists */ }

    // API Keys Table (New)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS api_keys (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        name VARCHAR(100) NOT NULL,
        key_value VARCHAR(100) UNIQUE NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // API Logs Table (New)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS api_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        key_id INT NOT NULL,
        endpoint VARCHAR(255) NOT NULL,
        method VARCHAR(10) NOT NULL,
        status_code INT NOT NULL,
        response_time INT NOT NULL,
        ip_address VARCHAR(45),
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (key_id) REFERENCES api_keys(id) ON DELETE CASCADE
      )
    `);
  } finally {
    connection.release();
  }
}

module.exports = {
  pool,
  initDb,
  // CRUD operations
  async getAllSources() {
    const [rows] = await pool.query('SELECT * FROM sources ORDER BY name ASC');
    return rows;
  },
  async getSourceById(id) {
    const [rows] = await pool.query('SELECT * FROM sources WHERE id = ?', [id]);
    return rows[0];
  },
  async upsertSource(id, name, baseUrl, categories, selectors) {
    const [rows] = await pool.query(
      'INSERT INTO sources (id, name, baseUrl, categories, selectors) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE name=?, baseUrl=?, categories=?, selectors=?',
      [id, name, baseUrl, JSON.stringify(categories), JSON.stringify(selectors), name, baseUrl, JSON.stringify(categories), JSON.stringify(selectors)]
    );
    return rows;
  },
  async deleteSource(id) {
    const [rows] = await pool.query('DELETE FROM sources WHERE id = ?', [id]);
    return rows;
  },
  // User & API Key Operations
  async getUserByUsername(username) {
    const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    return rows[0];
  },
  async getUserById(id) {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0];
  },
  async getUserByApiKey(apiKey) {
    const [rows] = await pool.query('SELECT * FROM users WHERE api_key = ?', [apiKey]);
    return rows[0];
  },
  async createUser(username, hashedPassword, apiKey, role = 'user') {
    const [rows] = await pool.query(
      'INSERT INTO users (username, password, api_key, role) VALUES (?, ?, ?, ?)',
      [username, hashedPassword, apiKey, role]
    );
    return rows;
  },
  async updateApiKey(userId, newApiKey) {
    const [rows] = await pool.query('UPDATE users SET api_key = ? WHERE id = ?', [newApiKey, userId]);
    return rows;
  },
  
  // Multi-API Key Operations
  async getUserApiKeys(userId) {
    const [rows] = await pool.query('SELECT * FROM api_keys WHERE user_id = ? ORDER BY created_at DESC', [userId]);
    return rows;
  },

  async createApiKey(userId, name, key) {
    const [rows] = await pool.query(
      'INSERT INTO api_keys (user_id, name, key_value) VALUES (?, ?, ?)',
      [userId, name, key]
    );
    return rows;
  },

  async deleteApiKey(userId, keyId) {
    const [rows] = await pool.query('DELETE FROM api_keys WHERE id = ? AND user_id = ?', [keyId, userId]);
    return rows;
  },

  async getApiKeyByKey(key) {
    const [rows] = await pool.query('SELECT * FROM api_keys WHERE key_value = ? AND is_active = 1', [key]);
    return rows[0];
  },

  // API Logging & Stats
  async logApiRequest(keyId, endpoint, method, statusCode, responseTime, ip) {
    await pool.query(
      'INSERT INTO api_logs (key_id, endpoint, method, status_code, response_time, ip_address) VALUES (?, ?, ?, ?, ?, ?)',
      [keyId, endpoint, method, statusCode, responseTime, ip]
    );
  },

  async getApiKeyStats(userId) {
    const [rows] = await pool.query(`
      SELECT 
        ak.id, ak.name, ak.key_value, ak.created_at,
        COUNT(al.id) as total_hits,
        AVG(al.response_time) as avg_latency,
        SUM(CASE WHEN al.status_code >= 400 THEN 1 ELSE 0 END) as error_count
      FROM api_keys ak
      LEFT JOIN api_logs al ON ak.id = al.key_id
      WHERE ak.user_id = ?
      GROUP BY ak.id
      ORDER BY ak.created_at DESC
    `, [userId]);
    return rows;
  },

  async getApiKeyLogs(userId, keyId, limit = 50) {
    const [rows] = await pool.query(`
      SELECT al.* 
      FROM api_logs al
      JOIN api_keys ak ON al.key_id = ak.id
      WHERE ak.id = ? AND ak.user_id = ?
      ORDER BY al.timestamp DESC
      LIMIT ?
    `, [keyId, userId, limit]);
    return rows;
  },
  // Quota helpers
  async getTodayRequestCount(keyId) {
    const [rows] = await pool.query(
      `SELECT COUNT(*) as count FROM api_logs WHERE key_id = ? AND DATE(timestamp) = CURDATE()`,
      [keyId]
    );
    return rows[0]?.count || 0;
  },

  async getUserPlan(userId) {
    const [rows] = await pool.query('SELECT plan FROM users WHERE id = ?', [userId]);
    return rows[0]?.plan || 'free';
  },

  async setUserPlan(userId, plan) {
    await pool.query('UPDATE users SET plan = ? WHERE id = ?', [plan, userId]);
  },

  async getGlobalStats() {
    const [[users]] = await pool.query('SELECT COUNT(*) as count FROM users');
    const [[keys]] = await pool.query('SELECT COUNT(*) as count FROM api_keys');
    const [[logs]] = await pool.query('SELECT COUNT(*) as count FROM api_logs');
    const [[sources]] = await pool.query('SELECT COUNT(*) as count FROM sources');
    
    // Get activity over last 7 days
    const [activity] = await pool.query(`
      SELECT DATE(timestamp) as date, COUNT(*) as hits 
      FROM api_logs 
      WHERE timestamp > DATE_SUB(NOW(), INTERVAL 7 DAY)
      GROUP BY DATE(timestamp)
      ORDER BY date ASC
    `);

    return {
      totalUsers: users.count,
      totalKeys: keys.count,
      totalLogs: logs.count,
      totalSources: sources.count,
      activity
    };
  },
  pool
};
