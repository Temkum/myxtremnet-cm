'use client';

import React from 'react';
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
import { Input } from '@/components/ui/input';
import {
  Users,
  TrendingUp,
  DollarSign,
  Activity,
  Ban,
  FileText,
  Search,
  Download,
  Settings,
  Eye,
  Edit,
  Package,
  Wifi,
  CreditCard,
  User,
  ShieldCheck,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  RefreshCw,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/lib/auth-context';
import { systemStats, allUsers, auditLogs, promotions } from '@/data/admin';
import { activeOffers, balanceData, accountInfo } from '@/data/user';
import { useState } from 'react';

export default function AdminDashboard() {
  const t = useTranslations('Account');
  const { user, isAdmin } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

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

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">
            System management and user administration
          </p>
        </div>
        <Button>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Data
        </Button>
      </div>

      {/* System Overview Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
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
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
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
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="font-bold text-xl">
                  {systemStats.totalRevenue.toLocaleString()} FCFA
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Monthly Revenue</p>
                <p className="font-bold text-xl">
                  {systemStats.monthlyRevenue.toLocaleString()} FCFA
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-cyan-100 flex items-center justify-center">
                <Package className="h-5 w-5 text-cyan-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Offers</p>
                <p className="font-bold text-xl">
                  {systemStats.activeOffers.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                <Ban className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Suspended Accounts
                </p>
                <p className="font-bold text-xl">
                  {systemStats.suspendedAccounts}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Admin Tabs */}
      <Card>
        <Tabs defaultValue="users" className="w-full">
          <CardHeader className="border-b border-border pb-0">
            <TabsList className="w-full justify-start flex-wrap">
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                {t('userManagement')}
              </TabsTrigger>
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                {t('systemOverview')}
              </TabsTrigger>
              <TabsTrigger value="bulk" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                {t('bulkOperations')}
              </TabsTrigger>
              <TabsTrigger value="audit" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                {t('auditLogs')}
              </TabsTrigger>
            </TabsList>
          </CardHeader>
          <CardContent className="p-0">
            <TabsContent value="users" className="m-0 p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-secondary/50">
                        <TableHead>Name</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Service ID</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Balance</TableHead>
                        <TableHead>Join Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {allUsers
                        .filter(
                          (user) =>
                            user.name
                              .toLowerCase()
                              .includes(searchTerm.toLowerCase()) ||
                            user.phoneNumber.includes(searchTerm),
                        )
                        .map((user) => (
                          <TableRow
                            key={user.id}
                            className="hover:bg-secondary/30"
                          >
                            <TableCell className="font-medium">
                              {user.name}
                            </TableCell>
                            <TableCell>{user.phoneNumber}</TableCell>
                            <TableCell>{user.serviceId}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  user.role === 'admin'
                                    ? 'default'
                                    : 'secondary'
                                }
                              >
                                {user.role}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={
                                  user.status === 'active'
                                    ? 'bg-green-100 text-green-700 hover:bg-green-100'
                                    : 'bg-red-100 text-red-700 hover:bg-red-100'
                                }
                              >
                                {user.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {user.balance.toLocaleString()} FCFA
                            </TableCell>
                            <TableCell>{user.joinDate}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button size="sm" variant="outline">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                {user.role !== 'admin' && (
                                  <Button
                                    size="sm"
                                    variant={
                                      user.status === 'active'
                                        ? 'destructive'
                                        : 'default'
                                    }
                                  >
                                    <Ban className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="overview" className="m-0 p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <h3 className="font-semibold">Recent User Activity</h3>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {allUsers.slice(0, 5).map((user) => (
                          <div
                            key={user.id}
                            className="flex items-center justify-between"
                          >
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <User className="h-4 w-4 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium text-sm">
                                  {user.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {user.phoneNumber}
                                </p>
                              </div>
                            </div>
                            <Badge variant="outline">{user.lastActive}</Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <h3 className="font-semibold">System Health</h3>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Server Uptime</span>
                          <Badge className="bg-green-100 text-green-700">
                            99.9%
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Database Status</span>
                          <Badge className="bg-green-100 text-green-700">
                            Healthy
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">API Response Time</span>
                          <Badge className="bg-green-100 text-green-700">
                            120ms
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Error Rate</span>
                          <Badge className="bg-green-100 text-green-700">
                            0.1%
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="bulk" className="m-0 p-6">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <h3 className="font-semibold">Bulk Account Suspension</h3>
                    <p className="text-sm text-muted-foreground">
                      Select users to suspend their accounts
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <Input placeholder="Enter phone numbers (comma separated)" />
                        <Button>Suspend Accounts</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <h3 className="font-semibold">
                      Bulk Promotion Application
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Apply promotions to multiple users
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                          <option value="">Select promotion</option>
                          {promotions.map((promo) => (
                            <option key={promo.id} value={promo.id}>
                              {promo.name}
                            </option>
                          ))}
                        </select>
                        <Button>Apply to All Users</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="audit" className="m-0 p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search audit logs..."
                      className="pl-10"
                    />
                  </div>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-secondary/50">
                        <TableHead>Timestamp</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>Details</TableHead>
                        <TableHead>IP Address</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {auditLogs.map((log) => (
                        <TableRow
                          key={log.id}
                          className="hover:bg-secondary/30"
                        >
                          <TableCell className="text-muted-foreground">
                            {log.timestamp}
                          </TableCell>
                          <TableCell className="font-medium">
                            {log.user}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {log.action.replace('_', ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">
                            {log.details}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {log.ipAddress}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  );
}
