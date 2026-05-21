import prisma from '@/lib/prisma/prisma';

export async function callAlreadyProcessed(retellCallId: string) {
  const existing = await prisma.call.findUnique({
    where: {
      retellCallId,
    },
  });

  return !!existing;
}
