'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
          'Reset Link Expired',
          'Please Request a new Password Reset Link',
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
    <div className="flex items-center justify-center bg-white p-4">
      <Card className="w-full max-w-lg border-none bg-white shadow-none">
        <CardHeader>
          <div className="mb-4 flex w-full justify-center">
            <div className="animate-element animate-delay-100 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <KeyRound className="h-6 w-6 text-primary" />
            </div>
          </div>
          <CardTitle className="animate-element animate-delay-200 text-center text-2xl text-dark">
            Change Password
          </CardTitle>
          <CardDescription className="animate-element animate-delay-300 text-center">
            Enter your new password below
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem className="animate-element animate-delay-400">
                    <RequiredFormLabel>New Password</RequiredFormLabel>
                    <FormControl>
                      <PasswordInput
                        required
                        {...field}
                        placeholder="Enter your password"
                        aria-label="Password"
                        className="border-stroke focus:border-primary"
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
                    <RequiredFormLabel>Confirm Password</RequiredFormLabel>
                    <FormControl>
                      <PasswordInput
                        required
                        {...field}
                        placeholder="Confirm your password"
                        aria-label="Password"
                        className="border-stroke focus:border-primary"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <SubmitButton
                isSubmitting={isPending}
                loadingMessage="Setting New Password"
                className="animate-element animate-delay-600 w-full"
              >
                Set New Password
              </SubmitButton>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default ChangePassword;
