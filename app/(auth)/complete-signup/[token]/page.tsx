import CompleteSignupForm from '@/features/auth/complete-signup/components/CompleteSignupForm';
import { AuthFormShell } from '@/components/ui/auth-form-shell';

export default async function CompleteSignupPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const token = (await params).token;

  return (
    <AuthFormShell>
      <CompleteSignupForm token={token} />
    </AuthFormShell>
  );
}
