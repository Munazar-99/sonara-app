'use server';

import { getRetellClient } from '@/lib/retell/retell';
import { getCurrentSession } from '@/utils/auth/getCurrentSession';
import { getCurrentUser } from '@/utils/auth/getCurrentUser';
import { redirect } from 'next/navigation';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { VoiceResponse } from 'retell-sdk/resources/voice.mjs';
import { SettingsData, UserInfo } from '../../types';

/**
 * Ensures the user is authenticated and returns basic user info.
 * Redirects to login if user is not found.
 */
async function requireUser(): Promise<UserInfo> {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  return {
    email: user.email,
    name: user.name,
  };
}

/**
 * Retrieves voice options from the Retell API using session-based API key.
 * Redirects to login if session is missing.
 */
async function fetchElevenLabsVoices(): Promise<VoiceResponse[]> {
  const session = await getCurrentSession();

  if (!session || !session.retell_api_key) {
    redirect('/login');
  }

  try {
    const retellClient = getRetellClient(session.retell_api_key);
    const voices = await retellClient.voice.list();

    return voices.filter(voice => voice.provider === 'elevenlabs');
  } catch (err) {
    console.error('Failed to fetch Retell voices:', err);
    return [];
  }
}

/**
 * Main settings page server action.
 * Returns user data and ElevenLabs voices.
 */
export async function settingsAction(): Promise<SettingsData | void> {
  try {
    const [user, voices] = await Promise.all([
      requireUser(),
      fetchElevenLabsVoices(),
    ]);

    return { user, voices };
  } catch (err) {
    if (isRedirectError(err)) return;

    console.error('Unexpected error in settingsAction:', err);

    return {
      user: { email: 'error@example.com', name: 'Error User' },
      voices: [],
    };
  }
}
