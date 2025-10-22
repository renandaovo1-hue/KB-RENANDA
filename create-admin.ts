import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const username = 'admin';
  const email = 'admin@example.com';
  const password = 'Alfalink14';

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
      role: 'ADMIN',
      balance: 0,
    },
  });

  console.log('Admin user created:', user);
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
