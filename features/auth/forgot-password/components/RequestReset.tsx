'use client';

import { Input } from '@/components/ui/input';
import Link from 'next/link';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { handleToastNotification } from '@/components/toast/HandleToast';
import { requestResetAction } from '../server/actions/request-reset.action';
import { emailSchema } from '../utils/zod/schema';
import { EmailFormValues } from '../utils/types/type';
import SubmitButton from '@/components/ui/submit-button';
import RequiredFormLabel from '@/components/ui/required-form-label';
import { useMutation } from '@tanstack/react-query';

const RequestReset = () => {
  const form = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: '',
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: EmailFormValues) => await requestResetAction(data),
    onSuccess: response => {
      if (response && response.error) {
        handleToastNotification('error', '', response.error);
      } else {
        handleToastNotification('success', 'Reset Link Sent!', '');
      }
    },
    onError: error => {
      console.error(`Password reset request error: ${error}`);
      handleToastNotification(
        'error',
        'Unexpected Error',
        'Please try again later.',
      );
    },
  });

  function onSubmit(data: EmailFormValues) {
    mutation.mutate(data);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <div className="flex flex-col items-center text-center">
          <h1 className="text-2xl font-bold text-dark">Forgot Password?</h1>
          <p className="text-sm text-body-color">
            Enter your email and we&apos;ll send you a reset link
          </p>
        </div>
        <div className="grid gap-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <RequiredFormLabel className="text-dark">
                  Email
                </RequiredFormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    {...field}
                    className="border-stroke text-dark focus:border-primary"
                  />
                </FormControl>
                <FormMessage className="!text-red-500" />
              </FormItem>
            )}
          />
          <SubmitButton
            isSubmitting={mutation.isPending}
            loadingMessage="Sending Reset Link..."
            className="bg-primary text-white hover:bg-primary/90"
          >
            Send Reset Link
          </SubmitButton>
        </div>
        <div className="text-center text-sm">
          <p className="text-body-color">
            Remember your password?{' '}
            <Link href="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </Form>
  );
};

export default RequestReset;
