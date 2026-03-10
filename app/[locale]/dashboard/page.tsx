import Link from 'next/link';
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
import { LanguageProvider } from '@/lib/language-context';

const offerCategories = [
  {
    name: 'LTE SERVICE',
    href: '/dashboard/services/lte',
    icon: Radio,
    badge: 'Popular',
  },
  {
    name: 'WTTx Outdoor',
    href: '/dashboard/services/wttx-outdoor',
    icon: Satellite,
  },
  {
    name: 'WTTx Indoor',
    href: '/dashboard/services/wttx-indoor',
    icon: Router,
  },
  { name: 'UL Service', href: '/dashboard/services/ul', icon: Wifi },
];

const packageCategories = [
  { name: 'LTE SERVICE', href: '/dashboard/packages/lte', icon: Radio },
  {
    name: 'WTTx Outdoor',
    href: '/dashboard/packages/wttx-outdoor',
    icon: Satellite,
  },
  {
    name: 'WTTx Indoor',
    href: '/dashboard/packages/wttx-indoor',
    icon: Router,
  },
  { name: 'UL Service', href: '/dashboard/packages/ul', icon: Wifi },
];

const quickActions = [
  {
    name: 'Account Info',
    href: '/dashboard/account',
    icon: CreditCard,
    description: 'View your balance and account details',
  },
  {
    name: 'Bundles',
    href: '/dashboard/bundles',
    icon: RefreshCw,
    description: 'Subscribe to Data bundles',
  },
  {
    name: 'Recharge',
    href: '/dashboard/recharge',
    icon: RefreshCw,
    description: 'Top up your account',
  },
  {
    name: 'Order History',
    href: '/dashboard/orders',
    icon: History,
    description: 'Check your past orders',
  },
];

const supportLinks = [
  { name: 'FAQ', href: '/dashboard/faq', icon: HelpCircle },
  { name: 'Feedback', href: '/dashboard/support', icon: MessageSquare },
  { name: 'Contact Us', href: '/dashboard/contact', icon: Phone },
];

export default function DashboardPage() {
  return (
    <LanguageProvider>
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
            <Card
              key={action.name}
              className="hover:shadow-md transition-shadow"
            >
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
                  <CardTitle className="text-lg">Offers</CardTitle>
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
                          Offers - {category.name}
                        </span>
                        {category.badge && (
                          <Badge variant="secondary" className="ml-2">
                            {category.badge}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <span className="text-sm">more</span>
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
                  <CardTitle className="text-lg">Packages</CardTitle>
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
                          Packages - {category.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <span className="text-sm">more</span>
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
                <CardTitle className="text-sm font-semibold">Support</CardTitle>
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
                <h4 className="font-semibold mb-2">Need Help?</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Our support team is available 24/7 to assist you with any
                  questions.
                </p>
                <Button asChild className="w-full">
                  <Link href="/dashboard/contact">Contact Support</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </LanguageProvider>
  );
}
