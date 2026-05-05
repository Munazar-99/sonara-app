export type PasswordFormValues = z.infer<typeof passwordSchema>;

export type ResetPasswordResult =
  | {
      success: true;
      userId: string;
      apiKey: string;
    }
  | {
      success: false;
      reason: 'NOT_FOUND' | 'EXPIRED' | 'ALREADY_USED';
    };

export type ResetPasswordInput = {
  token: string;
  password: string;
};
