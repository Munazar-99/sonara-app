import { PhoneCallResponse } from 'retell-sdk/resources/call.mjs';
import {
  RetellCallEndedBusinessSchema,
  RetellWebhookSchema,
} from '../zod/schema';
import z from 'zod';

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

  endedAt: Date | null;

  durationSeconds: number;

  providerCost: number;
};

export type RetellWebhookBodySchema = z.infer<typeof RetellWebhookSchema>;

export type RetellCallEndedBusinessSchemaType = z.infer<
  typeof RetellCallEndedBusinessSchema
>;

export interface PersistParams {
  dto: {
    retellCallId: string;

    startedAt: Date;

    endedAt: Date | null;

    durationSeconds: number;

    status: string;
  };

  webhookEventId: string;

  userId: string;

  agentId: string;

  billing: {
    customerCost: number;

    providerCost: number;

    profit: number;
  };
}
