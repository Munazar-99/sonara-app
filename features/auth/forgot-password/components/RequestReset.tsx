'use client';

import { Input } from '@/components/ui/input';
import { Loader2, Mail } from 'lucide-react';
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
        handleToastNotification('success', 'Reset Password Sent', '');
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
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <div className="animate-element animate-delay-100 mb-1 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10">
          {mutation.isPending ? (
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          ) : (
            <Mail className="h-5 w-5 text-primary" />
          )}
        </div>
        <p className="animate-element animate-delay-100 text-sm font-medium text-primary">
          Password recovery
        </p>
        <h1 className="animate-element animate-delay-200 text-3xl font-semibold tracking-normal text-dark">
          Reset your password
        </h1>
        <p className="animate-element animate-delay-300 max-w-sm text-sm leading-6 text-body-color">
          Enter your email and we&apos;ll send a secure reset link if your
          account exists.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-5">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="animate-element animate-delay-400">
                <RequiredFormLabel>Email</RequiredFormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    {...field}
                    className="h-11 rounded-lg border border-slate-200 bg-slate-50 px-4 text-dark shadow-none focus-visible:ring-2"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <SubmitButton
            className="animate-element animate-delay-500 h-11 w-full rounded-lg bg-primary text-sm font-semibold text-white shadow-sm hover:bg-primary/90"
            isSubmitting={mutation.isPending}
            loadingMessage="Sending reset link"
          >
            Send reset link
          </SubmitButton>
        </form>
      </Form>
    </div>
  );
};

export default RequestReset;
