'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  Home,
  Package,
  Settings,
  HelpCircle,
  Menu,
  User,
  LogOut,
  Key,
  Globe,
  ChevronDown,
  Rss,
} from 'lucide-react';
import { useActivePath } from '@/hooks/use-active-path';
import { useAuth } from '@/lib/auth-context';

export function DashboardHeader() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const { checkActive } = useActivePath();
  const { user, logout } = useAuth();

  // Navigation labels come from translations
  const navigation = [
    { nameKey: 'nav.dashboard', href: '/dashboard', icon: Home },
    { nameKey: 'nav.bundles', href: '/dashboard/bundles', icon: Rss },
    { nameKey: 'nav.product', href: '/dashboard/services', icon: Package },
    { nameKey: 'nav.account', href: '/dashboard/account', icon: Settings },
    { nameKey: 'nav.support', href: '/dashboard/support', icon: HelpCircle },
  ];

  const switchLocale = (newLocale: string) => {
    // useRouter from next-intl navigation preserves the current path
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card shadow-sm">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <img
            src="/camtel.png"
            alt="Camtel"
            className="h-12 w-12 object-contain"
          />
          <div className="hidden md:block">
            <span className="text-xl font-bold text-primary">Camtel</span>
            <p className="text-xs text-muted-foreground">{t('nav.tagline')}</p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'px-4 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer',
                checkActive(item.href)
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-secondary',
              )}
            >
              {t(item.nameKey)}
            </Link>
          ))}
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          <div className="hidden md:flex items-center gap-1 text-sm text-muted-foreground">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1.5 text-muted-foreground transition-all duration-200 hover:text-foreground"
                >
                  <Globe className="h-4 w-4" />
                  <span className="hidden sm:inline">
                    {locale === 'en'
                      ? t('language.english')
                      : t('language.french')}
                  </span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="animate-in fade-in-0 zoom-in-95"
              >
                <DropdownMenuItem
                  onClick={() => switchLocale('en')}
                  className={cn(
                    'cursor-pointer',
                    locale === 'en' && 'bg-secondary',
                  )}
                >
                  {t('language.english')}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => switchLocale('fr')}
                  className={cn(
                    'cursor-pointer',
                    locale === 'fr' && 'bg-secondary',
                  )}
                >
                  {t('language.french')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* User Menu or Login Button */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="h-5 w-5" />
                  <span className="sr-only">{t('auth.userMenu')}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-3 py-2">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {user.phoneNumber}
                  </p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/account">
                    <User className="mr-2 h-4 w-4" />
                    {t('auth.profile')}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings">
                    <Key className="mr-2 h-4 w-4" />
                    {t('auth.changePassword')}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive cursor-pointer"
                  onClick={logout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  {t('auth.logout')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild>
              <Link href="/login">{t('auth.login')}</Link>
            </Button>
          )}

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <div className="flex flex-col gap-4 mt-6">
                {user ? (
                  <div className="px-2 py-4 border-b border-border">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {user.phoneNumber}
                    </p>
                  </div>
                ) : (
                  <div className="px-2 py-4 border-b border-border">
                    <Button asChild className="w-full">
                      <Link href="/login">{t('auth.login')}</Link>
                    </Button>
                  </div>
                )}

                <nav className="flex flex-col gap-1">
                  {navigation.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          'flex items-center gap-3 px-3 py-2 rounded-md transition-colors',
                          checkActive(item.href)
                            ? 'bg-primary text-primary-foreground'
                            : 'text-foreground hover:bg-secondary',
                        )}
                      >
                        <Icon className="h-5 w-5" />
                        {t(item.nameKey)}
                      </Link>
                    );
                  })}
                </nav>

                {/* Mobile Language Switcher — fixed bugs from original */}
                <div className="mt-auto pt-4 border-t border-border">
                  <div className="flex items-center gap-2 px-3 text-sm">
                    <button
                      onClick={() => switchLocale('en')}
                      className={cn(
                        'hover:text-primary transition-colors',
                        locale === 'en' && 'text-primary font-medium',
                      )}
                    >
                      {t('language.english')}
                    </button>
                    <span className="text-muted-foreground">|</span>
                    <button
                      onClick={() => switchLocale('fr')}
                      className={cn(
                        'hover:text-primary transition-colors',
                        locale === 'fr' && 'text-primary font-medium',
                      )}
                    >
                      {t('language.french')}
                    </button>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
