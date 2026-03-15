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

export default function BulkPage() {
  const { user, isAdmin } = useAuth();
  const [selectedPromotion, setSelectedPromotion] = useState('');
  const [phoneNumbers, setPhoneNumbers] = useState('');
  const [bulkAction, setBulkAction] = useState<'suspend' | 'promote'>(
    'suspend',
  );

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Access Restricted
          </h1>
          <p className="text-muted-foreground">
            You don't have permission to access bulk operations.
          </p>
        </div>
      </div>
    );
  }

  const handleBulkSuspend = () => {
    console.log('Suspending accounts:', phoneNumbers);
    // Implement bulk suspend logic
  };

  const handleBulkPromotion = () => {
    console.log('Applying promotion:', selectedPromotion);
    // Implement bulk promotion logic
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Bulk Operations
          </h1>
          <p className="text-muted-foreground">
            Perform mass operations on user accounts
          </p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Template
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
                <p className="text-sm text-muted-foreground">Total Users</p>
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
                  Active Promotions
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
                  Operations Today
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
              <h3 className="font-semibold">Bulk Account Suspension</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Suspend multiple user accounts at once
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Phone Numbers (comma separated)
              </label>
              <textarea
                placeholder="Enter phone numbers separated by commas...&#10;Example: +237 620 779 967, +237 698 123 456"
                value={phoneNumbers}
                onChange={(e) => setPhoneNumbers(e.target.value)}
                className="w-full min-h-[100px] p-3 border border-input rounded-md resize-none"
              />
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <AlertCircle className="h-4 w-4" />
              <span>
                {phoneNumbers.split(',').filter((p) => p.trim()).length} numbers
                entered
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={handleBulkSuspend}
                className="bg-red-600 hover:bg-red-700"
              >
                <Ban className="h-4 w-4 mr-2" />
                Suspend Accounts
              </Button>
              <Button variant="outline" onClick={() => setPhoneNumbers('')}>
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Bulk Promotion Application */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-green-600" />
              <h3 className="font-semibold">Bulk Promotion Application</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Apply promotions to multiple users
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Select Promotion
              </label>
              <select
                value={selectedPromotion}
                onChange={(e) => setSelectedPromotion(e.target.value)}
                className="w-full h-10 px-3 py-2 border border-input rounded-md bg-background"
              >
                <option value="">Choose a promotion...</option>
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
                    Promotion will be applied to{' '}
                    {allUsers.filter((u) => u.role !== 'admin').length} regular
                    users
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
                Apply to All Users
              </Button>
              <Button
                variant="outline"
                onClick={() => setSelectedPromotion('')}
              >
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Operations */}
      <Card>
        <CardHeader>
          <h3 className="font-semibold">Recent Bulk Operations</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                  <Ban className="h-4 w-4 text-red-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">Account Suspension</p>
                  <p className="text-xs text-muted-foreground">
                    5 accounts suspended
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">
                  2025-09-15 14:30
                </p>
                <Badge variant="outline">Completed</Badge>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                  <Package className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">Promotion Applied</p>
                  <p className="text-xs text-muted-foreground">
                    50% Bonus Data to 150 users
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">
                  2025-09-15 13:45
                </p>
                <Badge variant="outline">Completed</Badge>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <Users className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">User Import</p>
                  <p className="text-xs text-muted-foreground">
                    200 users imported from CSV
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">
                  2025-09-15 10:15
                </p>
                <Badge variant="outline">Completed</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
