import db  from './src/utils/db';
import bcrypt  from 'bcryptjs';

async function createAdmin() {
    try {
        const username = 'admin';
        const password = 'admin123';
        const hashedPassword = await bcrypt.hash(password, 10);
        const apiKey = 'cg-' + Math.random().toString(36).substring(2, 15);
        
        // Check if exists
        const existing = await db.getUserByUsername(username);
        if (existing) {
            console.log('User admin already exists.');
            process.exit(0);
        }

        await db.createUser(username, hashedPassword, apiKey, 'admin');
        console.log('✅ Admin user created successfully!');
        console.log('Username: ' + username);
        console.log('Password: ' + password);
        process.exit(0);
    } catch (error) {
        console.error('❌ Failed to create admin:', error);
        process.exit(1);
    }
}

createAdmin();
