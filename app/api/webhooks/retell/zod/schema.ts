// schema.ts

import { z } from 'zod';

/**
 * =========================================================
 * MINIMAL EXTERNAL CONTRACT
 * =========================================================
 */

const BaseCallSchema = z
  .object({
    call_id: z.string(),

    agent_id: z.string(),
  })
  .passthrough();

export const RetellWebhookSchema = z
  .object({
    event: z.string(),

    call: BaseCallSchema,
  })
  .passthrough();

export const RetellCallEndedBusinessSchema = z
  .object({
    event: z.literal('call_ended'),

    call: BaseCallSchema.extend({
      start_timestamp: z.coerce.number(),

      end_timestamp: z.coerce.number(),

      duration_ms: z.coerce.number(),

      call_status: z.string().optional(),

      transcript: z.string().optional(),

      recording_url: z.string().optional(),

      call_cost: z
        .object({
          combined_cost: z.coerce.number().optional(),
        })
        .passthrough()
        .optional(),
    }),
  })
  .passthrough();

/**
 * =========================================================
 * TYPES
 * =========================================================
 */
