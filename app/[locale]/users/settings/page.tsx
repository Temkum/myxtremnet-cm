'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/auth-context';
import { useTranslations } from 'next-intl';

export default function SettingsPage() {
  const { user } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const t = useTranslations('Settings');

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    if (password.length < 6) {
      setError(t('pwdCharacter'));
      return;
    }
    if (password !== confirmPassword) {
      setError(t('pwdMatch'));
      return;
    }
    // Simulate password change
    setSuccess(true);
    setPassword('');
    setConfirmPassword('');
  };

  if (!user) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        {t('loginReq')}
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto py-12">
      <Card>
        <CardHeader>
          <CardTitle>{t('changePassword')}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <Input
              type="password"
              placeholder={t('newPassword')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder={t('confirmPassword')}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {error && <div className="text-destructive text-sm">{error}</div>}
            {success && (
              <div className="text-green-600 text-sm">{t('pwdSuccess')}</div>
            )}
            <Button type="submit" className="w-full">
              {t('changePassword')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
