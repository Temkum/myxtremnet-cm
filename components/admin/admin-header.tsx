'use client';

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
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  MessageSquare,
  FileText,
  Settings,
  Menu,
  User,
  LogOut,
  Globe,
  ChevronDown,
  UserCheck,
} from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import {
  Link,
  usePathname as useNextIntlPathname,
  useRouter,
} from '@/src/i18n/navigation';
import { useAuth } from '@/lib/auth-context';
import { useState, useMemo } from 'react';
import Image from 'next/image';
import { SearchForm } from './search-form';

export function AdminHeader() {
  const nextIntlPathname = useNextIntlPathname();
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations('Admin');
  const { user, logout } = useAuth();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to user management with search query using i18n routing
      router.push({
        pathname: '/admin/users',
        query: { search: searchQuery.trim() },
      });
    }
  };

  const handleMobileSearch = (e: React.FormEvent) => {
    handleSearch(e);
    setIsSheetOpen(false);
  };

  const handleLanguageChange = (newLocale: string) => {
    router.replace(nextIntlPathname, { locale: newLocale });
  };

  const navigation = useMemo(
    () => [
      { name: t('dashboard'), href: '/admin/dashboard', icon: LayoutDashboard },
      { name: t('userManagement'), href: '/admin/users', icon: Users },
      { name: t('bundleManagement'), href: '/admin/bundles', icon: Package },
      {
        name: t('productManagement'),
        href: '/admin/products',
        icon: ShoppingCart,
      },
      {
        name: t('supportManagement'),
        href: '/admin/support',
        icon: MessageSquare,
      },
      { name: t('auditManagement'), href: '/admin/audit', icon: FileText },
      { name: t('bulkManagement'), href: '/admin/bulk', icon: Settings },
    ],
    [t],
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card shadow-sm">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link href="/admin" className="flex items-center gap-3">
          <Image
            src="/camtel.webp"
            alt="Camtel"
            width={48}
            height={48}
            className="h-12 w-12 object-contain"
          />
          <div className="hidden md:block">
            <span className="text-xl font-bold text-primary">Camtel</span>
            <p className="text-xs text-muted-foreground">
              {t('camtelManagement')}
            </p>
          </div>
        </Link>

        {/* Desktop Search */}
        <div className="hidden md:flex items-center gap-2 flex-1 max-w-md mx-6">
          <SearchForm
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onSubmit={handleSearch}
          />
        </div>

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
                    {locale === 'en' ? t('english') : t('french')}
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
                  {t('english')}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleLanguageChange('fr')}
                  className={
                    locale === 'fr'
                      ? 'bg-secondary cursor-pointer mb-1'
                      : 'cursor-pointer'
                  }
                >
                  {t('french')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Admin Menu */}
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="h-5 w-5" />
                  <span className="sr-only">Admin Menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-3 py-2">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">Admin</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/admin">
                    <UserCheck className="mr-2 h-4 w-4" />
                    Admin Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin/dashboard">
                    <User className="mr-2 h-4 w-4" />
                    User View
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive" onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  {t('logout')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Mobile Menu */}
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <VisuallyHidden>
                <SheetTitle>Admin Menu</SheetTitle>
              </VisuallyHidden>
              <div className="flex flex-col gap-4 mt-6">
                {/* Mobile Search */}
                <SearchForm
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  onSubmit={handleMobileSearch}
                />

                {user && (
                  <div className="px-2 py-4 border-b border-border">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">Admin</p>
                  </div>
                )}
                <nav className="flex flex-col gap-1">
                  {navigation.map((item) => {
                    const isActive =
                      nextIntlPathname === item.href ||
                      (item.href !== '/admin/dashboard' &&
                        nextIntlPathname.startsWith(item.href + '/'));
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
                  <div className="mt-4 pt-4 border-t border-border">
                    <Link
                      href="/admin/dashboard"
                      onClick={() => setIsSheetOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-foreground hover:bg-secondary"
                    >
                      <User className="h-5 w-5" />
                      User View
                    </Link>
                  </div>
                </nav>
                <div className="mt-auto pt-4 border-t border-border">
                  <div className="flex items-center gap-2 px-3 text-sm">
                    <button
                      onClick={() => handleLanguageChange('en')}
                      className={
                        locale === 'en'
                          ? 'text-blue-500 hover:text-primary'
                          : 'hover:text-primary'
                      }
                    >
                      {t('english')}
                    </button>
                    <span>|</span>
                    <button
                      onClick={() => handleLanguageChange('fr')}
                      className={
                        locale === 'fr'
                          ? 'text-blue-500 hover:text-primary'
                          : 'hover:text-primary'
                      }
                    >
                      {t('french')}
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
