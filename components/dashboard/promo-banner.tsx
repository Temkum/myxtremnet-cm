'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Wifi,
  Smartphone,
  Package,
  Tv,
  Globe,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

const promos = [
  {
    badge: 'X-tremNet+',
    title: '01 SIM CARD (data only+) To Go',
    subtitle: '1 DONGLE | PACK SINGLE',
    price: '5,900',
    period: '/ 30 jours',
    icon: Smartphone,
    gradient: 'from-blue-600 to-blue-500',
    highlight: '4G LTE',
  },
  {
    badge: 'CamFibre',
    title: 'Fibre Optique Haut Débit',
    subtitle: 'PACK FAMILLE | UP TO 100 MBPS',
    price: '19,900',
    period: '/ mois',
    icon: Globe,
    gradient: 'from-blue-600 to-blue-500',
    highlight: 'FIBRE',
  },
  {
    badge: 'CamTV+',
    title: 'Télévision Numérique Premium',
    subtitle: '200+ CHAÎNES | HD & 4K',
    price: '9,500',
    period: '/ mois',
    icon: Tv,
    gradient: 'from-blue-600 to-blue-500',
    highlight: 'NOUVEAU',
  },
];

export function PromoBanner() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState<'left' | 'right'>('right');

  const goTo = useCallback(
    (next: number, dir: 'left' | 'right') => {
      if (animating) return;
      setDirection(dir);
      setAnimating(true);
      setTimeout(() => {
        setCurrent(next);
        setAnimating(false);
      }, 350);
    },
    [animating],
  );

  const prev = () =>
    goTo((current - 1 + promos.length) % promos.length, 'left');
  const next = useCallback(
    () => goTo((current + 1) % promos.length, 'right'),
    [current, goTo],
  );

  useEffect(() => {
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [next]);

  const promo = promos[current];
  const Icon = promo.icon;

  const slideClass = animating
    ? direction === 'right'
      ? 'translate-x-4 opacity-0'
      : '-translate-x-4 opacity-0'
    : 'translate-x-0 opacity-100';

  return (
    <div className="relative group">
      <Card
        className={`overflow-hidden bg-gradient-to-r ${promo.gradient} text-white shadow-lg transition-all duration-500`}
      >
        <CardContent className="p-6">
          <div
            className={`flex flex-col md:flex-row items-center justify-between gap-6 transition-all duration-350 ease-out ${slideClass}`}
          >
            {/* Left side */}
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center shrink-0 backdrop-blur-sm">
                <Icon className="h-8 w-8" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-white/25 text-white hover:bg-white/30 border-0 text-xs font-semibold tracking-wide">
                    {promo.badge}
                  </Badge>
                  <span className="text-[10px] font-bold tracking-widest bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full">
                    {promo.highlight}
                  </span>
                </div>
                <h3 className="text-xl font-bold leading-tight">
                  {promo.title}
                </h3>
                <p className="text-sm opacity-80 mt-1 tracking-wide">
                  {promo.subtitle}
                </p>
              </div>
            </div>

            {/* Right side */}
            <div className="text-center md:text-right shrink-0">
              <div className="flex items-baseline gap-1 justify-center md:justify-end">
                <span className="text-4xl font-black tabular-nums">
                  {promo.price}
                </span>
                <span className="text-lg font-semibold">Fcfa</span>
              </div>
              <p className="text-sm opacity-70 font-medium">{promo.period}</p>
            </div>
          </div>

          {/* Indicators */}
          <div className="flex items-center justify-center gap-1.5 mt-5">
            {promos.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i, i > current ? 'right' : 'left')}
                className={`rounded-full transition-all duration-300 ${
                  i === current
                    ? 'w-6 h-2 bg-white'
                    : 'w-2 h-2 bg-white/40 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Nav arrows — appear on hover */}
      <button
        onClick={prev}
        className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 backdrop-blur-sm"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button
        onClick={next}
        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 backdrop-blur-sm"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}

export function ServiceHighlights() {
  const t = useTranslations('Dashboard');

  const highlights = [
    {
      icon: Wifi,
      title: t('highSpeedInternet'),
      description: t('highSpeedInternetDesc'),
    },
    {
      icon: Package,
      title: t('flexiblePackages'),
      description: t('flexiblePackagesDesc'),
    },
    {
      icon: Smartphone,
      title: t('mobileReady'),
      description: t('mobileReadyDesc'),
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {highlights.map((item, index) => (
        <Card key={index} className="text-center">
          <CardContent className="p-6">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <item.icon className="h-6 w-6 text-primary" />
            </div>
            <h4 className="font-semibold mb-1">{item.title}</h4>
            <p className="text-sm text-muted-foreground">{item.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
