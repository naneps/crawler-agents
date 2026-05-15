const db = require('../src/utils/db');

async function migrate() {
    console.log('Starting migration...');
    const connection = await db.pool.getConnection();
    try {
        // 1. Make key_id nullable
        console.log('Modifying key_id to be nullable...');
        await connection.query('ALTER TABLE api_logs MODIFY key_id INT NULL');
        
        // 2. Add user_id and source columns if they don't exist
        const [columns] = await connection.query('SHOW COLUMNS FROM api_logs');
        const hasUserId = columns.some(c => c.Field === 'user_id');
        const hasSource = columns.some(c => c.Field === 'source');

        if (!hasUserId) {
            console.log('Adding user_id column...');
            await connection.query('ALTER TABLE api_logs ADD COLUMN user_id INT NULL AFTER key_id');
            await connection.query('ALTER TABLE api_logs ADD CONSTRAINT fk_logs_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE');
            console.log('Added user_id column.');
        } else {
            console.log('user_id column already exists.');
        }

        if (!hasSource) {
            console.log('Adding source column...');
            await connection.query("ALTER TABLE api_logs ADD COLUMN source ENUM('api', 'web') DEFAULT 'api' AFTER user_id");
            console.log('Added source column.');
        } else {
            console.log('source column already exists.');
        }

        console.log('Migration completed successfully.');
    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        connection.release();
        process.exit();
    }
}

migrate();
