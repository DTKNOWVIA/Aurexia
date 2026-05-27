const { PrismaClient } = require('@prisma/client');

async function main() {
  const prisma = new PrismaClient();
  try {
    const res = await prisma.$queryRawUnsafe("SELECT column_name FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'mfaSecret';");
    console.log('Query result:', res);
  } catch (err) {
    console.error('Error checking column:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
