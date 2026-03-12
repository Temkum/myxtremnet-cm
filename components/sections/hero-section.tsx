'use client';

import {
  ArrowRight,
  Wifi,
  Signal,
  Laptop,
  Smartphone,
  Car,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/language-context';

export function HeroSection() {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5 py-16 sm:py-24 lg:py-32">
      {/* Animated Background Elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-4 top-1/4 h-72 w-72 animate-pulse rounded-full bg-primary/10 blur-3xl" />
        <div
          className="absolute -right-4 bottom-1/4 h-96 w-96 animate-pulse rounded-full bg-accent/10 blur-3xl"
          style={{ animationDelay: '1s' }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Text Content */}
          <div className="animate-fade-in space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <span>{t('camtelTelecommunications')}</span>
            </div>

            <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              {t('heroTitle')}
            </h1>

            <p className="max-w-lg text-pretty text-lg leading-relaxed text-muted-foreground">
              {t('heroSubtitle')}
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Button
                size="lg"
                className="group gap-2 bg-primary px-8 text-primary-foreground transition-all duration-300 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25"
              >
                {t('exploreProducts')}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-border px-8 transition-all duration-300 hover:border-primary hover:text-white bg-transparent"
              >
                {t('contactUs')}
              </Button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 pt-4">
              <div className="space-y-1">
                <p className="text-3xl font-bold text-primary">500K+</p>
                <p className="text-sm text-muted-foreground">
                  {t('activeUsers')}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-bold text-primary">99.9%</p>
                <p className="text-sm text-muted-foreground">{t('uptime')}</p>
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-bold text-primary">24/7</p>
                <p className="text-sm text-muted-foreground">
                  {t('statsSupport')}
                </p>
              </div>
            </div>
          </div>

          {/* Visual Element */}
          <div className="relative hidden lg:block">
            <div className="relative mx-auto aspect-square max-w-md">
              {/* Animated Rings */}
              <div
                className="absolute inset-0 animate-spin rounded-full border-2 border-dashed border-primary/20"
                style={{ animationDuration: '20s' }}
              />
              <div
                className="absolute inset-8 animate-spin rounded-full border-2 border-dashed border-accent/20"
                style={{
                  animationDuration: '15s',
                  animationDirection: 'reverse',
                }}
              />
              <div
                className="absolute inset-16 animate-spin rounded-full border-2 border-dashed border-primary/30"
                style={{ animationDuration: '10s' }}
              />

              {/* Center Icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-32 w-32 items-center justify-center rounded-full bg-primary to-accent shadow-2xl shadow-primary/30">
                  <Wifi className="h-16 w-16 text-primary-foreground" />
                </div>
              </div>

              {/* Floating Icons */}
              <div className="absolute inset-0">
                {/* Smartphone - Top Right */}
                <div
                  className="absolute right-4 top-1/4 flex h-12 w-12 animate-bounce items-center justify-center rounded-xl bg-card shadow-lg"
                  style={{ animationDuration: '3s' }}
                >
                  <Smartphone className="h-6 w-6 text-primary" />
                </div>

                {/* Laptop - Bottom Left */}
                <div
                  className="absolute left-4 bottom-1/4 flex h-14 w-14 animate-bounce items-center justify-center rounded-xl bg-card shadow-lg"
                  style={{ animationDuration: '3.5s', animationDelay: '0.2s' }}
                >
                  <Laptop className="h-7 w-7 text-accent" />
                </div>

                {/* Tablet - Top Left */}
                <div
                  className="absolute left-8 top-12 flex h-10 w-10 animate-bounce items-center justify-center rounded-xl bg-card shadow-lg"
                  style={{ animationDuration: '4s', animationDelay: '0.7s' }}
                >
                  <Car className="h-5 w-5 text-primary" />
                </div>

                <div
                  className="absolute right-12 bottom-8 flex h-12 w-12 animate-bounce items-center justify-center rounded-xl bg-card shadow-lg"
                  style={{ animationDuration: '2.5s', animationDelay: '0.5s' }}
                >
                  <Signal className="h-6 w-6 text-accent" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
