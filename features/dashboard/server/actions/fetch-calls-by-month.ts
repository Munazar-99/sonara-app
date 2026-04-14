'use server';

import { getCurrentSession } from '@/utils/auth/getCurrentSession';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { redirect } from 'next/navigation';
import { PhoneCallResponse } from 'retell-sdk/resources/index.mjs';
import {
  getMonthRange,
  formatTimeAgo,
  generateChartData,
  formatDuration,
} from '../../utils';
import {
  CallMetrics,
  ChartDataPoint,
  SentimentDataPoint,
  DisconnectionDataPoint,
  RecentCall,
  ConcurrencyData,
  MetricsData,
} from '../../types';
import { getRetellClient } from '@/lib/retell/retell';

/**
 * Fetches call metrics for the selected month.
 *
 * @param selectedMonth - The month (1-12) for which to fetch call metrics.
 * @returns A promise resolving to the metrics data or an error response.
 */
export async function fetchMonthlyCallMetrics(selectedMonth: number): Promise<{
  success: boolean;
  error?: string;
  data?: {
    metrics: CallMetrics;
    chartData: ChartDataPoint[];
    sentimentData: SentimentDataPoint[];
    disconnectionData: DisconnectionDataPoint[];
    recentCalls: RecentCall[];
  };
}> {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return redirect('/login');
    }

    // Get start/end timestamps for the month
    const { startOfMonth, endOfMonth } = getMonthRange(selectedMonth);

    // Initialize Retell client
    const retellClient = getRetellClient(session.retell_api_key);

    // Fetch concurrency and call records in parallel
    const [concurrencyResponse, callResponse] = await Promise.all([
      retellClient.concurrency.retrieve(),
      retellClient.call.list({
        sort_order: 'descending',
        filter_criteria: {
          call_type: ['phone_call'],
          call_status: ['ended'],
          start_timestamp: {
            lower_threshold: startOfMonth,
            upper_threshold: endOfMonth,
          },
        },
      }) as Promise<PhoneCallResponse[]>,
    ]);

    const concurrency: ConcurrencyData = {
      maxCalls: concurrencyResponse.concurrency_limit ?? 0,
      currentCalls: concurrencyResponse.current_concurrency ?? 0,
    };

    // Initialize metrics and recent calls data.
    const metricsData: MetricsData = {
      totalCalls: 0,
      totalDuration: 0,
      dailyMetrics: new Map<number, number>(),
      sentimentCounts: { positive: 0, neutral: 0, negative: 0 },
      disconnectionCounts: { userHangup: 0, agentHangup: 0, systemError: 0 },
    };

    const recentCalls: RecentCall[] = [];
    const now = Date.now();

    // Process each call record once.
    callResponse.forEach((call, index) => {
      const callStart = call.start_timestamp ?? 0;
      metricsData.totalCalls++;
      const callDuration = call.call_cost?.total_duration_seconds ?? 0;
      metricsData.totalDuration += callDuration;

      // Update daily call count (using day-of-month)
      const day = new Date(callStart).getDate();
      metricsData.dailyMetrics.set(
        day,
        (metricsData.dailyMetrics.get(day) || 0) + 1,
      );

      // Update sentiment counts.
      const sentiment = (
        call.call_analysis?.user_sentiment ?? 'neutral'
      ).toLowerCase();
      if (sentiment in metricsData.sentimentCounts) {
        metricsData.sentimentCounts[
          sentiment as keyof typeof metricsData.sentimentCounts
        ]++;
      }

      // Update disconnection reason counts.
      const reason = call.disconnection_reason ?? 'unknown';
      if (reason === 'user_hangup') {
        metricsData.disconnectionCounts.userHangup++;
      } else if (reason === 'agent_hangup') {
        metricsData.disconnectionCounts.agentHangup++;
      } else if (reason.startsWith('error_')) {
        metricsData.disconnectionCounts.systemError++;
      }

      // Build recent calls list (first 5).
      if (index < 5) {
        recentCalls.push({
          id: call.call_id,
          dateTime: callStart,
          start: callStart,
          end: call.end_timestamp ?? 0,
          direction: call.direction,
          callerId: call.from_number,
          duration: callDuration,
          recordingUrl: call.recording_url ?? '',
          cost: call.call_cost?.combined_cost
            ? call.call_cost.combined_cost / 100
            : 0,
          sentiment: call.call_analysis?.user_sentiment,
          transcriptObject: call.transcript_object ?? [],
          outcome: call.call_analysis?.call_successful ?? false,
          summary: call.call_analysis?.call_summary ?? '',
          disconnectionReason: call.disconnection_reason,
          timeAgo: formatTimeAgo(callStart, now),
        });
      }
    });

    // Compute aggregate metrics.
    const averageTalkTime = metricsData.totalCalls
      ? formatDuration(metricsData.totalDuration / metricsData.totalCalls)
      : '0m 0s';
    const totalUsage = Math.ceil(metricsData.totalDuration / 60);

    const chartData = generateChartData(metricsData.dailyMetrics);

    const sentimentData: SentimentDataPoint[] = [
      {
        name: 'Positive',
        value: metricsData.sentimentCounts.positive,
        color: '#22c55e',
      },
      {
        name: 'Neutral',
        value: metricsData.sentimentCounts.neutral,
        color: '#3b82f6',
      },
      {
        name: 'Negative',
        value: metricsData.sentimentCounts.negative,
        color: '#ef4444',
      },
    ];

    const disconnectionData: DisconnectionDataPoint[] = [
      {
        name: 'User Hangup',
        value: metricsData.disconnectionCounts.userHangup,
        color: '#f59e0b',
      },
      {
        name: 'Agent Hangup',
        value: metricsData.disconnectionCounts.agentHangup,
        color: '#6366f1',
      },
      {
        name: 'System Error',
        value: metricsData.disconnectionCounts.systemError,
        color: '#dc2626',
      },
    ];

    return {
      success: true,
      data: {
        metrics: {
          concurrency,
          totalCalls: metricsData.totalCalls,
          averageTalkTime,
          totalUsage,
        },
        chartData,
        sentimentData,
        disconnectionData,
        recentCalls,
      },
    };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    console.error('Error fetching monthly call metrics:', error);
    return { success: false, error: 'Failed to fetch call metrics' };
  }
}
