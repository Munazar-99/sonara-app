// services/mapRetellCall.ts

import { RetellCallDTO, RetellCallEndedBusinessSchemaType } from '../types';

export function mapRetellCall(
  body: RetellCallEndedBusinessSchemaType,
): RetellCallDTO {
  return {
    retellCallId: body.call.call_id,

    retellAgentId: body.call.agent_id,

    startedAt: new Date(body.call.start_timestamp),

    endedAt: body.call.end_timestamp
      ? new Date(body.call.end_timestamp as string | number)
      : null,

    durationSeconds: Math.floor(Number(body.call.duration_ms ?? 0) / 1000),

    providerCost:
      body.call.call_cost?.combined_cost != null
        ? body.call.call_cost.combined_cost / 100
        : 0,

    status: body.call.call_status ?? 'unknown',
  };
}
