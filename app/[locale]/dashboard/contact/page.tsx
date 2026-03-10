'use client';

import { useState } from 'react';
import Link from 'next/link';
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

const faqCategories = [
  { id: 'all', name: 'All', icon: HelpCircle, count: 16 },
  { id: 'account', name: 'Account', icon: Key, count: 4 },
  { id: 'billing', name: 'Billing', icon: CreditCard, count: 3 },
  { id: 'connectivity', name: 'Connectivity', icon: Wifi, count: 3 },
  { id: 'subscription', name: 'Subscription', icon: Package, count: 3 },
  { id: 'technical', name: 'Technical', icon: Settings, count: 3 },
];

const faqData = [
  {
    id: 1,
    question: 'How do I change my default password?',
    answer:
      "To change your default password, log in to your account and click on your profile icon in the top right corner. Select 'Change Password' from the dropdown menu. Enter your current password, then enter your new password twice to confirm. Click 'Save' to update your password.",
    category: 'account',
  },
  {
    id: 2,
    question: "What's to do if I've forgot my password?",
    answer:
      "If you've forgotten your password, click on the 'Forgot Password' link on the login page. Enter your registered email address or phone number, and we'll send you a password reset link. Follow the instructions in the email to create a new password.",
    category: 'account',
  },
  {
    id: 3,
    question: 'How do I pay for my X-tremNet services?',
    answer:
      "You can pay for your X-tremNet services through multiple methods: Mobile Money (MTN or Orange Money), credit/debit cards (Visa, Mastercard), or recharge vouchers. Go to the 'Recharge' section in your dashboard to add funds to your account.",
    category: 'billing',
  },
  {
    id: 4,
    question: 'How do I monitor my consumption?',
    answer:
      "To monitor your data consumption, go to 'Service' > 'Account Information' in your dashboard. You'll see a detailed breakdown of your data usage, including remaining data, usage history, and expiration dates for your current plan.",
    category: 'billing',
  },
  {
    id: 5,
    question: 'How do I check my account balance?',
    answer:
      'Your account balance is displayed on the Account Information page. You can also see a quick summary in the header of your dashboard. The balance shows your prepaid credit and any bonus amounts with their respective expiration dates.',
    category: 'billing',
  },
  {
    id: 6,
    question: 'How can I recharge my X-tremNet account?',
    answer:
      "Navigate to the 'Recharge' section from your dashboard. Select your preferred recharge amount or enter a custom amount. Choose your payment method (Mobile Money, card, or voucher) and complete the transaction. Your account will be credited immediately.",
    category: 'subscription',
  },
  {
    id: 7,
    question: 'How do I renew my subscription?',
    answer:
      "To renew your subscription, ensure you have sufficient balance in your account. Go to 'Services' and select your current plan or choose a new one. Click 'Subscribe' to activate the plan. The cost will be deducted from your prepaid balance.",
    category: 'subscription',
  },
  {
    id: 8,
    question: 'Can I cumulate my offers?',
    answer:
      'Yes, you can have multiple active offers on your account. Each offer will run independently with its own data allocation and validity period. Your device will consume data from the offer that was activated first or has the nearest expiration date.',
    category: 'subscription',
  },
  {
    id: 9,
    question: 'Why is my internet connection slow?',
    answer:
      'Slow internet can be caused by several factors: network congestion during peak hours, distance from the nearest tower, interference from physical obstacles, or reaching your data cap. Try restarting your device, checking your signal strength, or contacting support if the issue persists.',
    category: 'connectivity',
  },
  {
    id: 10,
    question: 'How do I configure my device for X-tremNet?',
    answer:
      "Insert your X-tremNet SIM card into a compatible device. The APN settings should configure automatically. If not, go to your device's network settings and manually enter: APN: camtel, Username: (leave blank), Password: (leave blank). Contact support if you need assistance.",
    category: 'technical',
  },
  {
    id: 11,
    question: 'What devices are compatible with X-tremNet?',
    answer:
      "X-tremNet works with any LTE-enabled device including smartphones, tablets, USB dongles, and MiFi devices. For WTTx services, you'll need specific outdoor or indoor equipment provided by Camtel. Check our Products page for compatible devices.",
    category: 'technical',
  },
  {
    id: 12,
    question: "Why can't I access certain websites?",
    answer:
      "If you're unable to access certain websites, it could be due to: exhausted data balance, DNS issues, or network restrictions. First, check your data balance. Try clearing your browser cache or using a different browser. Contact support if the problem continues.",
    category: 'connectivity',
  },
  {
    id: 13,
    question: 'How do I check my signal strength?',
    answer:
      'On most devices, you can check signal strength in the status bar (bars icon) or in Settings > Network. For more detailed information, dial *#*#4636#*#* on Android or check Settings > Cellular on iPhone. Optimal signal is above -80 dBm.',
    category: 'connectivity',
  },
  {
    id: 14,
    question: 'How do I update my account information?',
    answer:
      "To update your account information, go to your profile settings by clicking on your name in the top right corner. Select 'Profile' to view and edit your personal details. Some changes may require verification.",
    category: 'account',
  },
  {
    id: 15,
    question: 'What should I do if my SIM card is lost or stolen?',
    answer:
      "If your SIM card is lost or stolen, contact Camtel support immediately at 8200 or visit the nearest Camtel service center. We'll block your SIM to prevent unauthorized use and help you get a replacement SIM with your existing number.",
    category: 'account',
  },
  {
    id: 16,
    question: 'How do I troubleshoot no network issues?',
    answer:
      'If you have no network: 1) Restart your device, 2) Check if the SIM is properly inserted, 3) Ensure airplane mode is off, 4) Check if your account is active and has balance, 5) Try the SIM in another device. If issues persist, contact support.',
    category: 'technical',
  },
];

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

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
            Frequently Asked Questions
          </h1>
          <p className="text-muted-foreground">
            Find answers to common questions about X-tremNet services
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/dashboard/support">
            <MessageSquare className="h-4 w-4 mr-2" />
            Contact Support
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
                placeholder="Search for answers..."
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
                Categories
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
                  {filteredFAQs.length} questions found
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
                              Category:
                            </span>
                            <Badge variant="secondary" className="capitalize">
                              {faq.category}
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
                  <h3 className="font-semibold mb-2">No results found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search or filter to find what you're
                    looking for.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-2">
            <Button variant="outline" size="sm" disabled>
              <ChevronLeft className="h-4 w-4 mr-1" />
              First
            </Button>
            <Button variant="outline" size="sm" disabled>
              Prev
            </Button>
            <Button variant="default" size="sm">
              1
            </Button>
            <Button variant="outline" size="sm">
              2
            </Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
            <Button variant="outline" size="sm">
              Last
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>

          {/* Still Need Help */}
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-bold mb-2">Still have questions?</h3>
              <p className="opacity-90 mb-4">
                Can't find the answer you're looking for? Our support team is
                here to help.
              </p>
              <Button variant="secondary" asChild>
                <Link href="/dashboard/support">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Submit a Request
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
