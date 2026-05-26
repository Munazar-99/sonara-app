import { handleToastNotification } from '@/components/toast/HandleToast';
import { useMutation } from '@tanstack/react-query';
import { resendInviteAction } from '../server/actions/resend-invite.action';

export function useResendInvite() {
  return useMutation({
    mutationFn: async (userId: string) => await resendInviteAction(userId),
    onSuccess: response => {
      handleToastNotification(
        response.success ? 'success' : 'error',
        response.message,
        '',
      );
    },
    onError: error => {
      console.error(`Resend invite error: ${error}`);
      handleToastNotification(
        'error',
        'Unexpected Error',
        'Please try again later.',
      );
    },
  });
}
