'use client';

import React from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Wifi,
  Radio,
  Router,
  Satellite,
  Package,
  CreditCard,
  History,
  RefreshCw,
  HelpCircle,
  MessageSquare,
  Phone,
  ChevronRight,
} from 'lucide-react';
import { Button } from '../ui/button';

const offerLinks = [
  { name: 'LTE SERVICE', href: '/users/services/lte', icon: Radio },
  {
    name: 'WTTx Outdoor',
    href: '/users/services/wttx-outdoor',
    icon: Satellite,
  },
  {
    name: 'WTTx Indoor',
    href: '/users/services/wttx-indoor',
    icon: Router,
  },
  { name: 'UL Service', href: '/users/services/ul', icon: Wifi },
];

const packageLinks = [
  { name: 'LTE SERVICE', href: '/users/packages/lte', icon: Radio },
  {
    name: 'WTTx Outdoor',
    href: '/users/packages/wttx-outdoor',
    icon: Satellite,
  },
  {
    name: 'WTTx Indoor',
    href: '/users/packages/wttx-indoor',
    icon: Router,
  },
  { name: 'UL Service', href: '/users/packages/ul', icon: Wifi },
];

const serviceLinks = [
  { name: 'Account Information', href: '/users/account', icon: CreditCard },
  { name: 'Order History', href: '/users/orders', icon: History },
  { name: 'Recharge', href: '/users/recharge', icon: RefreshCw },
];

const supportLinks = [
  { name: 'FAQ', href: '/users/faq', icon: HelpCircle },
  { name: 'Feedback', href: '/users/support', icon: MessageSquare },
  { name: 'Contact Us', href: '/users/contact', icon: Phone },
];

interface SidebarSectionProps {
  title: string;
  links: { name: string; href: string; icon: React.ElementType }[];
  variant?: 'offers' | 'packages' | 'service' | 'support';
}

function SidebarSection({
  title,
  links,
  variant = 'offers',
}: SidebarSectionProps) {
  const pathname = usePathname();

  const variantColors = {
    offers: 'border-l-primary',
    packages: 'border-l-accent',
    service: 'border-l-chart-3',
    support: 'border-l-chart-4',
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader
        className={cn('py-3 px-4 border-l-4', variantColors[variant])}
      >
        <CardTitle className="text-sm font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <nav className="flex flex-col">
          {links.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center justify-between px-4 py-2.5 text-sm transition-colors border-b border-border last:border-b-0',
                  isActive
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-foreground hover:bg-secondary',
                )}
              >
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            );
          })}
        </nav>
      </CardContent>
    </Card>
  );
}

export function DashboardSidebar() {
  return (
    <aside className="w-full lg:w-72 space-y-4">
      <SidebarSection title="Offers" links={offerLinks} variant="offers" />
      <SidebarSection
        title="Packages"
        links={packageLinks}
        variant="packages"
      />
      <SidebarSection title="Service" links={serviceLinks} variant="service" />
      <SidebarSection title="Support" links={supportLinks} variant="support" />
    </aside>
  );
}

export function QuickFAQ() {
  const faqs = [
    'How do I change my default password?',
    "What's to do if I've forgot my password?",
    'How do I pay for my X-tremNet services?',
    'How do I monitor my consumption?',
  ];

  return (
    <Card>
      <CardHeader className="py-3 px-4 border-l-4 border-l-accent">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold">FAQ</CardTitle>
          <Link
            href="/users/faq"
            className="text-xs text-primary hover:underline"
          >
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <ul className="space-y-2">
          {faqs.map((faq, index) => (
            <li key={index} className="flex items-start gap-2 text-sm">
              <Badge
                variant="outline"
                className="h-5 min-w-5 flex items-center justify-center text-xs"
              >
                {index + 1}
              </Badge>
              <Link
                href="/users/faq"
                className="text-muted-foreground hover:text-primary"
              >
                {faq}
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
