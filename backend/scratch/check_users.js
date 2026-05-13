const db = require('../src/utils/db');

async function checkUsers() {
  try {
    const [rows] = await db.pool.query('SELECT username, password FROM users');
    console.log('--- Users in Database ---');
    rows.forEach(row => {
      console.log(`Username: "${row.username}"`);
    });
    console.log('-------------------------');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkUsers();
