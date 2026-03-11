'use client';

import { useState } from 'react';
import { Menu, X, Globe, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTranslations, useLocale } from 'next-intl';
import { AuthButton } from '@/components/auth/auth-button';
import { Link, useRouter, usePathname } from '@/src/i18n/navigation';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations();

  const navItems = [
    { key: 'Navigation.home', href: '/dashboard' },
    { key: 'Navigation.products', href: '#products' },
    { key: 'Navigation.services', href: '#services' },
    { key: 'Navigation.support', href: '#contact' },
  ];

  const handleLanguageChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-card/80 backdrop-blur-xl transition-all duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 transition-transform duration-200 hover:scale-105"
        >
          <img
            src="/camtel.png"
            alt="Camtel"
            className="h-10 w-10 rounded-full"
          />
          <div className="flex flex-col">
            <span className="text-xl font-bold text-foreground">camtel</span>
            <span className="text-[10px] text-muted-foreground">
              {t('Footer.tagline')}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-secondary hover:text-foreground"
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Auth Button */}
          <AuthButton />

          {/* Language Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 text-muted-foreground transition-all duration-200 hover:text-foreground"
              >
                <Globe className="h-4 w-4" />
                <span className="hidden sm:inline">
                  {locale === 'en'
                    ? t('Language.english')
                    : t('Language.french')}
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
                className={locale === 'en' ? 'bg-secondary' : ''}
              >
                {t('Language.english')}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleLanguageChange('fr')}
                className={locale === 'fr' ? 'bg-secondary' : ''}
              >
                {t('Language.french')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out md:hidden ${
          mobileMenuOpen ? 'max-h-64' : 'max-h-0'
        }`}
      >
        <nav className="flex flex-col gap-1 border-t border-border/40 bg-card px-4 py-4">
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className="rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-secondary hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
