import { AuthTokenType } from '@prisma/client';

export const SESSION_COOKIE_NAME = 'auth_session';
export const AUTH_TOKEN_TYPE = {
  PASSWORD_RESET: 'PASSWORD_RESET',
  INVITE: 'INVITE',
} as const satisfies Record<string, AuthTokenType>;
