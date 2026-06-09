'use client';

import Link from 'next/link';
import { Ellipsis, LogOut, Loader2 } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

import { cn } from '@/utils/utils';
import { getMenuList } from '@/utils/constants/sidebar/menu-list';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '@/components/ui/tooltip';
import { CollapseMenuButton } from './collapse-menu-button';
import { logOut } from '@/features/auth/logout/server/actions/logout.action';
import { handleToastNotification } from '@/components/toast/HandleToast';

interface MenuProps {
  isOpen: boolean | undefined;
}

export function Menu({ isOpen }: MenuProps) {
  const pathname = usePathname();
  const menuList = getMenuList();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogOut = async () => {
    setLoading(true);
    try {
      const response = await logOut();
      if (response.error) {
        console.error(response.error);
      } else {
        router.push('/login');
        handleToastNotification('success', 'Sign-out Successful!', '');
      }
    } catch (error) {
      console.error('Error during sign-out:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollArea className="[&>div>div[style]]:!block">
      <nav className="mt-8 h-full w-full">
        <ul className="flex min-h-[calc(100vh-48px-36px-16px-32px)] flex-col items-start space-y-1 px-2 lg:min-h-[calc(100vh-32px-40px-32px)]">
          {menuList.map(({ groupLabel, menus }, index) => (
            <li className={cn('w-full', groupLabel ? 'pt-5' : '')} key={index}>
              {(isOpen && groupLabel) || isOpen === undefined ? (
                <p className="max-w-[248px] truncate px-4 pb-2 text-sm font-medium text-slate-500 dark:text-slate-500">
                  {groupLabel}
                </p>
              ) : !isOpen && isOpen !== undefined && groupLabel ? (
                <TooltipProvider>
                  <Tooltip delayDuration={100}>
                    <TooltipTrigger className="w-full">
                      <div className="flex w-full items-center justify-center">
                        <Ellipsis className="h-5 w-5" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>{groupLabel}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <p className="pb-2"></p>
              )}
              {menus.map(
                ({ href, label, icon: Icon, active, submenus }, index) =>
                  !submenus || submenus.length === 0 ? (
                    <div className="w-full" key={index}>
                      <TooltipProvider disableHoverableContent>
                        <Tooltip delayDuration={100}>
                          <TooltipTrigger asChild>
                            <Button
                              variant={
                                (active === undefined &&
                                  pathname.startsWith(href)) ||
                                active
                                  ? 'secondary'
                                  : 'ghost'
                              }
                              className={cn(
                                'mb-1 h-10 w-full justify-start rounded-lg',
                                (active === undefined &&
                                  pathname.startsWith(href)) ||
                                  active
                                  ? 'bg-primary/10 text-primary hover:bg-primary/15 dark:bg-primary/15 dark:text-white dark:hover:bg-primary/20'
                                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white',
                              )}
                              asChild
                            >
                              <Link href={href}>
                                <span
                                  className={cn(isOpen === false ? '' : 'mr-4')}
                                >
                                  <Icon size={18} />
                                </span>
                                <p
                                  className={cn(
                                    'max-w-[200px] truncate',
                                    isOpen === false
                                      ? '-translate-x-96 opacity-0'
                                      : 'translate-x-0 opacity-100',
                                  )}
                                >
                                  {label}
                                </p>
                              </Link>
                            </Button>
                          </TooltipTrigger>
                          {isOpen === false && (
                            <TooltipContent className="" side="right">
                              {label}
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  ) : (
                    <div className="w-full" key={index}>
                      <CollapseMenuButton
                        icon={Icon}
                        label={label}
                        active={
                          active === undefined
                            ? pathname.startsWith(href)
                            : active
                        }
                        submenus={submenus}
                        isOpen={isOpen}
                      />
                    </div>
                  ),
              )}
            </li>
          ))}
          <li className="flex w-full grow items-end">
            <TooltipProvider disableHoverableContent>
              <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                  <Button
                    onClick={handleLogOut}
                    variant="outline"
                    className="mt-5 h-10 w-full justify-center rounded-lg border-slate-200 bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-950 dark:border-white/10 dark:bg-[#111827] dark:text-slate-300 dark:hover:bg-primary/20 dark:hover:text-white"
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : (
                      <LogOut size={18} />
                    )}
                    <p
                      className={cn(
                        'whitespace-nowrap',
                        isOpen === false ? 'hidden opacity-0' : 'opacity-100',
                      )}
                    >
                      {loading ? 'Signing out...' : 'Sign out'}
                    </p>
                  </Button>
                </TooltipTrigger>
                {isOpen === false && (
                  <TooltipContent side="right">Sign out</TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </li>
        </ul>
      </nav>
    </ScrollArea>
  );
}
