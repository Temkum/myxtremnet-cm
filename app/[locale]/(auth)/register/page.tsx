'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter, Link } from '@/i18n/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { phoneNumber as phoneNumberClient } from '@/lib/auth-client';
import { registerSchema, otpSchema } from '@/lib/validations/auth';
import type { RegisterInput, OtpInput } from '@/lib/validations/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Step = 'details' | 'otp';

export default function RegisterPage() {
  const t = useTranslations('register');
  const router = useRouter();

  const [step, setStep] = useState<Step>('details');
  const [pendingData, setPendingData] = useState<RegisterInput | null>(null);
  const [serverError, setServerError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  const detailsForm = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    mode: 'onTouched',
    criteriaMode: 'firstError',
    defaultValues: { phoneNumber: '', email: '', fullName: '', serviceId: '' },
  });

  const otpForm = useForm<OtpInput>({
    resolver: zodResolver(otpSchema),
    mode: 'onTouched',
    criteriaMode: 'firstError',
    defaultValues: { phoneNumber: '', code: '' },
  });

  const handleSendOtp = async (values: RegisterInput) => {
    setServerError('');
    const { error } = await phoneNumberClient.sendOtp({
      phoneNumber: values.phoneNumber,
    });
    if (error) {
      setServerError(error.message ?? 'Failed to send OTP.');
      return;
    }
    setPendingData(values);
    otpForm.setValue('phoneNumber', values.phoneNumber);
    setStep('otp');
    startCooldown();
  };

  const handleVerifyOtp = async (values: OtpInput) => {
    setServerError('');
    const { error } = await phoneNumberClient.verify({
      phoneNumber: values.phoneNumber,
      code: values.code,
    });
    if (error) {
      setServerError(error.message ?? 'Invalid or expired code.');
      return;
    }
    if (pendingData) {
      await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: pendingData.fullName,
          email: pendingData.email,
          serviceId: pendingData.serviceId,
        }),
      });
    }
    router.push('/dashboard');
    router.refresh();
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || !pendingData) return;
    setServerError('');
    const { error } = await phoneNumberClient.sendOtp({
      phoneNumber: pendingData.phoneNumber,
    });
    if (error) {
      setServerError(error.message ?? 'Failed to resend OTP.');
      return;
    }
    startCooldown();
  };

  const startCooldown = () => {
    setResendCooldown(60);
    const interval = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight">{t('title')}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {step === 'details'
              ? t('detailsStep')
              : t('otpStep', { phone: pendingData?.phoneNumber ?? '' })}
          </p>
        </div>

        {step === 'details' && (
          <form
            onSubmit={detailsForm.handleSubmit(handleSendOtp)}
            className="space-y-4"
          >
            <div className="space-y-1.5">
              <Label htmlFor="fullName">{t('fullNameLabel')}</Label>
              <Input
                id="fullName"
                placeholder={t('fullNamePlaceholder')}
                autoComplete="name"
                {...detailsForm.register('fullName')}
              />
              {detailsForm.formState.errors.fullName && (
                <p className="text-xs text-destructive">
                  {detailsForm.formState.errors.fullName.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phoneNumber">{t('phoneLabel')}</Label>
              <Input
                id="phoneNumber"
                type="tel"
                placeholder={t('phonePlaceholder')}
                autoComplete="tel"
                {...detailsForm.register('phoneNumber')}
              />
              {detailsForm.formState.errors.phoneNumber && (
                <p className="text-xs text-destructive">
                  {detailsForm.formState.errors.phoneNumber.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">{t('emailLabel')}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t('emailPlaceholder')}
                autoComplete="email"
                {...detailsForm.register('email')}
              />
              {detailsForm.formState.errors.email && (
                <p className="text-xs text-destructive">
                  {detailsForm.formState.errors.email.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="serviceId">{t('serviceIdLabel')}</Label>
              <Input
                id="serviceId"
                type="text"
                inputMode="numeric"
                placeholder={t('serviceIdPlaceholder')}
                {...detailsForm.register('serviceId')}
              />
              <p className="text-xs text-muted-foreground">
                {t('serviceIdHint')}
              </p>
              {detailsForm.formState.errors.serviceId && (
                <p className="text-xs text-destructive">
                  {detailsForm.formState.errors.serviceId.message}
                </p>
              )}
            </div>
            {serverError && (
              <p className="text-sm text-destructive">{serverError}</p>
            )}
            <Button
              type="submit"
              className="w-full"
              disabled={detailsForm.formState.isSubmitting}
            >
              {detailsForm.formState.isSubmitting
                ? t('sending')
                : t('continue')}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              {t('hasAccount')}{' '}
              <Link href="/login" className="underline font-medium">
                {t('signIn')}
              </Link>
            </p>
          </form>
        )}

        {step === 'otp' && (
          <form
            onSubmit={otpForm.handleSubmit(handleVerifyOtp)}
            className="space-y-4"
          >
            <div className="space-y-1.5">
              <Label htmlFor="code">
                {t('codeLabel', { defaultValue: 'Verification Code' })}
              </Label>
              <Input
                id="code"
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="123456"
                autoComplete="one-time-code"
                className="text-center tracking-[0.5em] text-lg font-mono"
                {...otpForm.register('code')}
              />
              {otpForm.formState.errors.code && (
                <p className="text-xs text-destructive">
                  {otpForm.formState.errors.code.message}
                </p>
              )}
            </div>
            {serverError && (
              <p className="text-sm text-destructive">{serverError}</p>
            )}
            <Button
              type="submit"
              className="w-full"
              disabled={otpForm.formState.isSubmitting}
            >
              {otpForm.formState.isSubmitting
                ? t('verifying')
                : t('verifyCreate')}
            </Button>
            <div className="flex items-center justify-between text-sm">
              <button
                type="button"
                onClick={() => {
                  setStep('details');
                  setServerError('');
                }}
                className="text-muted-foreground underline"
              >
                {t('goBack')}
              </button>
              <button
                type="button"
                onClick={handleResend}
                disabled={resendCooldown > 0}
                className="text-muted-foreground underline disabled:opacity-40"
              >
                {resendCooldown > 0
                  ? t('resendIn', { seconds: resendCooldown })
                  : t('resendCode')}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
