import Retell from 'retell-sdk';

export function verifyWebhookSignature(
  rawBody: string,
  signature: string,
): boolean {
  if (!process.env.RETELL_API_KEY) {
    throw new Error('RETELL_API_KEY is not set in environment variables');
  }
  return Retell.verify(rawBody, process.env.RETELL_API_KEY, signature);
}
