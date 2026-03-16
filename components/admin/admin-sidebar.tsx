'use client';

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
} from 'lucide-react';
import Image from 'next/image';
import { Button } from '../ui/button';
import { useLocale } from 'next-intl';
import { useAuth } from '@/lib/auth-context';

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
  const currentLanguage = locale === 'fr' ? 'Français' : 'English';
  const { user, logout } = useAuth();

  return (
    <div className="w-64 bg-card border-r border-border min-h-screen flex flex-col">
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 pb-6 border-b border-border">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Image src="/camtel.png" alt="Camtel" width={40} height={40} />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">{t('adminPanel')}</h2>
            <p className="text-sm text-muted-foreground">
              {t('camtelManagement')}
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </Link>
            );
          })}
        </nav>

        {/* Footer Navigation */}
        <div className="pt-6 border-t border-border">
          <div className="space-y-2">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <LayoutDashboard className="h-4 w-4" />
              {t('dashboard')}
            </Link>
            <Link
              href="/"
              className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <Church className="h-4 w-4" />
              <span>{t('home')}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Section - User Info, Language, Logout */}
      <div className="mt-auto p-4 border-t border-border space-y-4">
        {/* User Info */}
        {user ? (
          <div className="px-3 py-2">
            <p className="font-medium text-sm">{user.name}</p>
            <p className="text-xs text-muted-foreground">
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

        {/* Logout Button */}
        {user && (
          <Button
            onClick={logout}
            variant="outline"
            size="sm"
            className="w-full justify-start"
          >
            <LogOut className="h-4 w-4 mr-2" />
            {t('logout')}
          </Button>
        )}
      </div>
    </div>
  );
}
