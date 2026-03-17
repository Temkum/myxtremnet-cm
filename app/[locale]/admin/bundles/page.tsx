'use client';

import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Package,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  Upload,
  Wifi,
  DollarSign,
  Users,
  Activity,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import AdminGuard from '@/components/AdminGuard';

// Mock bundles data
const bundles = [
  {
    id: '1',
    name: 'LTE Standard',
    description: 'High-speed 4G LTE internet for everyday use',
    price: 15000,
    data: '15 GB',
    validity: '30 days',
    type: 'data',
    active: true,
    subscribers: 1250,
    category: 'LTE',
  },
  {
    id: '2',
    name: 'WTTx Premium',
    description: 'Premium wireless broadband for home and office',
    price: 25000,
    data: '50 GB',
    validity: '30 days',
    type: 'data',
    active: true,
    subscribers: 890,
    category: 'WTTx',
  },
  {
    id: '3',
    name: 'Weekend Special',
    description: 'Weekend data bundle with bonus data',
    price: 5000,
    data: '5 GB',
    validity: '3 days',
    type: 'data',
    active: false,
    subscribers: 450,
    category: 'Promo',
  },
  {
    id: '4',
    name: 'Night Owl',
    description: 'Unlimited data from 12AM to 6AM',
    price: 8000,
    data: 'Unlimited',
    validity: '30 days',
    type: 'data',
    active: true,
    subscribers: 320,
    category: 'Special',
  },
];

export default function BundlesPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const t = useTranslations('AdminBundles');

  const filteredBundles = bundles.filter((bundle) => {
    const matchesSearch =
      bundle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bundle.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === 'all' || bundle.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const totalSubscribers = bundles.reduce(
    (sum, bundle) => sum + bundle.subscribers,
    0,
  );
  const activeBundles = bundles.filter((bundle) => bundle.active).length;

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('title')}</h1>
          <p className="text-muted-foreground">{t('subtitle')}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            {t('import')}
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            {t('addBundle')}
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Package className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  {t('totalBundles')}
                </p>
                <p className="font-bold text-xl">{bundles.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                <Activity className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  {t('activeBundles')}
                </p>
                <p className="font-bold text-xl">{activeBundles}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  {t('totalSubscribers')}
                </p>
                <p className="font-bold text-xl">
                  {totalSubscribers.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  {t('avgRevenue')}
                </p>
                <p className="font-bold text-xl">
                  {Math.round(
                    bundles.reduce(
                      (sum, b) => sum + b.price * b.subscribers,
                      0,
                    ) / totalSubscribers,
                  ).toLocaleString()}{' '}
                  FCFA
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder={t('searchBundles')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 border border-input rounded-md bg-background"
              >
                <option value="all">{t('allCategories')}</option>
                <option value="LTE">LTE</option>
                <option value="WTTx">WTTx</option>
                <option value="Promo">Promo</option>
                <option value="Special">Special</option>
              </select>
            </div>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              {t('export')}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBundles.map((bundle) => (
              <Card
                key={bundle.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Wifi className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{bundle.name}</h3>
                        <Badge variant="outline" className="text-xs">
                          {bundle.category}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Badge
                        className={
                          bundle.active
                            ? 'bg-green-100 text-green-700 hover:bg-green-100'
                            : 'bg-red-100 text-red-700 hover:bg-red-100'
                        }
                      >
                        {bundle.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    {bundle.description}
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {t('data')}:
                      </span>
                      <span className="font-medium">{bundle.data}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {t('validity')}:
                      </span>
                      <span className="font-medium">{bundle.validity}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {t('priceLabel')}:
                      </span>
                      <span className="font-medium">
                        {bundle.price.toLocaleString()} FCFA
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {t('subscribers')}:
                      </span>
                      <span className="font-medium">{bundle.subscribers}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Edit className="h-4 w-4 mr-1" />
                      {t('edit')}
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Users className="h-4 w-4 mr-1" />
                      {t('viewUsers')}
                    </Button>
                    <Button size="sm" variant="outline">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
