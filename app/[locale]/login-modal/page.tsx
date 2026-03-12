'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { phoneNumber as phoneNumberClient } from '@/lib/auth-client';
import {
  loginSchema,
  otpSchema,
  type LoginInput,
  type OtpInput,
} from '@/lib/validations/auth';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Step = 'phone' | 'otp';

import { useTranslations } from 'next-intl';

export function LoginModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const t = useTranslations('login');
  const [step, setStep] = useState<Step>('phone');
  const [submittedPhone, setSubmittedPhone] = useState('');
  const [serverError, setServerError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [sendCooldown, setSendCooldown] = useState(0);

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
      setServerError(error.message ?? (t('failedSendOtp') || 'Failed to send OTP. Try again.'));
      return;
    }

    setSubmittedPhone(values.phoneNumber);
    otpForm.setValue('phoneNumber', values.phoneNumber);
    setStep('otp');
    startCooldown();
    startSendCooldown();
  };

  const handleVerifyOtp = async (values: OtpInput) => {
    setServerError('');
    const { error } = await phoneNumberClient.verify({
      phoneNumber: values.phoneNumber,
      code: values.code,
    });

    if (error) {
      setServerError(error.message ?? (t('invalidCode') || 'Invalid or expired code.'));
      return;
    }

    onClose();
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setServerError('');
    const { error } = await phoneNumberClient.sendOtp({
      phoneNumber: submittedPhone,
    });
    if (error) {
      setServerError(error.message ?? (t('failedResendOtp') || 'Failed to resend OTP.'));
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

  const startSendCooldown = () => {
    setSendCooldown(60);
    const interval = setInterval(() => {
      setSendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{t('title')}</DialogTitle>
          <DialogDescription>
            {step === 'phone'
              ? t('phoneStep')
              : t('otpStep', { phone: submittedPhone })}
          </DialogDescription>
        </DialogHeader>

        {/* Step 1 — Phone number */}
        {step === 'phone' && (
          <form
            onSubmit={phoneForm.handleSubmit(handleSendOtp)}
            className="space-y-4 pt-4"
          >
            <div className="space-y-1.5">
              <Label htmlFor="phoneNumber">{t('phoneLabel')}</Label>
              <Input
                id="phoneNumber"
                type="tel"
                placeholder={t('phonePlaceholder')}
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
              disabled={phoneForm.formState.isSubmitting || sendCooldown > 0}
            >
              {sendCooldown > 0
                ? t('resendIn', { seconds: sendCooldown })
                : phoneForm.formState.isSubmitting
                  ? t('sending')
                  : t('sendCode')}
            </Button>
          </form>
        )}

        {/* Step 2 — OTP */}
        {step === 'otp' && (
          <form
            onSubmit={otpForm.handleSubmit(handleVerifyOtp)}
            className="space-y-4 pt-4"
          >
            <div className="space-y-1.5">
              <Label htmlFor="code">{t('codeLabel')}</Label>
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
                : t('verifySignIn')}
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
                {t('changeNumber')}
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
      </DialogContent>
    </Dialog>
  );
}

export default LoginModal;
