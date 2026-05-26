'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { KeyRound } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { PasswordInput } from '@/components/ui/password-input';
import RequiredFormLabel from '@/components/ui/required-form-label';
import { setPasswordAction } from '@/features/auth/set-password/server/actions/set-password.action';
import { handleToastNotification } from '../../../../components/toast/HandleToast';
import { passwordSchema } from '../utils/zod/schema';
import { PasswordFormValues } from '../utils/types/type';
import SubmitButton from '@/components/ui/submit-button';

const ChangePassword = ({ token }: { token: string }) => {
  const router = useRouter();

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: PasswordFormValues) => {
      return await setPasswordAction(token, data);
    },
    onSuccess: response => {
      if (response && response.error) {
        handleToastNotification(
          'error',
          'Password reset failed',
          response.error,
        );
      } else {
        handleToastNotification('success', 'Password Reset Successfully', '');
        router.push('/dashboard');
      }
    },
    onError: () => {
      handleToastNotification(
        'error',
        'Unexpected Error',
        'Please try again later.',
      );
    },
  });

  const onSubmit = (data: PasswordFormValues) => {
    mutate(data);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <div className="animate-element animate-delay-100 mb-1 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 dark:bg-primary/15">
          <KeyRound className="h-5 w-5 text-primary" />
        </div>
        <p className="animate-element animate-delay-100 text-sm font-medium text-primary">
          Secure password setup
        </p>
        <h1 className="animate-element animate-delay-200 text-3xl font-semibold tracking-normal text-dark dark:text-white">
          Set a new password
        </h1>
        <p className="animate-element animate-delay-300 max-w-sm text-sm leading-6 text-body-color dark:text-slate-400">
          Choose a password that keeps your workspace protected.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-5">
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem className="animate-element animate-delay-400">
                <RequiredFormLabel className="dark:text-slate-200">
                  New Password
                </RequiredFormLabel>
                <FormControl>
                  <PasswordInput
                    required
                    {...field}
                    placeholder="Enter your password"
                    aria-label="Password"
                    className="h-11 rounded-lg border border-slate-200 bg-slate-50 px-4 text-dark shadow-none focus-visible:ring-2 dark:border-white/10 dark:bg-white/[0.06] dark:text-white dark:placeholder:text-slate-500 dark:focus-visible:ring-primary/60"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="animate-element animate-delay-500">
                <RequiredFormLabel className="dark:text-slate-200">
                  Confirm Password
                </RequiredFormLabel>
                <FormControl>
                  <PasswordInput
                    required
                    {...field}
                    placeholder="Confirm your password"
                    aria-label="Password"
                    className="h-11 rounded-lg border border-slate-200 bg-slate-50 px-4 text-dark shadow-none focus-visible:ring-2 dark:border-white/10 dark:bg-white/[0.06] dark:text-white dark:placeholder:text-slate-500 dark:focus-visible:ring-primary/60"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <SubmitButton
            isSubmitting={isPending}
            loadingMessage="Setting new password"
            className="animate-element animate-delay-600 h-11 w-full rounded-lg bg-primary text-sm font-semibold text-white shadow-sm hover:bg-primary/90"
          >
            Set new password
          </SubmitButton>
        </form>
      </Form>
    </div>
  );
};

export default ChangePassword;
