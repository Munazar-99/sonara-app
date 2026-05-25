import Image from 'next/image';
import Link from 'next/link';

type AuthFormShellProps = {
  children: React.ReactNode;
};

export function AuthFormShell({ children }: AuthFormShellProps) {
  return (
    <section className="flex min-h-0 flex-1 bg-white">
      <div className="mx-auto flex min-h-[100dvh] w-full max-w-[680px] flex-col px-6 py-6 sm:px-10 lg:px-14 xl:px-16">
        <Link
          href="/login"
          className="animate-element animate-delay-100 flex w-fit items-center gap-2 text-sm font-semibold text-dark"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white shadow-sm">
            <Image
              className="size-5"
              src="/sonara.png"
              alt="Sonara AI logo"
              width={180}
              height={38}
              priority
            />
          </span>
          Sonara AI
        </Link>

        <div className="flex flex-1 items-center py-10">
          <div className="w-full max-w-[430px]">{children}</div>
        </div>

        <p className="hidden text-xs text-slate-500 sm:block">
          Secure access for your Sonara AI workspace
        </p>
      </div>
    </section>
  );
}
