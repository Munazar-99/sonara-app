import RequestReset from '@/features/auth/forgot-password/components/RequestReset';
import { AuthFormShell } from '@/components/ui/auth-form-shell';

const page = () => {
  return (
    <AuthFormShell>
      <RequestReset />
    </AuthFormShell>
  );
};

export default page;
