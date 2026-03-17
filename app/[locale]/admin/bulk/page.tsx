'use client';

import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Settings,
  Users,
  Package,
  Ban,
  Download,
  Upload,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { promotions, allUsers } from '@/data/admin';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import AdminGuard from '@/components/AdminGuard';

export default function BulkPage() {
  const { user, isAdmin } = useAuth();
  const [selectedPromotion, setSelectedPromotion] = useState('');
  const [phoneNumbers, setPhoneNumbers] = useState('');
  const [bulkAction, setBulkAction] = useState<'suspend' | 'promote'>(
    'suspend',
  );
  const t = useTranslations('Bulk');

  const handleBulkSuspend = () => {
    console.log('Suspending accounts:', phoneNumbers);
    // Implement bulk suspend logic
  };

  const handleBulkPromotion = () => {
    console.log('Applying promotion:', selectedPromotion);
    // Implement bulk promotion logic
  };

  return (
    <AdminGuard fallbackMessage={t('noPermission')}>
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{t('title')}</h1>
            <p className="text-muted-foreground">{t('subtitle')}</p>
          </div>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            {t('exportTemplate')}
          </Button>
        </div>

        {/* Operation Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t('totalUsers')}
                  </p>
                  <p className="font-bold text-xl">{allUsers.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <Package className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t('activePromotions')}
                  </p>
                  <p className="font-bold text-xl">
                    {promotions.filter((p) => p.active).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                  <Settings className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t('operationsToday')}
                  </p>
                  <p className="font-bold text-xl">12</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bulk Operations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bulk Account Suspension */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Ban className="h-5 w-5 text-red-600" />
                <h3 className="font-semibold">{t('bulkSuspension')}</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                {t('bulkSuspensionDesc')}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  {t('phoneNumbersLabel')}
                </label>
                <textarea
                  placeholder={t('phoneNumbersPlaceholder')}
                  value={phoneNumbers}
                  onChange={(e) => setPhoneNumbers(e.target.value)}
                  className="w-full min-h-[100px] p-3 border border-input rounded-md resize-none"
                />
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <AlertCircle className="h-4 w-4" />
                <span>
                  {phoneNumbers.split(',').filter((p) => p.trim()).length}{' '}
                  {t('numbersEntered')}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleBulkSuspend}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <Ban className="h-4 w-4 mr-2" />
                  {t('suspendAccounts')}
                </Button>
                <Button variant="outline" onClick={() => setPhoneNumbers('')}>
                  {t('clear')}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Bulk Promotion Application */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-green-600" />
                <h3 className="font-semibold">{t('bulkPromotion')}</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                {t('bulkPromotionDesc')}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  {t('selectPromotion')}
                </label>
                <select
                  value={selectedPromotion}
                  onChange={(e) => setSelectedPromotion(e.target.value)}
                  className="w-full h-10 px-3 py-2 border border-input rounded-md bg-background"
                >
                  <option value="">{t('choosePromotion')}</option>
                  {promotions.map((promo) => (
                    <option key={promo.id} value={promo.id}>
                      {promo.name} - {promo.description}
                    </option>
                  ))}
                </select>
              </div>
              {selectedPromotion && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                  <div className="flex items-center gap-2 text-sm text-green-700">
                    <CheckCircle className="h-4 w-4" />
                    <span>
                      {t('promotionAppliedTo', {
                        count: allUsers.filter((u) => u.role !== 'admin')
                          .length,
                      })}
                    </span>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleBulkPromotion}
                  disabled={!selectedPromotion}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Package className="h-4 w-4 mr-2" />
                  {t('applyToAllUsers')}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSelectedPromotion('')}
                >
                  {t('clear')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Operations */}
        <Card>
          <CardHeader>
            <h3 className="font-semibold">{t('recentOperations')}</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                    <Ban className="h-4 w-4 text-red-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">
                      {t('accountSuspension')}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t('accountsSuspended', { count: 5 })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">
                    2025-09-15 14:30
                  </p>
                  <Badge variant="outline">{t('completed')}</Badge>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                    <Package className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">
                      {t('promotionApplied')}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t('bonusDataToUsers', { percentage: 50, count: 150 })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">
                    2025-09-15 13:45
                  </p>
                  <Badge variant="outline">{t('completed')}</Badge>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <Users className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{t('userImport')}</p>
                    <p className="text-xs text-muted-foreground">
                      {t('usersImported', { count: 200 })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">
                    2025-09-15 10:15
                  </p>
                  <Badge variant="outline">{t('completed')}</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminGuard>
  );
}
