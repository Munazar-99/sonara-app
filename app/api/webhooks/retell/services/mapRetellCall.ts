import { RetellCallDTO, RetellWebhookBody } from '../types';

export function mapRetellCall(body: RetellWebhookBody): RetellCallDTO {
  const call = body.call;

  return {
    retellCallId: call.call_id,

    retellAgentId: call.agent_id,

    status: call.call_status,

    startedAt: new Date(call.start_timestamp!),

    endedAt: new Date(call.end_timestamp!),

    durationSeconds: Math.floor(call.duration_ms! / 1000),

    providerCost:
      call.call_cost?.combined_cost != null
        ? call.call_cost.combined_cost / 100
        : 0,
  };
}
