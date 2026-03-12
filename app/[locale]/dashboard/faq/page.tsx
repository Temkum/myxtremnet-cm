'use client';

import { useState } from 'react';
import { Link } from '@/i18n/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  HelpCircle,
  Search,
  ChevronLeft,
  ChevronRight,
  Key,
  CreditCard,
  Wifi,
  RefreshCw,
  Package,
  Settings,
  MessageSquare,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function FAQPage() {
  const t = useTranslations('faq');
  const tCat = useTranslations('faq.cat');
  const tQ = useTranslations('faq.q');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const faqCategories = [
    { id: 'all', name: tCat('all'), icon: HelpCircle, count: 16 },
    { id: 'account', name: tCat('account'), icon: Key, count: 4 },
    { id: 'billing', name: tCat('billing'), icon: CreditCard, count: 3 },
    { id: 'connectivity', name: tCat('connectivity'), icon: Wifi, count: 3 },
    { id: 'subscription', name: tCat('subscription'), icon: Package, count: 3 },
    { id: 'technical', name: tCat('technical'), icon: Settings, count: 3 },
  ];

  const faqData = [
    { id: 1, question: tQ('q1'), answer: tQ('a1'), category: 'account' },
    { id: 2, question: tQ('q2'), answer: tQ('a2'), category: 'account' },
    { id: 3, question: tQ('q3'), answer: tQ('a3'), category: 'billing' },
    { id: 4, question: tQ('q4'), answer: tQ('a4'), category: 'billing' },
    { id: 5, question: tQ('q5'), answer: tQ('a5'), category: 'billing' },
    { id: 6, question: tQ('q6'), answer: tQ('a6'), category: 'subscription' },
    { id: 7, question: tQ('q7'), answer: tQ('a7'), category: 'subscription' },
    { id: 8, question: tQ('q8'), answer: tQ('a8'), category: 'subscription' },
    { id: 9, question: tQ('q9'), answer: tQ('a9'), category: 'connectivity' },
    { id: 10, question: tQ('q10'), answer: tQ('a10'), category: 'technical' },
    { id: 11, question: tQ('q11'), answer: tQ('a11'), category: 'technical' },
    { id: 12, question: tQ('q12'), answer: tQ('a12'), category: 'connectivity' },
    { id: 13, question: tQ('q13'), answer: tQ('a13'), category: 'connectivity' },
    { id: 14, question: tQ('q14'), answer: tQ('a14'), category: 'account' },
    { id: 15, question: tQ('q15'), answer: tQ('a15'), category: 'account' },
    { id: 16, question: tQ('q16'), answer: tQ('a16'), category: 'technical' },
  ];

  const filteredFAQs = faqData.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {t('title')}
          </h1>
          <p className="text-muted-foreground">
            {t('subtitle')}
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/dashboard/support">
            <MessageSquare className="h-4 w-4 mr-2" />
            {t('contactSupport')}
          </Link>
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder={t('searchPlaceholder')}
                className="pl-10 h-12 text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Categories Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                {t('categories')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2">
              <nav className="space-y-1">
                {faqCategories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-secondary'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          {category.name}
                        </span>
                      </div>
                      <Badge
                        variant={
                          selectedCategory === category.id
                            ? 'secondary'
                            : 'outline'
                        }
                        className="text-xs"
                      >
                        {category.count}
                      </Badge>
                    </button>
                  );
                })}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Content */}
        <div className="lg:col-span-3 space-y-6">
          <Card>
            <CardHeader className="border-b border-border flex flex-row items-center gap-4">
              <div className="h-14 w-14 rounded-lg bg-primary/10 flex items-center justify-center">
                <HelpCircle className="h-7 w-7 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">FAQ</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {t('questionsFound', { count: filteredFAQs.length })}
                </p>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {filteredFAQs.length > 0 ? (
                <Accordion type="single" collapsible className="w-full">
                  {filteredFAQs.map((faq, index) => (
                    <AccordionItem
                      key={faq.id}
                      value={`item-${faq.id}`}
                      className="border-b border-border last:border-b-0"
                    >
                      <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-secondary/50">
                        <div className="flex items-start gap-3 text-left">
                          <Badge variant="outline" className="mt-0.5 shrink-0">
                            {index + 1}
                          </Badge>
                          <span className="font-medium">{faq.question}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-4">
                        <div className="pl-9">
                          <p className="text-muted-foreground leading-relaxed">
                            {faq.answer}
                          </p>
                          <div className="mt-4 flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">
                              {t('categoryLabel')}
                            </span>
                            <Badge variant="secondary" className="capitalize">
                              {tCat(faq.category)}
                            </Badge>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <div className="p-12 text-center">
                  <HelpCircle className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                  <h3 className="font-semibold mb-2">{t('noResults')}</h3>
                  <p className="text-muted-foreground">
                    {t('noResultsDesc')}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-2">
            <Button variant="outline" size="sm" disabled>
              <ChevronLeft className="h-4 w-4 mr-1" />
              {t('first')}
            </Button>
            <Button variant="outline" size="sm" disabled>
              {t('prev')}
            </Button>
            <Button variant="default" size="sm">
              1
            </Button>
            <Button variant="outline" size="sm">
              2
            </Button>
            <Button variant="outline" size="sm">
              {t('next')}
            </Button>
            <Button variant="outline" size="sm">
              {t('last')}
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>

          {/* Still Need Help */}
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-bold mb-2">{t('stillHaveQuestions')}</h3>
              <p className="opacity-90 mb-4">
                {t('stillHaveQuestionsDesc')}
              </p>
              <Button variant="secondary" asChild>
                <Link href="/dashboard/support">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  {t('submitRequest')}
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
