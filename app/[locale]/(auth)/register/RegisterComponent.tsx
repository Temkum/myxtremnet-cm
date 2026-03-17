'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { phoneNumber as phoneNumberClient, signUp } from '@/lib/auth-client';
import { useTranslations } from 'next-intl';
import {
  registerSchema,
  otpSchema,
  phonePasswordRegisterSchema,
} from '@/lib/validations/auth';
import type {
  RegisterInput,
  OtpInput,
  PhonePasswordRegisterInput,
} from '@/lib/validations/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Link } from '@/src/i18n/navigation';

type Step = 'details' | 'otp' | 'password';
type AuthMode = 'otp' | 'password';

export default function RegisterComponent() {
  const router = useRouter();
  const t = useTranslations('Auth');
  const [step, setStep] = useState<Step>('details');
  const [mode, setMode] = useState<AuthMode>('otp');
  const [pendingData, setPendingData] = useState<RegisterInput | null>(null);
  const [serverError, setServerError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [devOtp, setDevOtp] = useState('');

  const translateError = (error: { message?: string } | undefined) => {
    if (!error?.message) return null;
    return t(error.message as any) ?? error.message;
  };

  const passwordForm = useForm<PhonePasswordRegisterInput>({
    resolver: zodResolver(phonePasswordRegisterSchema),
    mode: 'onTouched',
    defaultValues: {
      fullName: '',
      phoneNumber: '',
      email: '',
      password: '',
    },
  });

  const detailsForm = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    mode: 'onTouched',
    defaultValues: {
      phoneNumber: '',
      email: '',
      fullName: '',
    },
  });

  const otpForm = useForm<OtpInput>({
    resolver: zodResolver(otpSchema),
    mode: 'onTouched',
    defaultValues: { phoneNumber: '', code: '' },
  });

  useEffect(() => {
    if (step !== 'otp' || !pendingData?.phoneNumber) return;

    let cancelled = false;

    const fetchOtp = async () => {
      try {
        const res = await fetch(
          `/api/otp/display?phone=${encodeURIComponent(pendingData.phoneNumber)}`,
        );

        if (!res.ok) return;

        const data = await res.json();
        if (!cancelled && data.code) {
          setDevOtp(data.code);
        }
      } catch {
        // silent fail
        console.error('Failed to fetch OTP');
      }
    };

    fetchOtp();

    return () => {
      cancelled = true;
    };
  }, [step, pendingData?.phoneNumber]);

  const handleSendOtp = async (values: RegisterInput) => {
    setServerError('');
    setDevOtp('');

    const fullPhone = `+237${values.phoneNumber}`;

    const { error } = await phoneNumberClient.sendOtp({
      phoneNumber: fullPhone,
    });

    if (error) {
      setServerError(
        error.message ?? translateError({ message: error.message }) ?? '',
      );
      return;
    }

    setPendingData(values);
    otpForm.setValue('phoneNumber', values.phoneNumber);
    setStep('otp');
    startCooldown();
  };

  const handlePhonePasswordRegister = async (
    values: PhonePasswordRegisterInput,
  ) => {
    setServerError('');

    const fullPhone = `+237${values.phoneNumber}`;
    const fakeEmail = `${values.phoneNumber}@phone.camtel.local`;

    const { error: signUpError } = await signUp.email({
      email: fakeEmail,
      password: values.password,
      name: values.fullName,
    });

    if (signUpError) {
      const status = (signUpError as any)?.status;
      const msg = (signUpError as any)?.message?.toLowerCase() ?? '';

      if (
        status === 409 ||
        status === 422 ||
        msg.includes('already exists') ||
        msg.includes('use another email')
      ) {
        setServerError(translateError({ message: signUpError.message }) ?? '');
        return;
      }

      setServerError(
        signUpError.message ??
          translateError({ message: signUpError.message }) ??
          '',
      );
      return;
    }

    const res = await fetch('/api/user/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        name: values.fullName,
        email: values.email,
        phoneNumber: fullPhone,
      }),
    });

    if (!res.ok) {
      console.error('Profile update failed after registration');
    }

    router.push('/users');
    router.refresh();
  };

  const handleVerifyOtp = async (values: OtpInput) => {
    setServerError('');

    const fullPhone = pendingData
      ? `+237${pendingData.phoneNumber}`
      : `+237${values.phoneNumber}`;

    const { error } = await phoneNumberClient.verify({
      phoneNumber: fullPhone,
      code: values.code,
    });

    if (error) {
      setServerError(
        error.message ?? translateError({ message: error.message }) ?? '',
      );
      return;
    }

    if (pendingData) {
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: pendingData.fullName,
          email: pendingData.email,
          phoneNumber: `+237${pendingData.phoneNumber}`,
        }),
      });

      if (!res.ok) {
        console.error('Profile update failed after OTP verification');
      }
    }

    router.push('/users');
    router.refresh();
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || !pendingData) return;
    setServerError('');

    const fullPhone = `+237${pendingData.phoneNumber}`;

    const { error } = await phoneNumberClient.sendOtp({
      phoneNumber: fullPhone,
    });

    if (error) {
      setServerError(
        error.message ?? translateError({ message: error.message }) ?? '',
      );
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
          <h1 className="text-2xl font-bold tracking-tight">
            <Link href="/">{t('createAccount')}</Link>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {step === 'details' && mode === 'otp'
              ? t('fillDetails')
              : step === 'details' && mode === 'password'
                ? t('fillDetailsPassword')
                : step === 'otp'
                  ? t('optReq', { phoneNumber: pendingData!.phoneNumber })
                  : t('fillDetailsPassword')}
          </p>
          {step === 'details' && (
            <div className="mt-3 flex justify-center gap-2">
              <Button
                type="button"
                variant={mode === 'otp' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setMode('otp')}
              >
                OTP
              </Button>
              <Button
                type="button"
                variant={mode === 'password' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setMode('password')}
              >
                {t('pwd')}
              </Button>
            </div>
          )}
        </div>

        {step === 'details' && mode === 'otp' && (
          <form
            onSubmit={detailsForm.handleSubmit(handleSendOtp)}
            className="space-y-4"
          >
            <div className="space-y-1.5">
              <Label htmlFor="fullName">{t('fullName')}</Label>
              <Input
                id="fullName"
                placeholder="Jean-Pierre Mbarga"
                autoComplete="name"
                {...detailsForm.register('fullName')}
              />
              {detailsForm.formState.errors.fullName && (
                <p className="text-xs text-destructive">
                  {translateError(detailsForm.formState.errors.fullName)}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phoneNumber">{t('phone')}</Label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-sm text-muted-foreground select-none">
                  +237
                </span>
                <Input
                  id="phoneNumber"
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="620779969"
                  maxLength={9}
                  className="rounded-l-none"
                  {...detailsForm.register('phoneNumber', {
                    onChange: (e) => {
                      const clean = e.target.value
                        .replace(/\D/g, '')
                        .slice(0, 9);
                      detailsForm.setValue('phoneNumber', clean, {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                    },
                  })}
                />
              </div>
              {detailsForm.formState.errors.phoneNumber && (
                <p className="text-xs text-destructive">
                  {translateError(detailsForm.formState.errors.phoneNumber)}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">{t('email')}</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                {...detailsForm.register('email')}
              />
              {detailsForm.formState.errors.email && (
                <p className="text-xs text-destructive">
                  {translateError(detailsForm.formState.errors.email)}
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
                ? t('sendingCode')
                : t('continue')}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              {t('alreadySignup')}{' '}
              <a href="/login" className="underline font-medium">
                {t('signIn')}
              </a>
            </p>
          </form>
        )}

        {step === 'details' && mode === 'password' && (
          <form
            onSubmit={passwordForm.handleSubmit(handlePhonePasswordRegister)}
            className="space-y-4"
          >
            <div className="space-y-1.5">
              <Label htmlFor="fullNamePassword">{t('fullName')}</Label>
              <Input
                id="fullNamePassword"
                placeholder="Jean-Pierre Mbarga"
                autoComplete="name"
                {...passwordForm.register('fullName')}
              />
              {passwordForm.formState.errors.fullName && (
                <p className="text-xs text-destructive">
                  {translateError(passwordForm.formState.errors.fullName)}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phoneNumberPassword">{t('phone')}</Label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-sm text-muted-foreground select-none">
                  +237
                </span>
                <Input
                  id="phoneNumberPassword"
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="620779969"
                  maxLength={9}
                  className="rounded-l-none"
                  {...passwordForm.register('phoneNumber', {
                    onChange: (e) => {
                      const clean = e.target.value
                        .replace(/\D/g, '')
                        .slice(0, 9);
                      passwordForm.setValue('phoneNumber', clean, {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                    },
                  })}
                />
              </div>
              {passwordForm.formState.errors.phoneNumber && (
                <p className="text-xs text-destructive">
                  {translateError(passwordForm.formState.errors.phoneNumber)}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="emailPassword">{t('email')}</Label>
              <Input
                id="emailPassword"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                {...passwordForm.register('email')}
              />
              {passwordForm.formState.errors.email && (
                <p className="text-xs text-destructive">
                  {translateError(passwordForm.formState.errors.email)}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">{t('pwd')}</Label>
              <Input
                id="password"
                type="password"
                placeholder={t('createPwd')}
                autoComplete="new-password"
                {...passwordForm.register('password')}
              />
              {passwordForm.formState.errors.password && (
                <p className="text-xs text-destructive">
                  {translateError(passwordForm.formState.errors.password)}
                </p>
              )}
            </div>

            {serverError && (
              <p className="text-sm text-destructive">{serverError}</p>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={passwordForm.formState.isSubmitting}
            >
              {passwordForm.formState.isSubmitting
                ? t('creatingAccount')
                : t('createAccount')}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              {t('alreadySignup')}{' '}
              <a href="/login" className="underline font-medium">
                {t('signIn')}
              </a>
            </p>
          </form>
        )}

        {step === 'otp' && (
          <form
            onSubmit={otpForm.handleSubmit(handleVerifyOtp)}
            className="space-y-4"
          >
            <div className="space-y-1.5">
              <Label htmlFor="code">{t('verificationCode')}</Label>
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
                  {translateError(otpForm.formState.errors.code)}
                </p>
              )}
            </div>

            {serverError && (
              <p className="text-sm text-destructive">{serverError}</p>
            )}

            {devOtp && (
              <div className="rounded-md border border-border bg-muted px-4 py-3 text-center">
                <p className="text-xs text-muted-foreground mb-1">
                  {t('verificationCode')}
                </p>
                <p className="text-2xl font-mono font-bold tracking-[0.4em]">
                  {devOtp}
                </p>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="mt-2"
                  onClick={() => {
                    otpForm.setValue('code', devOtp);
                    otpForm.handleSubmit(handleVerifyOtp)();
                  }}
                >
                  {t('autoFillVerify')}
                </Button>
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={otpForm.formState.isSubmitting}
            >
              {otpForm.formState.isSubmitting ? t('verifying') : t('verifyAcc')}
            </Button>

            <div className="flex items-center justify-between text-sm">
              <button
                type="button"
                onClick={() => {
                  setStep('details');
                  setServerError('');
                  setDevOtp('');
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
