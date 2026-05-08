import { AuthHeroSection } from '@/components/ui/auth-hero-section';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white text-foreground">
      <div className="font-geist flex h-[100dvh] w-[100dvw] flex-col md:flex-row">
        {children}
        <AuthHeroSection />
      </div>
    </div>
  );
}
