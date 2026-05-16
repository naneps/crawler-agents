import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function check() {
  const email = 'ekaprasetya2244@gmail.com';
  const user = await prisma.user.findFirst({
    where: { username: email }
  });
  console.log('User found:', user);
}

check().finally(() => prisma.$disconnect());
