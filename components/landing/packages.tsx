import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';

const packages = [
  {
    name: 'Basic',
    speed: '10 Mbps',
    price: '15,000',
    period: 'month',
    description: 'Perfect for light browsing and email',
    features: [
      '10 Mbps Download Speed',
      '5 Mbps Upload Speed',
      'Unlimited Data',
      'Email Support',
      'Basic Router Included',
    ],
    popular: false,
  },
  {
    name: 'Standard',
    speed: '25 Mbps',
    price: '25,000',
    period: 'month',
    description: 'Ideal for streaming and remote work',
    features: [
      '25 Mbps Download Speed',
      '10 Mbps Upload Speed',
      'Unlimited Data',
      '24/7 Phone Support',
      'Premium Router Included',
      'Free Installation',
    ],
    popular: true,
  },
  {
    name: 'Premium',
    speed: '50 Mbps',
    price: '40,000',
    period: 'month',
    description: 'Best for gaming and large households',
    features: [
      '50 Mbps Download Speed',
      '25 Mbps Upload Speed',
      'Unlimited Data',
      'Priority 24/7 Support',
      'Premium Router + Extender',
      'Free Installation',
      'Static IP Available',
    ],
    popular: false,
  },
  {
    name: 'Enterprise',
    speed: '100 Mbps',
    price: '75,000',
    period: 'month',
    description: 'Maximum speed for businesses',
    features: [
      '100 Mbps Download Speed',
      '50 Mbps Upload Speed',
      'Unlimited Data',
      'Dedicated Account Manager',
      'Enterprise Router Setup',
      'Free Installation',
      'Static IP Included',
      'SLA Guarantee',
    ],
    popular: false,
  },
];

export function Packages() {
  return (
    <section id="packages" className="bg-muted/30 py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-balance text-3xl font-bold text-foreground md:text-4xl">
            Choose Your Plan
          </h2>
          <p className="text-pretty text-lg text-muted-foreground">
            Flexible packages designed to meet every need and budget. All plans
            include unlimited data.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {packages.map((pkg) => (
            <Card
              key={pkg.name}
              className={`relative flex flex-col ${
                pkg.popular ? 'border-primary shadow-lg' : 'border-border/50'
              }`}
            >
              {pkg.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                  Most Popular
                </Badge>
              )}
              <CardHeader className="text-center">
                <CardTitle className="text-xl">{pkg.name}</CardTitle>
                <div className="text-3xl font-bold text-primary">
                  {pkg.speed}
                </div>
                <CardDescription>{pkg.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="mb-6 text-center">
                  <span className="text-4xl font-bold text-foreground">
                    {pkg.price}
                  </span>
                  <span className="text-muted-foreground">
                    {' '}
                    XAF/{pkg.period}
                  </span>
                </div>
                <ul className="space-y-3">
                  {pkg.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span className="text-sm text-muted-foreground">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  variant={pkg.popular ? 'default' : 'outline'}
                  asChild
                >
                  <Link href="/dashboard/services">Get Started</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
