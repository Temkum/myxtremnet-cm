'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  MessageSquare,
  FileText,
  Settings,
  Church,
  LogOut,
  User,
  Menu,
  X,
} from 'lucide-react';
import { Button } from '../ui/button';
import { useLocale } from 'next-intl';
import { useAuth } from '@/lib/auth-context';
import { cn } from '@/lib/utils';

const getNavigationItems = (t: any) => [
  {
    title: t('dashboard'),
    href: '/admin/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: t('userManagement'),
    href: '/admin/users',
    icon: Users,
  },
  {
    title: t('newUser'),
    href: '/admin/users/new',
    icon: User,
  },
  {
    title: t('bundleManagement'),
    href: '/admin/bundles',
    icon: Package,
  },
  {
    title: t('productManagement'),
    href: '/admin/products',
    icon: ShoppingCart,
  },
  {
    title: t('supportManagement'),
    href: '/admin/support',
    icon: MessageSquare,
  },
  {
    title: t('auditManagement'),
    href: '/admin/audit',
    icon: FileText,
  },
  {
    title: t('bulkManagement'),
    href: '/admin/bulk',
    icon: Settings,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations('Admin');
  const navigationItems = getNavigationItems(t);
  const handleLanguageChange = (lang: string) => {
    router.push(`/${lang}${pathname.replace(`/${locale}`, '')}`);
  };

  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <>
      {/* Mobile/Tablet Menu Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        className="xl:hidden fixed top-4 left-4 z-50"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </Button>

      {/* Desktop Collapse Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        className="hidden md:flex xl:hidden fixed top-4 left-4 z-50"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? <Menu className="h-6 w-6" /> : <X className="h-6 w-6" />}
      </Button>

      {/* Sidebar */}
      <div
        className={cn(
          'fixed lg:static inset-y-0 left-0 z-40 bg-card border-r border-border min-h-screen flex flex-col transition-all duration-300 ease-in-out group hover:w-64',
          isMobileMenuOpen
            ? 'translate-x-0 w-64'
            : '-translate-x-full xl:translate-x-0',
          isCollapsed ? 'md:w-16 xl:w-64' : 'md:w-16 xl:w-64',
        )}
        onMouseEnter={() => setIsCollapsed(false)}
        onMouseLeave={() => setIsCollapsed(true)}
      >
        {/* Mobile/Tablet Close Button */}
        <div className="xl:hidden p-4 flex justify-between items-center border-b border-border">
          <span className="font-semibold">Menu</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-4 space-y-6 overflow-y-auto flex-1">
          {/* Navigation */}
          <nav className="space-y-2">
            {navigationItems.map((item) => {
              const isActive =
                pathname === item.href || pathname.endsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                  )}
                  title={item.title}
                >
                  <item.icon className="h-4 w-4 flex-shrink-0" />
                  <span
                    className={cn(
                      'whitespace-nowrap overflow-hidden transition-all duration-300',
                      isCollapsed && 'md:hidden xl:block',
                    )}
                  >
                    {item.title}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Footer Navigation */}
          <div className="pt-6 border-t border-border">
            <div className="space-y-2">
              <Link
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                title={t('home')}
              >
                <Church className="h-4 w-4 flex-shrink-0" />
                <span
                  className={cn(
                    'whitespace-nowrap overflow-hidden transition-all duration-300',
                    isCollapsed && 'md:hidden xl:block',
                  )}
                >
                  {t('home')}
                </span>
              </Link>
              <Link
                href="/admin/profile"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                title={t('profile')}
              >
                <User className="h-4 w-4 flex-shrink-0" />
                <span
                  className={cn(
                    'whitespace-nowrap overflow-hidden transition-all duration-300',
                    isCollapsed && 'md:hidden xl:block',
                  )}
                >
                  {t('profile')}
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Section - User Info, Language, Logout */}
        <div className="mt-auto p-4 border-t border-border space-y-4">
          {/* User Info */}
          {user ? (
            <div className="px-3 py-2">
              <p
                className={cn(
                  'font-medium text-sm whitespace-nowrap overflow-hidden transition-all duration-300',
                  isCollapsed && 'md:hidden xl:block',
                )}
              >
                {user.name}
              </p>
              <p
                className={cn(
                  'text-xs text-muted-foreground whitespace-nowrap overflow-hidden transition-all duration-300',
                  isCollapsed && 'md:hidden xl:block',
                )}
              >
                Service: {user.serviceId}
              </p>
            </div>
          ) : (
            <div className="px-3 py-2">
              <Button asChild className="w-full" size="sm">
                <Link href="/login">{t('login')}</Link>
              </Button>
            </div>
          )}

          {/* Language Selection */}
          <div
            className={cn(
              'flex items-center gap-2 px-3 text-sm transition-all duration-300',
              isCollapsed && 'md:hidden xl:block',
            )}
          >
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

          {/* Logout Button */}
          {user && (
            <Button
              onClick={logout}
              variant="outline"
              size="sm"
              className="w-full justify-start"
              title={t('logout')}
            >
              <LogOut className="h-4 w-4 mr-2 flex-shrink-0" />
              <span
                className={cn(
                  'whitespace-nowrap overflow-hidden transition-all duration-300',
                  isCollapsed && 'md:hidden xl:block',
                )}
              >
                {t('logout')}
              </span>
            </Button>
          )}
        </div>
      </div>

      {/* Mobile/Tablet Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 xl:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
