export function mapResetError(
  reason: 'NOT_FOUND' | 'EXPIRED' | 'ALREADY_USED',
): string {
  switch (reason) {
    case 'NOT_FOUND':
      return 'Invalid reset link.';

    case 'EXPIRED':
      return 'Reset link has expired.';

    case 'ALREADY_USED':
      return 'Reset link has already been used.';
  }
}
