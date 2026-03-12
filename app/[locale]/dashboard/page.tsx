'use client';

import { Link } from '@/i18n/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { UserWelcome } from '@/components/dashboard/user-welcome';
import {
  PromoBanner,
  ServiceHighlights,
} from '@/components/dashboard/promo-banner';
import { QuickFAQ } from '@/components/dashboard/sidebar';
import {
  Radio,
  Satellite,
  Router,
  Wifi,
  ChevronRight,
  CreditCard,
  History,
  RefreshCw,
  HelpCircle,
  MessageSquare,
  Phone,
} from 'lucide-react';
import { LanguageProvider, useLanguage } from '@/lib/language-context';

function DashboardContent() {
  const { t } = useLanguage();

  const offerCategories = [
    {
      name: t('lte_service'),
      href: '/dashboard/services/lte',
      icon: Radio,
      badge: t('popular'),
    },
    {
      name: t('wttx_outdoor'),
      href: '/dashboard/services/wttx-outdoor',
      icon: Satellite,
    },
    {
      name: t('wttx_indoor'),
      href: '/dashboard/services/wttx-indoor',
      icon: Router,
    },
    { name: t('ul_service'), href: '/dashboard/services/ul', icon: Wifi },
  ];

  const packageCategories = [
    { name: t('lte_service'), href: '/dashboard/packages/lte', icon: Radio },
    {
      name: t('wttx_outdoor'),
      href: '/dashboard/packages/wttx-outdoor',
      icon: Satellite,
    },
    {
      name: t('wttx_indoor'),
      href: '/dashboard/packages/wttx-indoor',
      icon: Router,
    },
    { name: t('ul_service'), href: '/dashboard/packages/ul', icon: Wifi },
  ];

  const quickActions = [
    {
      name: t('accountInfo'),
      href: '/dashboard/account',
      icon: CreditCard,
      description: t('accountInfoDesc'),
    },
    {
      name: t('bundles'),
      href: '/dashboard/bundles',
      icon: RefreshCw,
      description: t('bundlesDesc'),
    },
    {
      name: t('recharge_dash'),
      href: '/dashboard/recharge',
      icon: RefreshCw,
      description: t('rechargeDesc'),
    },
    {
      name: t('orderHistory'),
      href: '/dashboard/orders',
      icon: History,
      description: t('orderHistoryDesc'),
    },
  ];

  const supportLinks = [
    { name: t('faq'), href: '/dashboard/faq', icon: HelpCircle },
    { name: t('feedback'), href: '/dashboard/support', icon: MessageSquare },
    { name: t('contactUs_dash'), href: '/dashboard/contact', icon: Phone },
  ];

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Top Section - Promo + User */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PromoBanner />
        </div>
        <div className="hidden lg:block">
          <UserWelcome />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {quickActions.map((action) => (
          <Card key={action.name} className="hover:shadow-md transition-shadow">
            <Link href={action.href}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <action.icon className="h-5 w-5 text-primary" />
                  </div>
                  <span className="font-semibold">{action.name}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {action.description}
                </p>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>

      {/* Service Highlights */}
      <ServiceHighlights />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Content - 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* Offers Section */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between py-4 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="h-1 w-4 bg-primary rounded-full" />
                <CardTitle className="text-lg">{t('offers')}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {offerCategories.map((category) => (
                  <Link
                    key={category.name}
                    href={category.href}
                    className="flex items-center justify-between px-4 py-3 hover:bg-secondary transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <category.icon className="h-4 w-4 text-primary" />
                      </div>
                      <span className="font-medium">
                        {t('offers')} - {category.name}
                      </span>
                      {category.badge && (
                        <Badge variant="secondary" className="ml-2">
                          {category.badge}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <span className="text-sm">{t('more')}</span>
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Packages Section */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between py-4 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="h-1 w-4 bg-accent rounded-full" />
                <CardTitle className="text-lg">{t('packages')}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {packageCategories.map((category) => (
                  <Link
                    key={category.name}
                    href={category.href}
                    className="flex items-center justify-between px-4 py-3 hover:bg-secondary transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center">
                        <category.icon className="h-4 w-4 text-accent" />
                      </div>
                      <span className="font-medium">
                        {t('packages')} - {category.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <span className="text-sm">{t('more')}</span>
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Mobile User Welcome */}
          <div className="lg:hidden">
            <UserWelcome />
          </div>

          {/* FAQ Card */}
          <QuickFAQ />

          {/* Support Links */}
          <Card>
            <CardHeader className="py-3 px-4 border-b border-border">
              <CardTitle className="text-sm font-semibold">
                {t('support')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {supportLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="flex items-center justify-between px-4 py-3 hover:bg-secondary transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <link.icon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{link.name}</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Help Notice */}
          <Card className="bg-secondary/50">
            <CardContent className="p-4">
              <h4 className="font-semibold mb-2">{t('needHelp')}</h4>
              <p className="text-sm text-muted-foreground mb-3">
                {t('helpDescription')}
              </p>
              <Button asChild className="w-full">
                <Link href="/dashboard/contact">{t('contactSupport')}</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <LanguageProvider>
      <DashboardContent />
    </LanguageProvider>
  );
}
