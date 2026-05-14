const db = require('./src/utils/db');
const prisma = require('./src/utils/prisma');
const sourcesConfig = require('./src/config/sources');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

async function seed() {
  console.log('🚀 Starting Prisma Data Migration...');
  
  try {
    // 1. Initialize Plans (Ensure plans exist)
    const plans = [
      { name: 'free', price: 0, maxRequestsDay: 500, features: { sources: 'all' } },
      { name: 'pro', price: 29.00, maxRequestsDay: 50000, features: { sources: 'all', support: 'email' } },
      { name: 'enterprise', price: 999.00, maxRequestsDay: 999999, features: { sources: 'all', sla: '99.9%' } }
    ];

    for (const p of plans) {
      await prisma.plan.upsert({
        where: { name: p.name },
        update: p,
        create: p
      });
    }
    console.log('✅ Plans initialized.');

    // 2. Migrate Sources
    for (const [id, config] of Object.entries(sourcesConfig)) {
      console.log(`📦 Migrating source: ${config.name} (${id})...`);
      await db.upsertSource(
        id,
        config.name,
        config.baseUrl,
        config.categories,
        config.selectors
      );
    }

    // 3. Default Admin User
    const adminEmail = 'admin@crawlgen.ai';
    const adminPass = 'password';
    
    let admin = await db.getUserByUsername(adminEmail);
    if (!admin) {
      console.log(`👤 Creating default admin: ${adminEmail}...`);
      const hashedPassword = await bcrypt.hash(adminPass, 10);
      const apiKey = crypto.randomBytes(24).toString('hex');
      admin = await db.createUser(adminEmail, hashedPassword, apiKey, 'admin');
      console.log('✅ Admin user created.');
    } else {
      console.log('ℹ️ Admin user already exists. Resetting password...');
      const hashedPassword = await bcrypt.hash(adminPass, 10);
      await prisma.user.update({
        where: { id: admin.id },
        data: { password: hashedPassword }
      });
      console.log('✅ Admin password updated.');
    }

    console.log('\n✨ Database sync complete!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Sync failed:', error.stack);
    process.exit(1);
  }
}

seed();
