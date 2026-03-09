'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { phoneNumber as phoneNumberClient, signIn } from '@/lib/auth-client';
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
import { Alert, AlertDescription } from '@/components/ui/alert';

type Step = 'phone' | 'otp' | 'password';
type AuthMode = 'otp' | 'password';

export function LoginComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') ?? '/dashboard';

  const [step, setStep] = useState<Step>('phone');
  const [mode, setMode] = useState<AuthMode>('otp');
  const [submittedPhone, setSubmittedPhone] = useState('');
  const [serverError, setServerError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [devOtp, setDevOtp] = useState('');

  // Step 3: phone + password form
  const passwordForm = useForm<PhonePasswordInput>({
    resolver: zodResolver(phonePasswordSchema),
    mode: 'onTouched',
    criteriaMode: 'firstError',
    defaultValues: { phoneNumber: '', password: '' },
  });

  // Step 1: phone form
  const phoneForm = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    mode: 'onTouched', // validate on blur, not just submit
    criteriaMode: 'firstError', // show only the first Zod error per field
    defaultValues: { phoneNumber: '' },
  });

  // Step 2: OTP form
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
        if (match && match[1] === submittedPhone) {
          setDevOtp(match[2]);
        }
        originalLog(...args);
      };
      return () => {
        console.log = originalLog;
      };
    }
  }, [step, submittedPhone]);

  const handleSendOtp = async (values: LoginInput) => {
    setServerError('');
    setDevOtp('');
    const { error } = await phoneNumberClient.sendOtp({
      phoneNumber: values.phoneNumber,
    });

    if (error) {
      setServerError(error.message ?? 'Failed to send OTP. Try again.');
      return;
    }

    setSubmittedPhone(values.phoneNumber);
    otpForm.setValue('phoneNumber', values.phoneNumber);
    setStep('otp');
    startCooldown();
  };

  const handlePhonePassword = async (values: PhonePasswordInput) => {
    setServerError('');
    const { error } = await signIn.phoneNumber({
      phoneNumber: values.phoneNumber,
      password: values.password,
      rememberMe: true,
    });

    if (error) {
      setServerError(error.message ?? 'Invalid phone number or password.');
      return;
    }

    router.push(callbackUrl);
    router.refresh();
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

    router.push(callbackUrl);
    router.refresh();
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setServerError('');
    const { error } = await phoneNumberClient.sendOtp({
      phoneNumber: submittedPhone,
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
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight">
            Sign in to Camtel
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {step === 'phone' && mode === 'otp'
              ? 'Enter your phone number to receive a one-time code'
              : step === 'phone' && mode === 'password'
                ? 'Enter your phone number and password'
                : step === 'otp'
                  ? `Enter the 6-digit code sent to ${submittedPhone}`
                  : 'Enter your phone number and password'}
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
                Password
              </Button>
            </div>
          )}
        </div>

        {/* Step 1 — Phone number */}
        {step === 'phone' && mode === 'otp' && (
          <form
            onSubmit={phoneForm.handleSubmit(handleSendOtp)}
            className="space-y-4"
          >
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-sm text-muted-foreground select-none">
                +237
              </span>
              <Input
                id="phoneNumber"
                type="tel"
                inputMode="numeric"
                placeholder="620 000 000"
                autoComplete="tel"
                maxLength={9}
                className="rounded-l-none"
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, '').slice(0, 9);
                  e.target.value = digits;
                  phoneForm.setValue(
                    'phoneNumber',
                    digits ? `+237${digits}` : '',
                    {
                      shouldValidate: true,
                    },
                  );
                }}
                onBlur={() => phoneForm.trigger('phoneNumber')}
              />
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
                : 'Send verification code'}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{' '}
              <a href="/register" className="underline font-medium">
                Register
              </a>
            </p>
          </form>
        )}

        {/* Step 1 — Phone + Password */}
        {step === 'phone' && mode === 'password' && (
          <form
            onSubmit={passwordForm.handleSubmit(handlePhonePassword)}
            className="space-y-4"
          >
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-sm text-muted-foreground select-none">
                +237
              </span>
              <Input
                id="phoneNumberPassword"
                type="tel"
                inputMode="numeric"
                placeholder="620 000 000"
                autoComplete="tel"
                maxLength={9}
                className="rounded-l-none"
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, '').slice(0, 9);
                  e.target.value = digits;
                  passwordForm.setValue(
                    'phoneNumber',
                    digits ? `+237${digits}` : '',
                    {
                      shouldValidate: true,
                    },
                  );
                }}
                onBlur={() => passwordForm.trigger('phoneNumber')}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                autoComplete="current-password"
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
                ? 'Signing in...'
                : 'Sign in'}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{' '}
              <a href="/register" className="underline font-medium">
                Register
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
              <Label htmlFor="code">Verification Code</Label>
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
                    Auto-fill & verify
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={otpForm.formState.isSubmitting}
            >
              {otpForm.formState.isSubmitting
                ? 'Verifying...'
                : 'Verify & sign in'}
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
                Change number
              </button>
              <button
                type="button"
                onClick={handleResend}
                disabled={resendCooldown > 0}
                className="text-muted-foreground underline disabled:opacity-40"
              >
                {resendCooldown > 0
                  ? `Resend in ${resendCooldown}s`
                  : 'Resend code'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
