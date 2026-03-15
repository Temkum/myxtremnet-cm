'use client';

import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  TrendingUp,
  Users,
  DollarSign,
  Activity,
  Package,
  Ban,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { systemStats, allUsers, promotions } from '@/data/admin';

export default function DashboardPage() {
  const { user, isAdmin } = useAuth();

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Access Restricted
          </h1>
          <p className="text-muted-foreground">
            You don't have permission to access the admin dashboard.
          </p>
        </div>
      </div>
    );
  }

  const growthRate = (
    (systemStats.activeUsers / systemStats.totalUsers) *
    100
  ).toFixed(1);
  const avgBalance =
    allUsers.reduce((sum, user) => sum + user.balance, 0) / allUsers.length;

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            System Overview
          </h1>
          <p className="text-muted-foreground">
            Monitor system performance and key metrics
          </p>
        </div>
        <Button>
          <TrendingUp className="h-4 w-4 mr-2" />
          Generate Report
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                  <p className="font-bold text-xl">
                    {systemStats.totalUsers.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-green-600">
                <ArrowUp className="h-4 w-4" />
                <span className="text-sm font-medium">12%</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <Activity className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Users</p>
                  <p className="font-bold text-xl">
                    {systemStats.activeUsers.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-green-600">
                <ArrowUp className="h-4 w-4" />
                <span className="text-sm font-medium">{growthRate}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="font-bold text-xl">
                    {(systemStats.totalRevenue / 1000000).toFixed(1)}M FCFA
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-green-600">
                <ArrowUp className="h-4 w-4" />
                <span className="text-sm font-medium">8%</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Monthly Revenue
                  </p>
                  <p className="font-bold text-xl">
                    {(systemStats.monthlyRevenue / 1000000).toFixed(1)}M FCFA
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-red-600">
                <ArrowDown className="h-4 w-4" />
                <span className="text-sm font-medium">3%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Statistics */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <h3 className="font-semibold">User Statistics</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-secondary/30 rounded-lg">
                  <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{systemStats.totalUsers}</p>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                </div>
                <div className="text-center p-4 bg-secondary/30 rounded-lg">
                  <Activity className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold">
                    {systemStats.activeUsers}
                  </p>
                  <p className="text-sm text-muted-foreground">Active Users</p>
                </div>
                <div className="text-center p-4 bg-secondary/30 rounded-lg">
                  <Ban className="h-8 w-8 text-red-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold">
                    {systemStats.suspendedAccounts}
                  </p>
                  <p className="text-sm text-muted-foreground">Suspended</p>
                </div>
                <div className="text-center p-4 bg-secondary/30 rounded-lg">
                  <DollarSign className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{avgBalance.toFixed(0)}</p>
                  <p className="text-sm text-muted-foreground">Avg Balance</p>
                </div>
              </div>

              {/* User Growth Chart Placeholder */}
              <div className="h-40 bg-secondary/20 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <TrendingUp className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    User growth chart
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Health */}
        <Card>
          <CardHeader>
            <h3 className="font-semibold">System Health</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-sm">Server Uptime</span>
                </div>
                <Badge className="bg-green-100 text-green-700">99.9%</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-sm">Database</span>
                </div>
                <Badge className="bg-green-100 text-green-700">Healthy</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-yellow-500" />
                  <span className="text-sm">API Response</span>
                </div>
                <Badge className="bg-yellow-100 text-yellow-700">120ms</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-sm">Error Rate</span>
                </div>
                <Badge className="bg-green-100 text-green-700">0.1%</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-sm">Storage</span>
                </div>
                <Badge className="bg-green-100 text-green-700">67%</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Promotions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <h3 className="font-semibold">Recent Activity</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <Users className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">New User Registration</p>
                    <p className="text-xs text-muted-foreground">
                      MARIE CLAIRE NGO joined
                    </p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">2h ago</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                    <DollarSign className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Account Recharge</p>
                    <p className="text-xs text-muted-foreground">
                      SOPHIE ETOGA recharged 1000 FCFA
                    </p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">3h ago</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                    <Ban className="h-4 w-4 text-red-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Account Suspended</p>
                    <p className="text-xs text-muted-foreground">
                      JEAN PIERRE KAMGA suspended
                    </p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">5h ago</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Promotions */}
        <Card>
          <CardHeader>
            <h3 className="font-semibold">Active Promotions</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {promotions
                .filter((p) => p.active)
                .map((promo) => (
                  <div
                    key={promo.id}
                    className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                        <Package className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{promo.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {promo.description}
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-700">
                      Active
                    </Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
