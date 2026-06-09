import { handleToastNotification } from '@/components/toast/HandleToast';
import { UserStatus } from '@prisma/client';
import { useMutation } from '@tanstack/react-query';
import { updateUserStatusAction } from '../server/actions/update-user-status.action';

export function useUpdateUserStatus() {
  return useMutation({
    mutationFn: async (data: { id: string; status: UserStatus }) =>
      await updateUserStatusAction(data),
    onSuccess: response => {
      handleToastNotification(
        response.success ? 'success' : 'error',
        response.message,
        '',
      );
    },
    onError: error => {
      console.error(`User status update error: ${error}`);
      handleToastNotification(
        'error',
        'Unexpected Error',
        'Please try again later.',
      );
    },
  });
}
