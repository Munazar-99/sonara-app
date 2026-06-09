'use client';

import { useSidebar } from '@/hooks/use-sidebar';
import { useStore } from '@/hooks/use-store';
import { cn } from '@/utils/utils';
import { Sidebar } from './sidebar';
import { Footer } from './footer';

export default function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sidebar = useStore(useSidebar, x => x);
  if (!sidebar) return null;
  const { getOpenState, settings } = sidebar;
  return (
    <>
      <Sidebar />
      <main
        className={cn(
          'min-h-[calc(100vh_-_56px)] bg-zinc-50 transition-[margin-left] duration-300 ease-in-out dark:bg-[#111827]',
          !settings.disabled && (!getOpenState() ? 'lg:ml-[90px]' : 'lg:ml-72'),
        )}
      >
        {children}
      </main>
      <footer
        className={cn(
          'transition-[margin-left] duration-300 ease-in-out',
          !settings.disabled && (!getOpenState() ? 'lg:ml-[90px]' : 'lg:ml-72'),
        )}
      >
        <Footer />
      </footer>
    </>
  );
}
