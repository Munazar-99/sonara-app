import prisma from '@/lib/prisma/prisma';

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const AdminApiKey = process.env.ADMIN_API_KEY;

  if (!adminEmail || !AdminApiKey)
    throw new Error('ADMIN_EMAIL or ADMIN_API_KEY missing');

  const existing = await prisma.user.findFirst({
    where: { role: 'admin' },
  });

  if (existing) {
    console.log('Admin already exists');
    return;
  }

  await prisma.user.create({
    data: {
      email: adminEmail,
      name: 'System Admin',
      apiKey: AdminApiKey,
      role: 'admin',
      status: 'active',
      billingRate: 0,
      callsMade: 0,
      minutesUsed: 0,
      currentSpend: 0,
    },
  });

  console.log('Admin created');
}

main()
  .then(() => prisma.$disconnect())
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
