'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/src/i18n/navigation';

export function Footer() {
  const t = useTranslations();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/50 bg-card">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          {/* logo */}
          <div className="flex items-center gap-3">
            <img
              src="/camtel.png"
              alt="Camtel"
              className="h-15 w-15 object-contain"
            />
            <div>
              <span className="ml-2 text-xs text-muted-foreground">
                {t('Footer.tagline')}
              </span>
            </div>
          </div>

          {/* links */}
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="#" className="transition-colors hover:text-foreground">
              {t('Footer.privacyPolicy')}
            </Link>
            <Link href="#" className="transition-colors hover:text-foreground">
              {t('Footer.termsOfService')}
            </Link>
          </div>
        </div>

        <div className="mt-6 flex flex-col items-center justify-between gap-2 border-t border-border/50 pt-6 text-center text-xs text-muted-foreground sm:flex-row">
          <p>
            &copy; 2005-{currentYear} {t('Footer.copyright')}
          </p>
          <p>Visits: 696,424,502</p>
        </div>
      </div>
    </footer>
  );
}
