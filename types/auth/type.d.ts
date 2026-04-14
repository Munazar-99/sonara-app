import { User } from '@prisma/client';

export type SessionValidationResult =
  | { session: SessionData; user: User }
  | { session: null; user: null };

export type UserId = string;

export type SessionData = {
  id: string;
  user_id: string;
  expires_at: number;
  retell_api_key: string;
};
