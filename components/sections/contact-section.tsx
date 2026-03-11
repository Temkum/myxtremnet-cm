'use client';

import {
  MapPin,
  Phone,
  Printer,
  Globe,
  Mail,
  Facebook,
  Twitter,
  Youtube,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';

export function ContactSection() {
  const t = useTranslations();

  const contactInfo = [
    { icon: MapPin, label: 'address', value: t('Contact.addressValue') },
    { icon: Phone, label: 'phone', value: '222 23 40 65' },
    { icon: Printer, label: 'fax', value: '222 23 03 03' },
    {
      icon: Globe,
      label: 'website',
      value: 'www.camtel.cm',
      href: 'https://www.camtel.cm',
    },
    {
      icon: Mail,
      label: 'email',
      value: 'contact@camtel.cm',
      href: 'mailto:contact@camtel.cm',
    },
  ];

  const socialLinks = [
    {
      icon: Facebook,
      href: 'https://facebook.com/Camtelonline',
      label: 'Facebook',
    },
    {
      icon: Twitter,
      href: 'https://twitter.com/Camtelonline',
      label: 'Twitter',
    },
    {
      icon: Youtube,
      href: 'https://youtube.com/Camtelonline',
      label: 'YouTube',
    },
  ];

  return (
    <section id="contact" className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Card className="border-border/50 bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-semibold text-foreground">
              <div className="h-1 w-8 rounded-full bg-primary" />
              {t('Contact.contactDetails')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-8 lg:grid-cols-2">
              {/* Contact Info */}
              <div className="space-y-4">
                {contactInfo.map((item) => (
                  <div
                    key={item.label}
                    className="group flex items-start gap-4 rounded-lg p-3 transition-all duration-200 hover:bg-secondary"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        {t(`Contact.${item.label}`)}
                      </p>
                      {item.href ? (
                        <a
                          href={item.href}
                          className="text-sm font-medium text-foreground transition-colors hover:text-primary"
                          target={
                            item.href.startsWith('http') ? '_blank' : undefined
                          }
                          rel={
                            item.href.startsWith('http')
                              ? 'noopener noreferrer'
                              : undefined
                          }
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-sm font-medium text-foreground">
                          {item.value}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Social Links */}
              <div className="flex flex-col justify-center">
                <h3 className="mb-4 text-sm font-medium uppercase tracking-wide text-muted-foreground">
                  {t('Contact.followUs')}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {socialLinks.map((social) => (
                    <Button
                      key={social.label}
                      variant="outline"
                      size="lg"
                      className="group gap-2 border-border/50 transition-all duration-300 hover:border-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
                      asChild
                    >
                      <a
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.label}
                      >
                        <social.icon className="h-5 w-5" />
                        <span className="hidden sm:inline">{social.label}</span>
                      </a>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
