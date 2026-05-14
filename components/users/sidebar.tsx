'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  CreditCard,
  History,
  RefreshCw,
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

// Data — all available user routes
const navLinks: NavLink[] = [
  { name: 'Dashboard', href: '/users', icon: CreditCard },
  { name: 'Account Information', href: '/users/account', icon: CreditCard },
  { name: 'Order History', href: '/users/orders', icon: History },
  { name: 'Recharge', href: '/users/recharge', icon: RefreshCw },
  { name: 'Bundles', href: '/users/bundles', icon: RefreshCw },
  { name: 'Services', href: '/users/services', icon: RefreshCw },
  { name: 'Support', href: '/users/support', icon: RefreshCw },
  { name: 'FAQ', href: '/users/faq', icon: RefreshCw },
  { name: 'Contact', href: '/users/contact', icon: RefreshCw },
  { name: 'Settings', href: '/users/settings', icon: RefreshCw },
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

// Main DashboardSidebar Component
export function DashboardSidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const collapseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
        <div className="lg:hidden flex justify-between items-center mb-4 border-b pb-4">
          <span className="font-bold text-lg text-primary">Menu</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close navigation menu"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </Button>
        </div>

        {/* Navigation Links */}
        <nav
          className="flex-1 space-y-1"
          role="navigation"
          aria-label="Dashboard navigation"
        >
          <TooltipProvider>
            {navLinks.map((item) => {
              const isActive =
                pathname === item.href || pathname.endsWith(item.href);
              const Icon = item.icon;

              // For collapsed state on desktop, wrap in tooltip
              if (isCollapsed) {
                return (
                  <Tooltip key={item.name} delayDuration={300}>
                    <TooltipTrigger asChild>
                      <Link
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          'flex items-center justify-center px-3 py-3 rounded-lg text-sm transition-colors',
                          isActive
                            ? 'bg-primary text-primary-foreground'
                            : 'text-foreground hover:bg-secondary',
                        )}
                        aria-label={item.name}
                        aria-current={isActive ? 'page' : undefined}
                      >
                        <Icon className="h-5 w-5" />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>{item.name}</p>
                    </TooltipContent>
                  </Tooltip>
                );
              }

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center justify-between px-4 py-3 rounded-lg text-sm transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground font-medium'
                      : 'text-foreground hover:bg-secondary',
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    <span>{item.name}</span>
                  </div>
                </Link>
              );
            })}
          </TooltipProvider>
        </nav>
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
