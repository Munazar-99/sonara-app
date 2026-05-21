import prisma from '@/lib/prisma/prisma';

export async function resolveInternalUser(retellAgentId: string) {
  const agent = await prisma.agent.findUnique({
    where: {
      retellAgentId,
    },

    include: {
      user: true,
    },
  });

  if (!agent) {
    throw new Error(
      `No internal agent mapping found for Retell agent: ${retellAgentId}`,
    );
  }

  return agent;
}
