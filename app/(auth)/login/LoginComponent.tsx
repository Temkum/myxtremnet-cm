'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { phoneNumber as phoneNumberClient } from '@/lib/auth-client';
import { loginSchema, otpSchema } from '@/lib/validations/auth';
import type { LoginInput, OtpInput } from '@/lib/validations/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Step = 'phone' | 'otp';

export function LoginComponent() {
  const router = useRouter();

  const [step, setStep] = useState<Step>('phone');
  const [submittedPhone, setSubmittedPhone] = useState('');
  const [serverError, setServerError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  // ---- Step 1: phone form ----
  const phoneForm = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    mode: 'onTouched', // validate on blur, not just submit
    criteriaMode: 'firstError', // show only the first Zod error per field
    defaultValues: { phoneNumber: '' },
  });

  // ---- Step 2: OTP form ----
  const otpForm = useForm<OtpInput>({
    resolver: zodResolver(otpSchema),
    mode: 'onTouched',
    criteriaMode: 'firstError',
    defaultValues: { phoneNumber: '', code: '' },
  });

  const handleSendOtp = async (values: LoginInput) => {
    setServerError('');
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

    router.push('/dashboard');
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
            {step === 'phone'
              ? 'Enter your phone number to receive a one-time code'
              : `Enter the 6-digit code sent to ${submittedPhone}`}
          </p>
        </div>

        {/* Step 1 — Phone number */}
        {step === 'phone' && (
          <form
            onSubmit={phoneForm.handleSubmit(handleSendOtp)}
            className="space-y-4"
          >
            <div className="space-y-1.5">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="+237 650 000 000"
                autoComplete="tel"
                {...phoneForm.register('phoneNumber')}
              />
              {phoneForm.formState.errors.phoneNumber && (
                <p className="text-xs text-destructive">
                  {phoneForm.formState.errors.phoneNumber.message}
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
