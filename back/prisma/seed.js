import { resolve } from 'node:path';
import { readFileSync } from 'node:fs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const file = resolve('prisma', 'seeders.json');
  const seed = JSON.parse(readFileSync(file, 'utf-8'));

  // Inserir dados na tabela users
  for (const user of seed.users) {
    await prisma.user.create({
      data: user,
    });
  }

  // Inserir dados na tabela traffic
  for (const traffic of seed.traffic) {
    await prisma.traffic.create({
      data: traffic,
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });