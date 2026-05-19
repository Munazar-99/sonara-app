import prisma from '@/lib/prisma/prisma';

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const AdminApiKey = process.env.ADMIN_API_KEY;
  const AdminAgentId = process.env.ADMIN_AGENT_ID;

  if (!adminEmail || !AdminApiKey || !AdminAgentId)
    throw new Error('One or more required environment variables are missing');

  const existing = await prisma.user.findFirst({
    where: { role: 'admin' },
  });

  if (existing) {
    console.log('Admin already exists');
    return;
  }

  const adminUser = await prisma.user.create({
    data: {
      email: adminEmail,
      name: 'System Admin',
      apiKey: AdminApiKey,
      role: 'admin',
      status: 'active',
      billingRate: 0,
      currentMonthCalls: 0,
      currentMonthMinutes: 0,
      currentMonthCost: 0,
    },
  });

  console.log('Admin created');
  const agent = await prisma.agent.upsert({
    where: {
      retellAgentId: AdminAgentId,
    },
    update: {},
    create: {
      retellAgentId: AdminAgentId,
      name: 'LexAI Test Agent',
      userId: adminUser.id,
    },
  });

  console.log('Test agent ready:', agent.id);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
