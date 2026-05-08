import { LoginForm } from '@/features/auth/login/components/LoginForm';
import Image from 'next/image';

export default function LoginPage() {
  return (
    <div className="flex flex-1 flex-col gap-2 bg-white p-6 md:p-10">
      <div className="flex justify-center gap-2 md:justify-start">
        <a
          href="#"
          className="animate-element animate-delay-100 flex items-center gap-2 font-medium text-dark"
        >
          <div className="animate-element animate-delay-100 flex h-6 w-6 items-center justify-center rounded-md">
            <Image
              className="size-4"
              src="/sonara.png"
              alt="Sonara logo"
              width={180}
              height={38}
              priority
            />
          </div>
          Sorana AI
        </a>
      </div>
      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-xs">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
