'use server';

import {
  CallListParams,
  PhoneCallResponse,
} from 'retell-sdk/resources/call.mjs';
import { getCurrentSession } from '@/utils/auth/getCurrentSession';
import { redirect } from 'next/navigation';
import { Call } from '../../types';
import { getRetellClient } from '@/lib/retell/retell';

// TODO:implement logging

export async function fetchCallsAction({
  limit,
  paginationKey,
  lowerThreshold,
  direction,
  searchQuery,
}: {
  limit: number;
  paginationKey?: string;
  lowerThreshold: number;
  direction?: 'inbound' | 'outbound';
  searchQuery?: string;
}): Promise<{
  success: boolean;
  error?: string;
  data: Call[];
  timestamp: string;
}> {
  const session = await getCurrentSession();
  if (!session) {
    return redirect('/login');
  }

  const todayTimestamp = new Date().getTime();

  const filterCriteria: CallListParams.FilterCriteria = {
    call_type: ['phone_call'],
    direction: direction ? [direction] : undefined,
    start_timestamp: {
      upper_threshold: todayTimestamp,
      lower_threshold: lowerThreshold,
    },
    ...(searchQuery ? { from_number: [searchQuery] } : {}),
  };

  let response: PhoneCallResponse[] = [];
  try {
    const retellClient = getRetellClient(session.retell_api_key);
    response = (await retellClient.call.list({
      limit,
      pagination_key: paginationKey,
      sort_order: 'descending',
      filter_criteria: filterCriteria,
    })) as PhoneCallResponse[];
  } catch (error) {
    console.error('Error fetching calls:', error);
    return {
      success: false,
      error: 'Failed to fetch calls',
      data: [],
      timestamp: new Date().toISOString(),
    };
  }

  const formattedCalls = response.map(call => {
    const durationSeconds = call.call_cost?.total_duration_seconds ?? 0;

    let cost = 0.5; // First minute charge

    if (durationSeconds > 60) {
      const extraSeconds = durationSeconds - 60;
      cost += extraSeconds * (0.5 / 60); // Per-second charge after the first minute
    }

    return {
      id: call.call_id,
      dateTime: call.start_timestamp ?? 0,
      start: call.start_timestamp ?? 0,
      end: call.end_timestamp ?? 0,
      direction: call.direction,
      callerId: call.from_number,
      duration: durationSeconds,
      recordingUrl: call.recording_url ?? '',
      cost: parseFloat(cost.toFixed(2)), // Keep only 2 decimal places
      sentiment: call.call_analysis?.user_sentiment,
      transcriptObject: call.transcript_object ?? [],
      outcome: call.call_analysis?.call_successful ?? false,
      summary: call.call_analysis?.call_summary ?? '',
      disconnectionReason: call.disconnection_reason,
    };
  });

  return {
    success: true,
    data: formattedCalls,
    timestamp: new Date().toISOString(),
  };
}
