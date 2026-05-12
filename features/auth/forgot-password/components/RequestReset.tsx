'use client';

import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
    <div className="flex items-center justify-center bg-white p-4">
      <Card className="w-full max-w-lg !border-none bg-white shadow-none">
        <CardHeader>
          <div className="mb-4 flex w-full justify-center">
            <div className="animate-element animate-delay-100 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              {mutation.isPending ? (
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              ) : (
                <Mail className="h-6 w-6 text-primary" />
              )}
            </div>
          </div>
          <CardTitle className="animate-element animate-delay-200 text-center text-2xl text-dark">
            Reset Password
          </CardTitle>
          <CardDescription className="animate-element animate-delay-300 text-center">
            Enter your email address and we&#39;ll send you a link to reset your
            password
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
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
                        className="border-stroke text-dark focus:border-primary"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <SubmitButton
                className="animate-element animate-delay-500 w-full"
                isSubmitting={mutation.isPending}
                loadingMessage="Sending Reset Link"
              >
                Send Reset Link
              </SubmitButton>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default RequestReset;
