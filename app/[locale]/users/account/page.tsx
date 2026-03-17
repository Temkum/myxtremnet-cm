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
import { Input } from '@/components/ui/input';
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
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { activeOffers, balanceData, accountInfo } from '@/data/user';
import { useAuth } from '@/lib/auth-context';
import { systemStats, allUsers, auditLogs, promotions } from '@/data/admin';

export default function AccountPage() {
  const t = useTranslations('Account');
  const { session, user, isAdmin } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

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
                <p className="text-sm text-muted-foreground">{user?.name}</p>
                <p className="font-bold">{user?.name}</p>
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
                <p className="font-bold">{accountInfo.totalBalance} FCFA</p>
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
            <TabsList className="w-full justify-start flex-wrap">
              <TabsTrigger value="account" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {t('accountInformationTab')}
              </TabsTrigger>
              <TabsTrigger value="offers" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                {t('offerInformation')}
              </TabsTrigger>
              {isAdmin && (
                <>
                  <TabsTrigger
                    value="overview"
                    className="flex items-center gap-2"
                  >
                    <TrendingUp className="h-4 w-4" />
                    {t('systemOverview')}
                  </TabsTrigger>
                  <TabsTrigger
                    value="users"
                    className="flex items-center gap-2"
                  >
                    <Users className="h-4 w-4" />
                    {t('userManagement')}
                  </TabsTrigger>
                  <TabsTrigger value="bulk" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    {t('bulkOperations')}
                  </TabsTrigger>
                  <TabsTrigger
                    value="audit"
                    className="flex items-center gap-2"
                  >
                    <FileText className="h-4 w-4" />
                    {t('auditLogs')}
                  </TabsTrigger>
                </>
              )}
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

            {/* Admin Tabs */}
            {isAdmin && (
              <>
                <TabsContent value="overview" className="m-0 p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <Users className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Total Users
                            </p>
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
                            <p className="text-sm text-muted-foreground">
                              Active Users
                            </p>
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
                            <p className="text-sm text-muted-foreground">
                              Total Revenue
                            </p>
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
                            <p className="text-sm text-muted-foreground">
                              Monthly Revenue
                            </p>
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
                            <p className="text-sm text-muted-foreground">
                              Active Offers
                            </p>
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
                </TabsContent>

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

                <TabsContent value="bulk" className="m-0 p-6">
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <h3 className="font-semibold">
                          Bulk Account Suspension
                        </h3>
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
              </>
            )}
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
