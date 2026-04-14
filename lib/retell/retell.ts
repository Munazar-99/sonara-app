import { decrypt } from '@/features/users/utils/crypto';
import Retell from 'retell-sdk';

/**
 * Returns a new instance of the Retell client using the provided API key.
 * @param apiKey - The Retell API key to use for this session/request.
 * @returns An initialized Retell client.
 */
export function getRetellClient(apiKey: string): Retell {
  if (!apiKey) {
    throw new Error('Missing Retell API key.');
  }
  const decryptedApiKey = decrypt(apiKey);

  return new Retell({ apiKey: decryptedApiKey });
}
