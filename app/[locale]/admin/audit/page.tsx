'use client';

import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import {
  FileText,
  Search,
  Download,
  Filter,
  Calendar,
  User,
  Activity,
  Settings,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { auditLogs } from '@/data/admin';
import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function AuditPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const t = useTranslations('Audit');

  return (
    <div className="p-12">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{t('title')}</h1>
            <p className="text-muted-foreground">{t('subtitle')}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              {t('filter')}
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              {t('export')}
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Search and Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  {t('totalLogs')}
                </p>
                <p className="font-bold text-xl">{auditLogs.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                <User className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  {t('userActions')}
                </p>
                <p className="font-bold text-xl">
                  {
                    auditLogs.filter(
                      (log) =>
                        log.action === 'login' ||
                        log.action === 'recharge_account',
                    ).length
                  }
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
                  {t('adminActions')}
                </p>
                <p className="font-bold text-xl">
                  {auditLogs.filter((log) => log.user.includes('ADMIN')).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                <Activity className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('today')}</p>
                <p className="font-bold text-xl">
                  {
                    auditLogs.filter((log) =>
                      log.timestamp.includes('2025-09-15'),
                    ).length
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Logs Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary/50">
                  <TableHead>{t('timestamp')}</TableHead>
                  <TableHead>{t('user')}</TableHead>
                  <TableHead>{t('action')}</TableHead>
                  <TableHead>{t('details')}</TableHead>
                  <TableHead>{t('ipAddress')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {auditLogs
                  .filter(
                    (log) =>
                      log.user
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                      log.action
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                      log.details
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()),
                  )
                  .map((log) => (
                    <TableRow key={log.id} className="hover:bg-secondary/30">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {log.timestamp}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div
                            className={`h-2 w-2 rounded-full ${
                              log.user.includes('ADMIN')
                                ? 'bg-orange-500'
                                : 'bg-blue-500'
                            }`}
                          />
                          <span className="font-medium">{log.user}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            log.action.includes('suspend')
                              ? 'border-red-200 text-red-700'
                              : log.action.includes('admin')
                                ? 'border-orange-200 text-orange-700'
                                : 'border-gray-200'
                          }
                        >
                          {log.action.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm max-w-xs truncate">
                        {log.details}
                      </TableCell>
                      <TableCell className="text-muted-foreground font-mono text-sm">
                        {log.ipAddress}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
