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

/**
 * Registration flow:
 * 1. User fills in details (phone, email, name)
 * 2. We send OTP to the phone number
 * 3. User enters OTP → Better Auth creates account via signUpOnVerification
 *
 * After account creation, the user's name, email are updated
 * via a PATCH to /api/user/profile (you implement that endpoint separately
 * using auth.api.getSession + db.update).
 *
 * Why this approach: Better Auth's phoneNumber plugin creates the user on
 * OTP verification. There's no built-in "register with extra fields" endpoint
 * for the phone plugin, so we store extra fields after verification.
 */

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

  // Step 3: phone + password registration
  const passwordForm = useForm<PhonePasswordRegisterInput>({
    resolver: zodResolver(phonePasswordRegisterSchema),
    mode: 'onTouched',
    criteriaMode: 'firstError',
    defaultValues: {
      fullName: '',
      phoneNumber: '',
      email: '',
      password: '',
    },
  });

  // Step 1: registration details
  const detailsForm = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    mode: 'onTouched',
    criteriaMode: 'firstError',
    defaultValues: {
      phoneNumber: '',
      email: '',
      fullName: '',
    },
  });

  // Step 2: OTP
  const otpForm = useForm<OtpInput>({
    resolver: zodResolver(otpSchema),
    mode: 'onTouched',
    criteriaMode: 'firstError',
    defaultValues: { phoneNumber: '', code: '' },
  });

  // Dev mode: capture OTP from console logs
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && step === 'otp') {
      const originalLog = console.log;
      console.log = (...args) => {
        const message = args.join(' ');
        const match = message.match(/📱 OTP for ([+\d]+): (\d{6})/);
        if (match && match[1] === pendingData?.phoneNumber) {
          setDevOtp(match[2]);
        }
        originalLog(...args);
      };
      return () => {
        console.log = originalLog;
      };
    }
  }, [step, pendingData]);

  const handleSendOtp = async (values: RegisterInput) => {
    setServerError('');
    setDevOtp('');
    const { error } = await phoneNumberClient.sendOtp({
      phoneNumber: values.phoneNumber,
    });

    if (error) {
      setServerError(error.message ?? 'Failed to send OTP. Try again.');
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

    const { error: signUpError } = await signUp.email({
      email: `${values.phoneNumber.replace(/[^0-9]/g, '')}@phone.camtel.local`,
      password: values.password,
      name: values.fullName,
    });

    const { error: signUpError2 } = await signUp.email({
      email: `${values.phoneNumber.replace(/[^0-9]/g, '')}@phone.camtel.local`,
      password: values.password,
      name: values.fullName, // Better Auth accepts name at signup
    });

    if (signUpError) {
      const status = (signUpError as { status?: number } | null)?.status;
      const message =
        (signUpError as { message?: string } | null)?.message?.toLowerCase() ??
        '';

      if (
        status === 409 ||
        status === 422 ||
        message.includes('already exists') ||
        message.includes('use another email')
      ) {
        setServerError('Phone number is already registered. Please sign in.');
        return;
      }

      setServerError(
        (signUpError as { message?: string } | null)?.message ??
          'Registration failed. Try again.',
      );
      return;
    }

    if (signUpError2) {
      // Catch duplicate phone — unique constraint on the generated email means
      // this phone number already has an account.
      if (
        signUpError2.status === 409 ||
        signUpError2.message?.toLowerCase().includes('already')
      ) {
        setServerError(
          'This phone number is already registered. Sign in instead.',
        );
        return;
      }
      setServerError(signUpError2.message ?? 'Registration failed. Try again.');
      return;
    }

    // Update profile with phone, email, and serviceId
    const res = await fetch('/api/user/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        name: values.fullName,
        email: values.email,
        phoneNumber: values.phoneNumber,
      }),
    });

    if (!res.ok) {
      console.error('Profile update failed after registration');
    }

    router.push('/dashboard');
    router.refresh();
  };

  const handleVerifyOtp = async (values: OtpInput) => {
    setServerError('');

    // Verify OTP — Better Auth creates the user via signUpOnVerification
    const { error } = await phoneNumberClient.verify({
      phoneNumber: values.phoneNumber,
      code: values.code,
    });

    if (error) {
      setServerError(error.message ?? 'Invalid or expired code.');
      return;
    }

    // Update user profile with the extra fields collected at registration
    if (pendingData) {
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: pendingData.fullName,
          email: pendingData.email,
          phoneNumber: pendingData.phoneNumber,
        }),
      });

      if (!res.ok) {
        // Non-fatal — account is created, profile update failed
        console.error('Profile update failed after registration');
      }
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

        {/* Step 1 — Details (OTP) */}
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
                  {detailsForm.formState.errors.fullName.message}
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
                  placeholder="6207799669"
                  maxLength={9}
                  className="rounded-l-none"
                  onChange={(e) => {
                    const digits = e.target.value
                      .replace(/\D/g, '')
                      .slice(0, 9);
                    detailsForm.setValue(
                      'phoneNumber',
                      digits ? `+237${digits}` : '',
                      {
                        shouldValidate: true,
                      },
                    );
                  }}
                />
              </div>
              {detailsForm.formState.errors.phoneNumber && (
                <p className="text-xs text-destructive">
                  {detailsForm.formState.errors.phoneNumber.message}
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
                  {detailsForm.formState.errors.email.message}
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
                ? 'Sending code...'
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

        {/* Step 1 — Details (Password) */}
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
                  {passwordForm.formState.errors.fullName.message}
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
                  placeholder="620779969"
                  maxLength={9}
                  className="rounded-l-none"
                  onChange={(e) => {
                    const digits = e.target.value
                      .replace(/\D/g, '')
                      .slice(0, 9);
                    passwordForm.setValue(
                      'phoneNumber',
                      digits ? `+237${digits}` : '',
                      {
                        shouldValidate: true,
                      },
                    );
                  }}
                />
              </div>
              {passwordForm.formState.errors.phoneNumber && (
                <p className="text-xs text-destructive">
                  {passwordForm.formState.errors.phoneNumber.message}
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
                  {passwordForm.formState.errors.email.message}
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
                  {passwordForm.formState.errors.password.message}
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

        {/* Step 2 — OTP */}
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
                  {otpForm.formState.errors.code.message}
                </p>
              )}
            </div>

            {serverError && (
              <p className="text-sm text-destructive">{serverError}</p>
            )}

            {devOtp && (
              <Alert className="mt-4">
                <AlertDescription>
                  <strong>Dev mode:</strong> OTP is {devOtp}
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="ml-2"
                    onClick={() => {
                      otpForm.setValue('code', devOtp);
                      otpForm.handleSubmit(handleVerifyOtp)();
                    }}
                  >
                    {t('autoFillVerify')}
                  </Button>
                </AlertDescription>
              </Alert>
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
