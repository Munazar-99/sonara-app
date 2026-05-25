'use client';

import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { useRouter } from 'next/navigation';
import { loginAction } from '@/features/auth/login/sever/actions/login.action';
import { PasswordInput } from '@/components/ui/password-input';
import RequiredFormLabel from '@/components/ui/required-form-label';
import { signInSchema } from '../utils/zod/schema';
import { handleToastNotification } from '@/components/toast/HandleToast';
import SubmitButton from '@/components/ui/submit-button';
import { useMutation } from '@tanstack/react-query';

export function LoginForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const mutation = useMutation({
    mutationFn: loginAction,
    onSuccess: response => {
      if (response && response.error) {
        handleToastNotification('error', 'Sign-in Failed', response.error);
      } else {
        router.push('/dashboard');
        handleToastNotification('success', 'Sign-in Successful!', '');
      }
    },
    onError: error => {
      console.error(`Sign-in error: ${error}`);
      handleToastNotification(
        'error',
        'Unexpected Error',
        'Please try again later.',
      );
    },
  });

  function onSubmit(data: z.infer<typeof signInSchema>) {
    mutation.mutate(data);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6"
      >
        <div className="flex flex-col gap-2">
          <p className="animate-element animate-delay-100 text-sm font-medium text-primary">
            Workspace sign in
          </p>
          <h1 className="animate-element animate-delay-100 text-3xl font-semibold tracking-normal text-dark dark:text-white">
            Welcome back
          </h1>
          <p className="animate-element animate-delay-200 max-w-sm text-sm leading-6 text-body-color dark:text-slate-400">
            Sign in to manage calls, agents, users, and workspace settings.
          </p>
        </div>
        <div className="grid gap-5">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="animate-element animate-delay-300">
                <RequiredFormLabel className="text-dark dark:text-slate-200">
                  Email
                </RequiredFormLabel>
                <FormControl>
                  <Input
                    {...field}
                    required
                    type="email"
                    placeholder="Enter your email"
                    aria-label="Email"
                    className="h-11 rounded-lg border border-slate-200 bg-slate-50 px-4 text-dark shadow-none focus-visible:ring-2 dark:border-white/10 dark:bg-white/[0.06] dark:text-white dark:placeholder:text-slate-500 dark:focus-visible:ring-primary/60"
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="animate-element animate-delay-400">
                <div className="flex items-center justify-between">
                  <RequiredFormLabel className="text-dark dark:text-slate-200">
                    Password
                  </RequiredFormLabel>
                  <Link
                    prefetch={true}
                    href="/forgot-password"
                    className="text-sm text-dark underline-offset-4 hover:underline dark:text-slate-300 dark:hover:text-primary"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <FormControl>
                  <PasswordInput
                    required
                    {...field}
                    placeholder="Enter your password"
                    aria-label="Password"
                    className="h-11 rounded-lg border border-slate-200 bg-slate-50 px-4 text-dark shadow-none focus-visible:ring-2 dark:border-white/10 dark:bg-white/[0.06] dark:text-white dark:placeholder:text-slate-500 dark:focus-visible:ring-primary/60"
                  />
                </FormControl>
                <FormMessage className="!text-red-500" />
              </FormItem>
            )}
          />
          <SubmitButton
            isSubmitting={mutation.isPending}
            loadingMessage="Please wait"
            className="animate-element animate-delay-500 h-11 rounded-lg bg-primary text-sm font-semibold text-white shadow-sm hover:bg-primary/90"
          >
            Login
          </SubmitButton>
        </div>
        <div className="text-sm">
          <p className="animate-element animate-delay-600 leading-6 text-body-color dark:text-slate-500">
            By signing in, you agree to our{' '}
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
}
