'use server';

import { PhoneCallResponse } from 'retell-sdk/resources/index.mjs';
import { getCurrentSession } from '@/utils/auth/getCurrentSession';
import { redirect } from 'next/navigation';
import { Call } from '../../types';
import { dateRanges } from '../../utils';
import { getRetellClient } from '@/lib/retell/retell';

export async function getInitialCallsAction({
  limit,
}: {
  limit: number;
}): Promise<{
  success: boolean;
  error?: string;
  data: Call[];
  timestamp: string;
}> {
  const session = await getCurrentSession();
  if (!session) {
    console.log(new Date().toISOString(), 'No session found');
    return redirect('/login');
  }

  let response: PhoneCallResponse[] = [];
  const todayTimestamp = new Date().getTime();

  try {
    const retellClient = getRetellClient(session.retell_api_key);
    response = (await retellClient.call.list({
      filter_criteria: {
        call_type: ['phone_call'],
        start_timestamp: {
          upper_threshold: todayTimestamp,
          lower_threshold: dateRanges['month'].lowerThreshold,
        },
      },
      limit,
      sort_order: 'descending',
    })) as PhoneCallResponse[];
  } catch (error) {
    console.error('Error fetching initial calls:', error);
    return {
      success: false,
      error: 'Failed to fetch initial calls',
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
