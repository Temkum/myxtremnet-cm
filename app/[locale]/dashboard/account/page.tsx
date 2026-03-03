'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import {
  CreditCard,
  User,
  ShieldCheck,
  Wifi,
  Package,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  RefreshCw,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

const accountInfo = {
  serviceNo: '620779967',
  lifeCycleState: 'Active',
  fraudState: 'Not blacklisted',
  accountHolder: 'KUM JUDE THADDEUS TEM',
  email: 'kum.thaddeus@email.com',
  phone: '+237620779967',
};

const balanceData = [
  {
    accountType: 'Bonus for all call',
    currentBalance: '50.00 FCFA',
    effectiveTime: '01/09/2025 20:47:27',
    expirationTime: '22/09/2025 00:00:00',
  },
  {
    accountType: 'PrepaidBalanceSubaccount',
    currentBalance: '0.00 FCFA',
    effectiveTime: '01/09/2022 15:22:12',
    expirationTime: '01/01/2037 00:00:00',
  },
  {
    accountType: 'Bonus for all call',
    currentBalance: '100.00 FCFA',
    effectiveTime: '08/08/2025 19:18:57',
    expirationTime: '07/09/2025 00:00:00',
  },
  {
    accountType: 'Bonus for all call',
    currentBalance: '100.00 FCFA',
    effectiveTime: '11/08/2025 10:26:58',
    expirationTime: '10/09/2025 00:00:00',
  },
  {
    accountType: 'Bonus for all call',
    currentBalance: '300.00 FCFA',
    effectiveTime: '14/08/2025 10:42:35',
    expirationTime: '13/10/2025 00:00:00',
  },
  {
    accountType: 'DATA',
    currentBalance: '0.336 GB',
    effectiveTime: '01/09/2025 20:48:03',
    expirationTime: '03/09/2025 20:48:03',
  },
];

const activeOffers = [
  {
    name: 'LTE Standard',
    data: '15 GB',
    used: '14.664 GB',
    remaining: '0.336 GB',
    expiresIn: '2 days',
    percentage: 97.76,
  },
];

export default function AccountPage() {
  const t = useTranslations('Account');
  const [activeTab, setActiveTab] = useState('account');

  const accountInfo = {
    serviceNo: '620779967',
    lifeCycleState: 'Active',
    fraudState: 'Not blacklisted',
    accountHolder: 'KUM JUDE THADDEUS TEM',
    email: 'kum.thaddeus@email.com',
    phone: '+237 620 779 967',
  };

  const balanceData = [
    {
      accountType: 'Bonus for all call',
      currentBalance: '50.00 FCFA',
      effectiveTime: '01/09/2025 20:47:27',
      expirationTime: '22/09/2025 00:00:00',
    },
    {
      accountType: 'PrepaidBalanceSubaccount',
      currentBalance: '0.00 FCFA',
      effectiveTime: '01/09/2022 15:22:12',
      expirationTime: '01/01/2037 00:00:00',
    },
    {
      accountType: 'Bonus for all call',
      currentBalance: '100.00 FCFA',
      effectiveTime: '08/08/2025 19:18:57',
      expirationTime: '07/09/2025 00:00:00',
    },
    {
      accountType: 'Bonus for all call',
      currentBalance: '100.00 FCFA',
      effectiveTime: '11/08/2025 10:26:58',
      expirationTime: '10/09/2025 00:00:00',
    },
    {
      accountType: 'Bonus for all call',
      currentBalance: '300.00 FCFA',
      effectiveTime: '14/08/2025 10:42:35',
      expirationTime: '13/10/2025 00:00:00',
    },
    {
      accountType: 'DATA',
      currentBalance: '0.336 GB',
      effectiveTime: '01/09/2025 20:48:03',
      expirationTime: '03/09/2025 20:48:03',
    },
  ];

  const activeOffers = [
    {
      name: 'LTE Standard',
      data: '15 GB',
      used: '14.664 GB',
      remaining: '0.336 GB',
      expiresIn: '2 days',
      percentage: 97.76,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {t('accountInformation')}
          </h1>
          <p className="text-muted-foreground">{t('manageAccountBilling')}</p>
        </div>
        <Button>
          <RefreshCw className="h-4 w-4 mr-2" />
          {t('refreshData')}
        </Button>
      </div>

      {/* Account Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  {accountInfo.accountHolder}
                </p>
                <p className="font-bold">{accountInfo.phone}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  {t('lifeCycleState')}
                </p>
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                  {accountInfo.lifeCycleState}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <ShieldCheck className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  {t('fraudState')}
                </p>
                <Badge
                  variant="outline"
                  className="text-green-600 border-green-200"
                >
                  {accountInfo.fraudState}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  {t('totalBalance')}
                </p>
                <p className="font-bold">550.00 FCFA</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Offer Status */}
      {activeOffers.map((offer, index) => (
        <Card key={index} className="bg-primary/5 border-primary/20">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Wifi className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{offer.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Total: {offer.data}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {t('expiresIn', { time: offer.expiresIn })}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>{t('dataUsage')}</span>
                <span className="font-medium">
                  {offer.used} / {offer.data}
                </span>
              </div>
              <Progress value={offer.percentage} className="h-3" />
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>
                  {t('used', { percentage: offer.percentage.toFixed(1) })}
                </span>
                <span>{t('remaining', { amount: offer.remaining })}</span>
              </div>
            </div>
            {offer.percentage > 90 && (
              <div className="mt-4 flex items-center gap-2 text-amber-600 bg-amber-50 p-3 rounded-lg">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">{t('dataRunningLow')}</span>
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      {/* Tabs for Account Info and Offer Information */}
      <Card>
        <Tabs defaultValue="account" className="w-full">
          <CardHeader className="border-b border-border pb-0">
            <TabsList className="w-1/2 justify-start">
              <TabsTrigger value="account" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {t('accountInformationTab')}
              </TabsTrigger>
              <TabsTrigger value="offers" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                {t('offerInformation')}
              </TabsTrigger>
            </TabsList>
          </CardHeader>
          <CardContent className="p-0">
            <TabsContent value="account" className="m-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-secondary/50">
                      <TableHead>{t('accountType')}</TableHead>
                      <TableHead>{t('currentBalance')}</TableHead>
                      <TableHead>{t('effectiveTime')}</TableHead>
                      <TableHead>{t('expirationTime')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {balanceData.map((item, index) => (
                      <TableRow key={index} className="hover:bg-secondary/30">
                        <TableCell className="font-medium">
                          {item.accountType}
                        </TableCell>
                        <TableCell>
                          <span className="font-semibold text-primary">
                            {item.currentBalance}
                          </span>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {item.effectiveTime}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {item.expirationTime}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            <TabsContent value="offers" className="m-0 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeOffers.map((offer, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Package className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{offer.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {t('package', { data: offer.data })}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            {t('remaining', { amount: offer.remaining })}
                          </span>
                          <span className="font-medium">{offer.remaining}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            {t('expiresIn', { time: offer.expiresIn })}
                          </span>
                          <span className="font-medium">{offer.expiresIn}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
              <RefreshCw className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h4 className="font-semibold">{t('rechargeAccount')}</h4>
              <p className="text-sm text-muted-foreground">
                {t('topUpBalance')}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Package className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold">{t('changePlan')}</h4>
              <p className="text-sm text-muted-foreground">
                {t('upgradeChangeOffer')}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h4 className="font-semibold">{t('viewHistory')}</h4>
              <p className="text-sm text-muted-foreground">
                {t('checkPastTransactions')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
