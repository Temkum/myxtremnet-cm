'use client';

import { Wifi, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/lib/language-context';

export function ProductSection() {
  const { t } = useLanguage();

  return (
    <section id="products" className="bg-secondary/30 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-2">
          <h2 className="text-2xl font-bold text-foreground">
            {t('featuredOffer')}
          </h2>
        </div>

        <Card className="group overflow-hidden border-border/50 bg-card shadow-sm transition-all duration-500 hover:shadow-xl">
          <CardContent className="p-0">
            <div className="grid lg:grid-cols-2">
              {/* Product Image/Visual */}
              <div className="relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 p-8 lg:p-12">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--primary),0.1),transparent_70%)]" />

                {/* Animated Dongle Visual */}
                <div className="relative">
                  <div className="flex h-40 w-40 items-center justify-center rounded-3xl bg-gradient-to-br from-primary to-primary/80 shadow-2xl shadow-primary/30 transition-transform duration-500 group-hover:scale-105 group-hover:rotate-3 sm:h-48 sm:w-48">
                    <Wifi className="h-20 w-20 text-primary-foreground sm:h-24 sm:w-24" />
                  </div>

                  {/* Signal Waves */}
                  <div className="absolute -right-4 -top-4 h-8 w-8 animate-ping rounded-full bg-accent/30" />
                  <div
                    className="absolute -bottom-4 -left-4 h-6 w-6 animate-ping rounded-full bg-primary/30"
                    style={{ animationDelay: '0.5s' }}
                  />
                </div>

                <Badge className="absolute left-4 top-4 bg-accent text-accent-foreground hover:bg-accent">
                  {t('xtremNetBadge')}
                </Badge>
              </div>

              {/* Product Details */}
              <div className="flex flex-col justify-center p-6 lg:p-12">
                <Badge variant="secondary" className="mb-4 w-fit">
                  {t('lte4g')}
                </Badge>

                <h3 className="mb-3 text-2xl font-bold text-foreground sm:text-3xl">
                  {t('xtremNetDongle')}
                </h3>

                <p className="mb-6 text-pretty leading-relaxed text-muted-foreground">
                  {t('xtremNetDesc')}
                </p>

                <div className="mb-6 flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-primary">5,900</span>
                  <span className="text-xl text-muted-foreground">FCFA</span>
                  <span className="text-sm text-muted-foreground">
                    /{t('perMonth')}
                  </span>
                </div>

                <ul className="mb-8 space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {t('daysValidity')}
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {t('plugPlay')}
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {t('nationwide')}
                  </li>
                </ul>

                <Button className="group/btn w-fit gap-2 bg-primary px-8 text-primary-foreground transition-all duration-300 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25">
                  {t('learnMore')}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
