'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { PasswordInput } from '@/components/ui/password-input';
import RequiredFormLabel from '@/components/ui/required-form-label';
import { handleToastNotification } from '@/components/toast/HandleToast';
import SubmitButton from '@/components/ui/submit-button';
import { completeSignupAction } from '../server/actions/complete-signup.action';
import { completeSignupSchema } from '../utils/zod/schema';
import type { CompleteSignupFormValues } from '../utils/types/type';

const CompleteSignupForm = ({ token }: { token: string }) => {
  const router = useRouter();

  const form = useForm<CompleteSignupFormValues>({
    resolver: zodResolver(completeSignupSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: CompleteSignupFormValues) => {
      return await completeSignupAction(token, data);
    },
    onSuccess: response => {
      if (response && response.error) {
        handleToastNotification('error', 'Signup Failed', response.error);
      } else {
        handleToastNotification('success', 'Account Created Successfully!', '');
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

  const onSubmit = (data: CompleteSignupFormValues) => {
    mutate(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6"
      >
        <div className="flex flex-col gap-2">
          <p className="animate-element animate-delay-100 text-sm font-medium text-primary">
            Account invitation
          </p>
          <h1 className="animate-element animate-delay-200 text-3xl font-semibold tracking-normal text-dark">
            Complete your signup
          </h1>
          <p className="animate-element animate-delay-300 max-w-sm text-sm leading-6 text-body-color">
            Create a secure password to activate your Sonara AI workspace.
          </p>
        </div>
        <div className="grid gap-5">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="animate-element animate-delay-400">
                <RequiredFormLabel className="text-dark">
                  Password
                </RequiredFormLabel>
                <FormControl>
                  <PasswordInput
                    required
                    {...field}
                    placeholder="Enter your password"
                    aria-label="Password"
                    className="h-11 rounded-lg border border-slate-200 bg-slate-50 px-4 text-dark shadow-none focus-visible:ring-2"
                  />
                </FormControl>
                <FormMessage className="!text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="animate-element animate-delay-500">
                <RequiredFormLabel className="text-dark">
                  Confirm Password
                </RequiredFormLabel>
                <FormControl>
                  <PasswordInput
                    required
                    {...field}
                    placeholder="Confirm your password"
                    aria-label="Confirm Password"
                    className="h-11 rounded-lg border border-slate-200 bg-slate-50 px-4 text-dark shadow-none focus-visible:ring-2"
                  />
                </FormControl>
                <FormMessage className="!text-red-500" />
              </FormItem>
            )}
          />
          <SubmitButton
            isSubmitting={isPending}
            loadingMessage="Creating Account..."
            className="animate-element animate-delay-600 h-11 rounded-lg bg-primary text-sm font-semibold text-white shadow-sm hover:bg-primary/90"
          >
            Complete Signup
          </SubmitButton>
        </div>
        <div className="text-sm">
          <p className="animate-element animate-delay-700 text-body-color">
            Already have an account?{' '}
            <Link href="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
        <div className="text-sm">
          <p className="animate-element animate-delay-800 text-body-color">
            By signing up, you agree to our{' '}
            <Link href="/terms" className="text-primary hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </form>
    </Form>
  );
};

export default CompleteSignupForm;
