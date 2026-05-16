import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { sourcesConfig } from '../src/config/sources';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database with IDR prices...');

  // 0. Seed Sources
  console.log('🌱 Seeding sources...');
  const sourceEntries = Object.entries(sourcesConfig);
  for (const [id, src] of sourceEntries) {
    const s = src as any;
    await prisma.source.upsert({
      where: { id },
      update: {
        name: s.name,
        baseUrl: s.baseUrl,
        categories: s.categories,
        selectors: s.selectors
      },
      create: {
        id,
        name: s.name,
        baseUrl: s.baseUrl,
        categories: s.categories,
        selectors: s.selectors
      }
    });
  }
  console.log(`✅ ${sourceEntries.length} sources seeded.`);

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

  console.log('✅ Plans seeded with IDR pricing.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
