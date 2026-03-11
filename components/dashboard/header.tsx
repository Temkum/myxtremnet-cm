'use client';

import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { VisuallyHidden } from '@/components/ui/visually-hidden';
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
import { useTranslations, useLocale } from 'next-intl';
import {
  Link,
  redirect,
  usePathname as useNextIntlPathname,
  useRouter,
} from '@/src/i18n/navigation';
import { useActivePath } from '@/hooks/use-active-path';
import { useAuth } from '@/lib/auth-context';
import { useState } from 'react';

export function DashboardHeader() {
  const pathname = usePathname();
  const nextIntlPathname = useNextIntlPathname();
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations();
  const { checkActive } = useActivePath();
  const { user, logout } = useAuth();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const navigation = [
    { name: t('Navigation.home'), href: '/dashboard', icon: Home },
    { name: t('Navigation.bundles'), href: '/dashboard/bundles', icon: Rss },
    {
      name: t('Navigation.product'),
      href: '/dashboard/services',
      icon: Package,
    },
    {
      name: t('Navigation.account'),
      href: '/dashboard/account',
      icon: Settings,
    },
    {
      name: t('Navigation.support'),
      href: '/dashboard/support',
      icon: HelpCircle,
    },
  ];

  const handleLanguageChange = (newLocale: string) => {
    router.replace(nextIntlPathname, { locale: newLocale });
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
            <p className="text-xs text-muted-foreground">
              {t('Footer.tagline')}
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navigation.map((item) => {
            const isActive =
              item.href === '/dashboard'
                ? nextIntlPathname === item.href
                : nextIntlPathname === item.href ||
                  nextIntlPathname.startsWith(item.href + '/');

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'px-4 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-secondary',
                )}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Language Toggle */}
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
                      ? t('Language.english')
                      : t('Language.french')}
                  </span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="animate-in fade-in-0 zoom-in-95"
              >
                <DropdownMenuItem
                  onClick={() => handleLanguageChange('en')}
                  className={
                    locale === 'en'
                      ? 'bg-secondary cursor-pointer mb-1'
                      : 'cursor-pointer'
                  }
                >
                  {t('Language.english')}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleLanguageChange('fr')}
                  className={
                    locale === 'fr'
                      ? 'bg-secondary cursor-pointer mb-1'
                      : 'cursor-pointer'
                  }
                >
                  {t('Language.french')}
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
                  <span className="sr-only">{t('Auth.userMenu')}</span>
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
                    {t('User.profile')}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings">
                    <Key className="mr-2 h-4 w-4" />
                    {t('User.changePassword')}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive" onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  {t('Auth.logout')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild>
              <Link href="/login">{t('Auth.login')}</Link>
            </Button>
          )}

          {/* Mobile Menu */}
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">{t('Auth.toggleMenu')}</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <VisuallyHidden>
                <SheetTitle>{t('Navigation.menu')}</SheetTitle>
              </VisuallyHidden>
              <div className="flex flex-col gap-4 mt-6">
                {user ? (
                  <div className="px-2 py-4 border-b border-border">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Service: {user.phoneNumber}
                    </p>
                  </div>
                ) : (
                  <div className="px-2 py-4 border-b border-border">
                    <Button asChild className="w-full">
                      <Link href="/login" onClick={() => setIsSheetOpen(false)}>
                        {t('Auth.login')}
                      </Link>
                    </Button>
                  </div>
                )}
                <nav className="flex flex-col gap-1">
                  {navigation.map((item) => {
                    const isActive =
                      item.href === '/dashboard'
                        ? nextIntlPathname === item.href
                        : nextIntlPathname === item.href ||
                          nextIntlPathname.startsWith(item.href + '/');
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsSheetOpen(false)}
                        className={cn(
                          'flex items-center gap-3 px-3 py-2 rounded-md transition-colors',
                          isActive
                            ? 'bg-primary text-primary-foreground'
                            : 'text-foreground hover:bg-secondary',
                        )}
                      >
                        <Icon className="h-5 w-5" />
                        {item.name}
                      </Link>
                    );
                  })}
                </nav>
                <div className="mt-auto pt-4 border-t border-border">
                  <div className="flex items-center gap-2 px-3 text-sm">
                    <button
                      onClick={() => handleLanguageChange('fr')}
                      className={
                        locale === 'fr'
                          ? 'text-blue-500 hover:text-primary'
                          : ''
                      }
                    >
                      {t('Language.english')}
                    </button>
                    <span>|</span>
                    <button
                      onClick={() => handleLanguageChange('fr')}
                      className="hover:text-primary"
                    >
                      {t('Language.french')}
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
