'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  getSession,
  phoneNumber as phoneNumberClient,
  signIn,
} from '@/lib/auth-client';
import { useTranslations } from 'next-intl';
import {
  loginSchema,
  otpSchema,
  phonePasswordSchema,
} from '@/lib/validations/auth';
import type {
  LoginInput,
  OtpInput,
  PhonePasswordInput,
} from '@/lib/validations/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from '@/src/i18n/navigation';

type Step = 'phone' | 'otp' | 'password';
type AuthMode = 'otp' | 'password';

export function LoginComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations('Auth');
  const callbackUrl = searchParams.get('callbackUrl') ?? '/dashboard';

  const [step, setStep] = useState<Step>('phone');

  const translateError = (error: { message?: string } | undefined) => {
    if (!error?.message) return null;
    return t(error.message as any) ?? error.message;
  };

  const [mode, setMode] = useState<AuthMode>('otp');
  const [submittedPhone, setSubmittedPhone] = useState('');
  const [serverError, setServerError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [devOtp, setDevOtp] = useState('');

  const passwordForm = useForm<PhonePasswordInput>({
    resolver: zodResolver(phonePasswordSchema),
    mode: 'onTouched',
    defaultValues: { phoneNumber: '', password: '' },
  });

  const phoneForm = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    mode: 'onTouched',
    defaultValues: { phoneNumber: '' },
  });

  const otpForm = useForm<OtpInput>({
    resolver: zodResolver(otpSchema),
    mode: 'onTouched',
    defaultValues: { phoneNumber: '', code: '' },
  });

  useEffect(() => {
    if (step !== 'otp' || !submittedPhone) return;

    let cancelled = false;

    const fetchOtp = async () => {
      try {
        const res = await fetch(
          `/api/otp/display?phone=${encodeURIComponent(submittedPhone)}`,
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
  }, [step, submittedPhone]);

  const handleSendOtp = async (values: LoginInput) => {
    setServerError('');
    setDevOtp('');

    const fullPhone = `+237${values.phoneNumber}`;

    const { error } = await phoneNumberClient.sendOtp({
      phoneNumber: fullPhone,
    });

    if (error) {
      setServerError(error.message ?? t('failedOTP'));
      return;
    }

    setSubmittedPhone(fullPhone);
    otpForm.setValue('phoneNumber', values.phoneNumber);
    setStep('otp');
    startCooldown();
  };

  const handlePhonePassword = async (values: PhonePasswordInput) => {
    setServerError('');

    const fullPhone = `+237${values.phoneNumber}`;

    const { error } = await signIn.phoneNumber({
      phoneNumber: fullPhone,
      password: values.password,
      rememberMe: true,
    });

    if (error) {
      setServerError(error.message ?? t('invalidPhone&Password'));
      return;
    }

    await redirectByRole();
  };

  const handleVerifyOtp = async (values: OtpInput) => {
    setServerError('');

    const fullPhone = submittedPhone || `+237${values.phoneNumber}`;

    const { error } = await phoneNumberClient.verify({
      phoneNumber: fullPhone,
      code: values.code,
    });

    if (error) {
      setServerError(error.message ?? t('invalidExpiredCode'));
      return;
    }

    await redirectByRole();
  };

  const redirectByRole = async () => {
    const { data: session } = await getSession();
    console.log('session after login:', JSON.stringify(session, null, 2));
    const role = (session?.user as any)?.role ?? 'user';
    router.push(role === 'admin' ? '/admin/dashboard' : '/dashboard');
    router.refresh();
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setServerError('');

    const { error } = await phoneNumberClient.sendOtp({
      phoneNumber: submittedPhone,
    });

    if (error) {
      setServerError(error.message ?? t('failedResendOTP'));
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
            <Link href="/">{t('loginText')}</Link>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {step === 'phone' && mode === 'otp'
              ? t('loginOtp')
              : step === 'phone' && mode === 'password'
                ? t('loginPassword')
                : step === 'otp'
                  ? t('optReq', {
                      phoneNumber: submittedPhone?.replace('+237', ''),
                    })
                  : t('loginPassword')}
          </p>
          {step === 'phone' && (
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

        {step === 'phone' && mode === 'otp' && (
          <form
            onSubmit={phoneForm.handleSubmit(handleSendOtp)}
            className="space-y-4"
          >
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
                  placeholder="620000000"
                  maxLength={9}
                  className="rounded-l-none"
                  {...phoneForm.register('phoneNumber', {
                    onChange: (e) => {
                      const clean = e.target.value
                        .replace(/\D/g, '')
                        .slice(0, 9);
                      phoneForm.setValue('phoneNumber', clean, {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                    },
                  })}
                />
              </div>
              {phoneForm.formState.errors.phoneNumber && (
                <p className="text-xs text-destructive">
                  {translateError(phoneForm.formState.errors.phoneNumber)}
                </p>
              )}
            </div>

            {serverError && (
              <p className="text-sm text-destructive">{serverError}</p>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={phoneForm.formState.isSubmitting}
            >
              {phoneForm.formState.isSubmitting
                ? 'Sending code...'
                : t('sendCode')}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              {t('noAccount')}{' '}
              <a href="/register" className="underline font-medium">
                {t('register')}
              </a>
            </p>
          </form>
        )}

        {step === 'phone' && mode === 'password' && (
          <form
            onSubmit={passwordForm.handleSubmit(handlePhonePassword)}
            className="space-y-4"
          >
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
                  placeholder="620000000"
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
              <Label htmlFor="password">{t('pwd')}</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                autoComplete="current-password"
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
              {passwordForm.formState.isSubmitting ? t('loading') : t('signIn')}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              {t('noAccount')}{' '}
              <a href="/register" className="underline font-medium">
                {t('register')}
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

              {devOtp && (
                <div className="rounded-md border border-border bg-muted px-4 py-3 text-center">
                  <p className="text-xs text-muted-foreground mb-1">
                    {t('verificationCode')}
                  </p>
                  <p className="text-2xl font-mono font-bold tracking-[0.4em]">
                    {devOtp}
                  </p>
                </div>
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
              {otpForm.formState.isSubmitting ? t('loading') : t('verify')}
            </Button>

            <div className="flex items-center justify-between text-sm">
              <button
                type="button"
                onClick={() => {
                  setStep('phone');
                  setServerError('');
                  setDevOtp('');
                  otpForm.reset();
                }}
                className="text-muted-foreground underline"
              >
                {t('numChange')}
              </button>
              <button
                type="button"
                onClick={handleResend}
                disabled={resendCooldown > 0}
                className="text-muted-foreground underline disabled:opacity-40"
              >
                {resendCooldown > 0
                  ? `${t('resendCode')} in ${resendCooldown}s`
                  : t('resendCode')}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
