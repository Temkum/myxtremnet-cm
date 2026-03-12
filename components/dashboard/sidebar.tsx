'use client';

import React from 'react';

import { Link } from '@/i18n/navigation';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Wifi,
  Radio,
  Router,
  Satellite,
  CreditCard,
  History,
  RefreshCw,
  HelpCircle,
  MessageSquare,
  Phone,
  ChevronRight,
} from 'lucide-react';

import { useTranslations } from 'next-intl';

const offerLinks = [
  { id: 'lte', name: 'LTE SERVICE', href: '/dashboard/services/lte', icon: Radio },
  {
    id: 'wttx-outdoor',
    name: 'WTTx Outdoor',
    href: '/dashboard/services/wttx-outdoor',
    icon: Satellite,
  },
  {
    id: 'wttx-indoor',
    name: 'WTTx Indoor',
    href: '/dashboard/services/wttx-indoor',
    icon: Router,
  },
  { id: 'ul', name: 'UL Service', href: '/dashboard/services/ul', icon: Wifi },
];

const packageLinks = [
  { id: 'lte', name: 'LTE SERVICE', href: '/dashboard/packages/lte', icon: Radio },
  {
    id: 'wttx-outdoor',
    name: 'WTTx Outdoor',
    href: '/dashboard/packages/wttx-outdoor',
    icon: Satellite,
  },
  {
    id: 'wttx-indoor',
    name: 'WTTx Indoor',
    href: '/dashboard/packages/wttx-indoor',
    icon: Router,
  },
  { id: 'ul', name: 'UL Service', href: '/dashboard/packages/ul', icon: Wifi },
];

const serviceLinks = [
  { id: 'accountInfo', name: 'Account Information', href: '/dashboard/account', icon: CreditCard },
  { id: 'orderHistory', name: 'Order History', href: '/dashboard/orders', icon: History },
  { id: 'recharge', name: 'Recharge', href: '/dashboard/recharge', icon: RefreshCw },
];

const supportLinks = [
  { id: 'faq', name: 'FAQ', href: '/dashboard/faq', icon: HelpCircle },
  { id: 'feedback', name: 'Feedback', href: '/dashboard/support', icon: MessageSquare },
  { id: 'contactUs', name: 'Contact Us', href: '/dashboard/contact', icon: Phone },
];

interface SidebarSectionProps {
  title: string;
  links: { id: string; name: string; href: string; icon: React.ElementType }[];
  variant?: 'offers' | 'packages' | 'service' | 'support';
}

function SidebarSection({
  title,
  links,
  variant = 'offers',
}: SidebarSectionProps) {
  const pathname = usePathname();
  const t = useTranslations('sidebar');

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
                key={item.id}
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
                  <span>{variant === 'offers' || variant === 'packages' ? `${t(variant)} - ${t(item.id)}` : t(item.id)}</span>
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
  const t = useTranslations('sidebar');
  return (
    <aside className="w-full lg:w-72 space-y-4">
      <SidebarSection title={t('offers')} links={offerLinks} variant="offers" />
      <SidebarSection
        title={t('packages')}
        links={packageLinks}
        variant="packages"
      />
      <SidebarSection title={t('service')} links={serviceLinks} variant="service" />
      <SidebarSection title={t('support')} links={supportLinks} variant="support" />
    </aside>
  );
}

export function QuickFAQ() {
  const t = useTranslations('sidebar');
  const tFaq = useTranslations('faq.q');
  
  const faqs = [
    { id: 'q1', text: tFaq('q1') },
    { id: 'q2', text: tFaq('q2') },
    { id: 'q3', text: tFaq('q3') },
    { id: 'q4', text: tFaq('q4') },
  ];

  return (
    <Card>
      <CardHeader className="py-3 px-4 border-l-4 border-l-accent">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold">{t('faq')}</CardTitle>
          <Link
            href="/dashboard/faq"
            className="text-xs text-primary hover:underline"
          >
            {t('more')} {'>>'}
          </Link>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <ul className="space-y-2">
          {faqs.map((faq, index) => (
            <li key={faq.id} className="flex items-start gap-2 text-sm">
              <Badge
                variant="outline"
                className="h-5 min-w-5 flex items-center justify-center text-xs"
              >
                {index + 1}
              </Badge>
              <Link
                href="/dashboard/faq"
                className="text-muted-foreground hover:text-primary"
              >
                {faq.text}
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
