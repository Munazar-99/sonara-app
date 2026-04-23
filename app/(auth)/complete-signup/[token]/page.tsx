import CompleteSignupForm from '@/features/auth/complete-signup/components/CompleteSignupForm';
import Image from 'next/image';

export default async function CompleteSignupPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const token = (await params).token;

  return (
    <div className="flex flex-col gap-2 bg-white p-6 md:p-10">
      <div className="flex justify-center gap-2 md:justify-start">
        <a href="#" className="flex items-center gap-2 font-medium text-dark">
          <div className="flex h-6 w-6 items-center justify-center rounded-md">
            <Image
              className="size-4"
              src="/sonara.png"
              alt="Sonara AI logo"
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
          <CompleteSignupForm token={token} />
        </div>
      </div>
    </div>
  );
}
