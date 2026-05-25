import { LoginForm } from '@/features/auth/login/components/LoginForm';
import { AuthFormShell } from '@/components/ui/auth-form-shell';

export default function LoginPage() {
  return (
    <AuthFormShell>
      <LoginForm />
    </AuthFormShell>
  );
}
