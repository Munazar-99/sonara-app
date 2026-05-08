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
        className="flex flex-col gap-4"
      >
        <div className="flex flex-col items-center text-center">
          <h1 className="animate-element animate-delay-100 text-2xl font-bold text-dark">
            Welcome Back!
          </h1>
          <p className="animate-element animate-delay-200 text-sm text-body-color">
            Please sign in to continue
          </p>
        </div>
        <div className="grid gap-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="animate-element animate-delay-300">
                <RequiredFormLabel className="text-dark">
                  Email
                </RequiredFormLabel>
                <FormControl>
                  <Input
                    {...field}
                    required
                    type="email"
                    placeholder="Enter your email"
                    aria-label="Email"
                    className="focus:border-none! border-stroke text-dark"
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
                  <RequiredFormLabel className="text-dark">
                    Password
                  </RequiredFormLabel>
                  <Link
                    prefetch={true}
                    href="/forgot-password"
                    className="text-sm text-dark underline-offset-4 hover:underline"
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
                    className="border-stroke focus:border-primary"
                  />
                </FormControl>
                <FormMessage className="!text-red-500" />
              </FormItem>
            )}
          />
          <SubmitButton
            isSubmitting={mutation.isPending}
            loadingMessage="Please wait"
            className="animate-element animate-delay-500 rounded-lg bg-primary text-white hover:bg-primary/90"
          >
            Login
          </SubmitButton>
        </div>
        <div className="text-center text-sm">
          <p className="animate-element animate-delay-600 text-body-color">
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
