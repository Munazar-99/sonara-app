import { PhoneCallResponse } from 'retell-sdk/resources/call.mjs';

export type RetellWebhookBody = {
  event: string;

  event_timestamp: number;

  call: PhoneCallResponse;
};

export type RetellCallDTO = {
  retellCallId: string;

  retellAgentId: string;

  status: string;

  startedAt: Date;

  endedAt: Date;

  durationSeconds: number;

  providerCost: number;
};
