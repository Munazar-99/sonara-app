// services/persistRetellCall.ts

import prisma from '@/lib/prisma/prisma';
import { PersistParams } from '../types';

export async function persistRetellCall({
  dto,
  webhookEventId,
  userId,
  agentId,
  billing,
}: PersistParams) {
  const year = dto.startedAt.getUTCFullYear();

  const month = dto.startedAt.getUTCMonth() + 1;

  await prisma.$transaction(async tx => {
    const existingCall = await tx.call.findUnique({
      where: {
        retellCallId: dto.retellCallId,
      },
    });

    if (existingCall) {
      await tx.webhookEvent.update({
        where: {
          id: webhookEventId,
        },

        data: {
          status: 'PROCESSED',

          responseStatus: 200,

          processedAt: new Date(),
        },
      });

      return;
    }

    await tx.call.create({
      data: {
        retellCallId: dto.retellCallId,

        userId,

        agentId,

        startedAt: dto.startedAt,

        endedAt: dto.endedAt,

        durationSeconds: dto.durationSeconds,

        providerCost: billing.providerCost,

        customerCost: billing.customerCost,

        profit: billing.profit,

        status: dto.status,
      },
    });

    await tx.monthlyUsage.upsert({
      where: {
        userId_year_month: {
          userId,
          year,
          month,
        },
      },

      create: {
        userId,

        year,
        month,

        totalCalls: 1,

        totalDurationSec: dto.durationSeconds,

        totalProviderCost: billing.providerCost,

        totalCustomerCost: billing.customerCost,

        totalProfit: billing.profit,
      },

      update: {
        totalCalls: {
          increment: 1,
        },

        totalDurationSec: {
          increment: dto.durationSeconds,
        },

        totalProviderCost: {
          increment: billing.providerCost,
        },

        totalCustomerCost: {
          increment: billing.customerCost,
        },

        totalProfit: {
          increment: billing.profit,
        },
      },
    });

    await tx.user.update({
      where: {
        id: userId,
      },

      data: {
        lastActive: new Date(),
      },
    });

    await tx.webhookEvent.update({
      where: {
        id: webhookEventId,
      },

      data: {
        status: 'PROCESSED',

        responseStatus: 200,

        processedAt: new Date(),
      },
    });
  });
}
