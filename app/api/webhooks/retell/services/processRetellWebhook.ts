// services/processRetellWebhook.ts

import { mapRetellCall } from './mapRetellCall';

import { resolveInternalUser } from './resolveInternalUser';

import { calculateBilling } from './calculateBilling';

import { persistRetellCall } from './persistRetellCall';
import { RetellCallEndedBusinessSchemaType } from '../types';

export async function processRetellWebhook(
  body: RetellCallEndedBusinessSchemaType,
  webhookEventId: string,
) {
  const dto = mapRetellCall(body);

  const agent = await resolveInternalUser(dto.retellAgentId);

  const billing = calculateBilling(
    dto.durationSeconds,

    dto.providerCost,
  );

  await persistRetellCall({
    dto,

    webhookEventId,

    userId: agent.userId,

    agentId: agent.id,

    billing,
  });
}
