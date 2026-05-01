'use client';

import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from 'react';
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
  Menu,
  X,
} from 'lucide-react';
import { Button } from '../ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

// Constants
const HEADER_HEIGHT = '4rem'; // 64px
const SIDEBAR_COLLAPSE_DELAY = 200; // ms

// Types
interface NavLink {
  name: string;
  href: string;
  icon: React.ElementType;
}

interface SidebarSectionProps {
  title: string;
  links: NavLink[];
  variant?: 'offers' | 'packages' | 'service' | 'support';
  onClose?: () => void;
  isCollapsed?: boolean;
}

// Data
const baseServiceLinks: NavLink[] = [
  { name: 'LTE SERVICE', href: '/users/services/lte', icon: Radio },
  {
    name: 'WTTx Outdoor',
    href: '/users/services/wttx-outdoor',
    icon: Satellite,
  },
  { name: 'WTTx Indoor', href: '/users/services/wttx-indoor', icon: Router },
  { name: 'UL Service', href: '/users/services/ul', icon: Wifi },
];

const offerLinks: NavLink[] = baseServiceLinks;

const packageLinks: NavLink[] = baseServiceLinks.map((link) => ({
  ...link,
  href: link.href.replace('/users/services/', '/users/packages/'),
}));

const serviceLinks: NavLink[] = [
  { name: 'Account Information', href: '/users/account', icon: CreditCard },
  { name: 'Order History', href: '/users/orders', icon: History },
  { name: 'Recharge', href: '/users/recharge', icon: RefreshCw },
];

const supportLinks: NavLink[] = [
  { name: 'FAQ', href: '/users/faq', icon: HelpCircle },
  { name: 'Feedback', href: '/users/support', icon: MessageSquare },
  { name: 'Contact Us', href: '/users/contact', icon: Phone },
];

// Utility hook for preventing body scroll
function useBodyScrollLock(lock: boolean) {
  useEffect(() => {
    if (lock) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
    return undefined;
  }, [lock]);
}

// SidebarSection Component
function SidebarSection({
  title,
  links,
  variant = 'offers',
  onClose,
  isCollapsed = false,
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
        <CardTitle
          className={cn(
            'text-sm font-semibold whitespace-nowrap overflow-hidden transition-all duration-300',
            isCollapsed && 'lg:hidden',
          )}
        >
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <nav
          className="flex flex-col"
          role="navigation"
          aria-label={`${title} navigation`}
        >
          {links.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            const linkContent = (
              <>
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span
                    className={cn(
                      'whitespace-nowrap overflow-hidden transition-all duration-300',
                      isCollapsed && 'lg:hidden',
                    )}
                  >
                    {item.name}
                  </span>
                </div>
                <ChevronRight
                  className={cn(
                    'h-4 w-4 text-muted-foreground transition-all duration-300',
                    isCollapsed && 'lg:hidden',
                  )}
                  aria-hidden="true"
                />
              </>
            );

            // For collapsed state on desktop, wrap in tooltip
            if (isCollapsed) {
              return (
                <TooltipProvider key={item.name} delayDuration={300}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className={cn(
                          'flex items-center justify-between px-4 py-2.5 text-sm transition-colors border-b border-border last:border-b-0',
                          isActive
                            ? 'bg-primary/10 text-primary font-medium'
                            : 'text-foreground hover:bg-secondary',
                        )}
                        aria-label={item.name}
                        aria-current={isActive ? 'page' : undefined}
                      >
                        <Icon className="h-4 w-4 shrink-0 mx-auto lg:mx-0" />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>{item.name}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            }

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={cn(
                  'flex items-center justify-between px-4 py-2.5 text-sm transition-colors border-b border-border last:border-b-0',
                  isActive
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-foreground hover:bg-secondary',
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                {linkContent}
              </Link>
            );
          })}
        </nav>
      </CardContent>
    </Card>
  );
}

// Main DashboardSidebar Component
export function DashboardSidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const collapseTimeoutRef = useRef<NodeJS.Timeout>();

  // Prevent body scroll when mobile menu is open
  useBodyScrollLock(isMobileMenuOpen);

  // Debounced collapse handlers
  const handleMouseEnter = useCallback(() => {
    if (collapseTimeoutRef.current) {
      clearTimeout(collapseTimeoutRef.current);
    }
    setIsCollapsed(false);
  }, []);

  const handleMouseLeave = useCallback(() => {
    collapseTimeoutRef.current = setTimeout(() => {
      setIsCollapsed(true);
    }, SIDEBAR_COLLAPSE_DELAY);
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (collapseTimeoutRef.current) {
        clearTimeout(collapseTimeoutRef.current);
      }
    };
  }, []);

  // Close mobile menu on route change
  const pathname = usePathname();
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const sidebarSections = useMemo(
    () => [
      { title: 'Offers', links: offerLinks, variant: 'offers' as const },
      { title: 'Packages', links: packageLinks, variant: 'packages' as const },
      { title: 'Service', links: serviceLinks, variant: 'service' as const },
      { title: 'Support', links: supportLinks, variant: 'support' as const },
    ],
    [],
  );

  return (
    <>
      {/* Mobile Menu Toggle Button (FAB) */}
      <Button
        variant="default"
        size="icon"
        className={cn(
          'lg:hidden fixed bottom-6 right-6 z-50 rounded-full shadow-2xl h-12 w-12 bg-primary text-primary-foreground',
          'hover:scale-110 transition-transform',
          'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
        )}
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label={
          isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'
        }
        aria-expanded={isMobileMenuOpen}
      >
        {isMobileMenuOpen ? (
          <X className="h-6 w-6" aria-hidden="true" />
        ) : (
          <Menu className="h-6 w-6" aria-hidden="true" />
        )}
      </Button>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:sticky top-16 left-0 z-40 bg-background border-r border-border overflow-y-auto transition-all duration-300 ease-in-out flex flex-col gap-4',
          'scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent',
          `h-[calc(100vh-${HEADER_HEIGHT})]`,
          isMobileMenuOpen
            ? 'translate-x-0 w-72 p-4 shadow-2xl'
            : '-translate-x-full lg:translate-x-0',
          isCollapsed ? 'lg:w-20 lg:p-2' : 'lg:w-72 lg:p-4',
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        aria-label="Dashboard navigation"
        role="complementary"
      >
        {/* Mobile/Tablet Header in Sidebar */}
        <div className="lg:hidden flex justify-between items-center mb-2 border-b pb-4">
          <span className="font-bold text-lg text-primary">Service Menu</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close navigation menu"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </Button>
        </div>

        <div className="flex-1 space-y-4">
          <TooltipProvider>
            {sidebarSections.map((section) => (
              <SidebarSection
                key={section.title}
                title={section.title}
                links={section.links}
                variant={section.variant}
                onClose={() => setIsMobileMenuOpen(false)}
                isCollapsed={isCollapsed}
              />
            ))}
          </TooltipProvider>
        </div>
      </aside>

      {/* Mobile/Tablet Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden transition-opacity duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Close navigation menu"
        />
      )}
    </>
  );
}

// FAQ Data
const faqs = [
  {
    id: 'change-password',
    question: 'How do I change my default password?',
  },
  {
    id: 'forgot-password',
    question: "What's to do if I've forgot my password?",
  },
  {
    id: 'payment',
    question: 'How do I pay for my X-tremNet services?',
  },
  {
    id: 'monitor-consumption',
    question: 'How do I monitor my consumption?',
  },
];

// QuickFAQ Component
export function QuickFAQ() {
  return (
    <Card>
      <CardHeader className="py-3 px-4 border-l-4 border-l-accent">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold">FAQ</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link
              href="/users/faq"
              className="text-xs text-primary hover:underline"
            >
              View All
              <ChevronRight className="ml-1 h-3 w-3" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <ul className="space-y-2" role="list">
          {faqs.map((faq, index) => (
            <li key={faq.id} className="flex items-start gap-2 text-sm">
              <Badge
                variant="outline"
                className="h-5 min-w-5 flex items-center justify-center text-xs shrink-0"
                aria-hidden="true"
              >
                {index + 1}
              </Badge>
              <Link
                href={`/users/faq#${faq.id}`}
                className="text-muted-foreground hover:text-primary transition-colors focus:outline-none focus:underline"
              >
                {faq.question}
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
