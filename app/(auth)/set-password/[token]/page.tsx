import SetPasswordForm from '@/features/auth/set-password/components/SetPasswordForm';
import { AuthFormShell } from '@/components/ui/auth-form-shell';

export default async function Page({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const token = (await params).token;

  return (
    <AuthFormShell>
      <SetPasswordForm token={token} />
    </AuthFormShell>
  );
}
