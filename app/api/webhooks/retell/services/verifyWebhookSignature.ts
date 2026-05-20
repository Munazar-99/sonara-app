import Retell from 'retell-sdk';

export function verifyWebhookSignature(
  rawBody: string,
  signature: string,
): boolean {
  return Retell.verify(rawBody, process.env.RETELL_API_KEY!, signature);
}
