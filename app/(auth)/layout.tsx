import Image from 'next/image';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {children}
      <div className="relative col-span-1 hidden w-full py-6 lg:block">
        <Image
          src="/login.png"
          alt="Next.js logo"
          layout="fill"
          objectFit="cover"
          priority
        />
      </div>
    </div>
  );
}
