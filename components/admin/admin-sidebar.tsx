'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  MessageSquare,
  FileText,
  Settings,
  Wifi,
  Archive,
} from 'lucide-react';

const navigationItems = [
  {
    title: 'Dashboard',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'User Management',
    href: '/admin/users',
    icon: Users,
  },
  {
    title: 'Bundle Management',
    href: '/admin/bundles',
    icon: Package,
  },
  {
    title: 'Product Management',
    href: '/admin/products',
    icon: ShoppingCart,
  },
  {
    title: 'Support Management',
    href: '/admin/support',
    icon: MessageSquare,
  },
  {
    title: 'Audit Logs',
    href: '/admin/audit',
    icon: FileText,
  },
  {
    title: 'Bulk Operations',
    href: '/admin/bulk',
    icon: Settings,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const t = useTranslations('Account');

  return (
    <div className="w-64 bg-card border-r border-border min-h-screen p-4">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 pb-6 border-b border-border">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Wifi className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">Admin Panel</h2>
            <p className="text-sm text-muted-foreground">Camtel Management</p>
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

        {/* Footer */}
        <div className="pt-6 mt-auto border-t border-border">
          <div className="space-y-2">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <LayoutDashboard className="h-4 w-4" />
              User Dashboard
            </Link>
            <Link
              href="/"
              className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <Archive className="h-4 w-4" />
              Logout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
