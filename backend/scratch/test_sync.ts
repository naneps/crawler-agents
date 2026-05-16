import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function testSync() {
  const oldId = 'b1935d38-4ca3-4e66-9be3-495d17fdebdb';
  const newId = 'NEW_GITHUB_UID_123';
  
  try {
    console.log('Testing ID update...');
    // Simulate what's happening in auth.ts
    const result = await prisma.$executeRawUnsafe(`UPDATE users SET id = '${newId}' WHERE id = '${oldId}'`);
    console.log('Update result:', result);
  } catch (err: any) {
    console.error('Update failed!', err.message);
  }
}

testSync().finally(() => prisma.$disconnect());
