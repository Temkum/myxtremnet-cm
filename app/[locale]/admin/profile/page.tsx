'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  User,
  Mail,
  Phone,
  Shield,
  Calendar,
  Settings,
  Key,
  Save,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function AdminProfilePage() {
  const { user, isAdmin } = useAuth();
  const t = useTranslations('Admin');
  const [showPassword, setShowPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phoneNumber || '',
    serviceId: user?.serviceId || '',
  });

  console.log(user);

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            {t('accessRestricted')}
          </h1>
          <p className="text-muted-foreground">{t('noPermissionAdmin')}</p>
        </div>
      </div>
    );
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log('Saving profile data:', formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      phone: user?.phoneNumber || '',
      serviceId: user?.serviceId || '',
    });
    setIsEditing(false);
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {t('adminProfile')}
          </h1>
          <p className="text-muted-foreground">{t('profileDescription')}</p>
        </div>
        <div className="flex gap-2">
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>
              <Settings className="h-4 w-4 mr-2" />
              {t('editProfile')}
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={handleCancel}>
                {t('cancel')}
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                {t('saveChanges')}
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              {t('profileInformation')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t('fullName')}</Label>
                {isEditing ? (
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder={t('enterFullName')}
                  />
                ) : (
                  <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/30">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{formData.name || t('notSpecified')}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">{t('phoneNumber')}</Label>
                {isEditing ? (
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder={t('enterPhone')}
                  />
                ) : (
                  <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/30">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{formData.phone || t('notSpecified')}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="serviceId">{t('serviceId')}</Label>
                <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/30">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <span>{formData.serviceId || t('notSpecified')}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">{t('emailAddress')}</Label>
                <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/30">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{user?.email || t('notSpecified')}</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Account Status */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">{t('accountStatus')}</h3>
              <div className="flex items-center gap-4">
                <Badge className="bg-green-100 text-green-700">
                  {t('active')}
                </Badge>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {t('memberSince')} {new Date().toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                {t('quickActions')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Key className="h-4 w-4 mr-2" />
                {t('changePassword')}
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Shield className="h-4 w-4 mr-2" />
                {t('securitySettings')}
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Eye className="h-4 w-4 mr-2" />
                {t('privacySettings')}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                {t('adminPrivileges')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">{t('userManagement')}</span>
                  <Badge variant="secondary">{t('fullAccess')}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">{t('systemSettings')}</span>
                  <Badge variant="secondary">{t('fullAccess')}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">{t('auditLogs')}</span>
                  <Badge variant="secondary">{t('readOnly')}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">{t('billingManagement')}</span>
                  <Badge variant="secondary">{t('fullAccess')}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
