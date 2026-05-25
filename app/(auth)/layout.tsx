import { AuthHeroSection } from '@/components/ui/auth-hero-section';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-[100dvh] bg-white text-foreground">
      <div className="font-geist flex min-h-[100dvh] w-full flex-col md:flex-row">
        {children}
        <AuthHeroSection />
      </div>
    </div>
  );
}
