require('dotenv/config');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database with IDR prices...');

  // 1. Create Plans (Realistic Indonesian Market Prices in IDR)
  const plans = [
    {
      name: 'free',
      price: 0,
      maxRequestsDay: 500,
      features: [
        'Access to all news sources',
        'Standard search speed',
        'Community support',
        '1 API Key'
      ]
    },
    {
      name: 'pro',
      price: 149000, // Rp 149k
      maxRequestsDay: 50000,
      features: [
        'Everything in Free',
        'High-priority crawling',
        'Email support',
        'Up to 10 API Keys',
        'Full content extraction'
      ]
    },
    {
      name: 'enterprise',
      price: 1499000, // Rp 1.49M
      maxRequestsDay: 1000000,
      features: [
        'Unlimited requests',
        'Dedicated server node',
        '24/7 Priority support',
        'Custom source requests',
        'SLA 99.9%'
      ]
    }
  ];

  for (const p of plans) {
    await prisma.plan.upsert({
      where: { name: p.name },
      update: p,
      create: p
    });
  }
  console.log('✅ Plans seeded with IDR pricing.');

  // 2. Create Default Admin
  const adminEmail = 'admin@crawlgen.ai';
  const hashedPassword = await bcrypt.hash('password', 10);
  const apiKey = crypto.randomBytes(24).toString('hex');

  const admin = await prisma.user.upsert({
    where: { username: adminEmail },
    update: {
      password: hashedPassword,
      role: 'admin'
    },
    create: {
      username: adminEmail,
      password: hashedPassword,
      apiKey: apiKey,
      role: 'admin'
    }
  });

  // 3. Link Admin to Enterprise Plan
  const entPlan = await prisma.plan.findUnique({ where: { name: 'enterprise' } });
  
  const existingSub = await prisma.subscription.findFirst({
    where: { userId: admin.id }
  });

  if (existingSub) {
    await prisma.subscription.update({
      where: { id: existingSub.id },
      data: {
        planId: entPlan.id,
        status: 'active'
      }
    });
  } else {
    await prisma.subscription.create({
      data: {
        userId: admin.id,
        planId: entPlan.id,
        status: 'active'
      }
    });
  }

  console.log('✅ Admin user and enterprise subscription seeded.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
