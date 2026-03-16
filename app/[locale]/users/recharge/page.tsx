'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  CreditCard,
  Smartphone,
  Wallet,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Shield,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

const rechargeOptions = [
  { value: '1000', label: '1,000 FCFA', bonus: '' },
  { value: '2000', label: '2,000 FCFA', bonus: '' },
  { value: '5000', label: '5,000 FCFA', bonus: '10% bonus' },
  { value: '10000', label: '10,000 FCFA', bonus: '15% bonus' },
  { value: '20000', label: '20,000 FCFA', bonus: '20% bonus' },
  { value: '50000', label: '50,000 FCFA', bonus: '25% bonus' },
];

const paymentMethods = [
  {
    id: 'mobile-money',
    name: 'Mobile Money',
    icon: Smartphone,
    description: 'MTN, Orange Money',
  },
  {
    id: 'card',
    name: 'Credit/Debit Card',
    icon: CreditCard,
    description: 'Visa, Mastercard',
  },
  {
    id: 'voucher',
    name: 'Recharge Voucher',
    icon: Wallet,
    description: 'Use scratch card',
  },
];

export default function RechargePage() {
  const t = useTranslations('Recharge');
  const [selectedAmount, setSelectedAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [showAlert, setShowAlert] = useState(true);

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {t('rechargeAccount')}
          </h1>
          <p className="text-muted-foreground">{t('topUpAccount')}</p>
        </div>
        <Badge variant="outline" className="w-fit">
          <Wallet className="h-3 w-3 mr-1" />
          {t('currentBalance', { balance: '550.00' })}
        </Badge>
      </div>

      {/* System Alert */}
      {showAlert && (
        <Alert
          variant="destructive"
          className="bg-destructive/10 border-destructive/20"
        >
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{t('systemNotice', { ns: 'Services' })}</AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <span>{t('systemAbnormalities', { ns: 'Services' })}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAlert(false)}
            >
              OK
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recharge Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Amount Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <RefreshCw className="h-5 w-5 text-primary" />
                {t('selectAmount')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Preset Amounts */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {rechargeOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setSelectedAmount(option.value);
                      setCustomAmount('');
                    }}
                    className={`relative p-4 rounded-lg border-2 transition-all text-left ${
                      selectedAmount === option.value
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <span className="font-semibold">{option.label}</span>
                    {option.bonus && (
                      <Badge className="absolute -top-2 -right-2 bg-green-500 hover:bg-green-500 text-xs">
                        {option.bonus}
                      </Badge>
                    )}
                  </button>
                ))}
              </div>

              {/* Custom Amount */}
              <div className="space-y-2">
                <Label>{t('orEnterCustomAmount')}</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder={t('enterAmount')}
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      setSelectedAmount('');
                    }}
                    className="flex-1"
                  />
                  <span className="flex items-center px-3 bg-secondary rounded-md text-sm">
                    FCFA
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                {t('paymentMethod')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-lg border-2 transition-all text-left ${
                      paymentMethod === method.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center">
                      <method.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{method.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {method.description}
                      </p>
                    </div>
                    <div
                      className={`h-5 w-5 rounded-full border-2 ${
                        paymentMethod === method.id
                          ? 'border-primary bg-primary'
                          : 'border-muted-foreground'
                      }`}
                    >
                      {paymentMethod === method.id && (
                        <CheckCircle className="h-full w-full text-primary-foreground" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Phone Number for Mobile Money */}
          {paymentMethod === 'mobile-money' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {t('mobileMoneyDetails')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>{t('provider')}</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder={t('selectProvider')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mtn">{t('mtnMobileMoney')}</SelectItem>
                      <SelectItem value="orange">{t('orangeMoney')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>{t('phoneNumber')}</Label>
                  <Input type="tel" placeholder="+237 6XX XXX XXX" />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Voucher Code */}
          {paymentMethod === 'voucher' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t('voucherDetails')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>{t('voucherCode')}</Label>
                  <Input placeholder={t('enterVoucherCode')} />
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <Card className="sticky top-24">
            <CardHeader className="bg-primary text-primary-foreground rounded-t-lg">
              <CardTitle className="text-lg">{t('orderSummary')}</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {t('serviceNo')}
                  </span>
                  <span className="font-medium">620779967</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {t('rechargeAmount')}
                  </span>
                  <span className="font-medium">
                    {selectedAmount
                      ? `${parseInt(selectedAmount).toLocaleString()} FCFA`
                      : customAmount
                        ? `${parseInt(customAmount).toLocaleString()} FCFA`
                        : t('notSelected')}
                  </span>
                </div>
                {selectedAmount &&
                  rechargeOptions.find((o) => o.value === selectedAmount)
                    ?.bonus && (
                    <div className="flex justify-between text-green-600">
                      <span>{t('bonus')}</span>
                      <span>
                        {
                          rechargeOptions.find(
                            (o) => o.value === selectedAmount,
                          )?.bonus
                        }
                      </span>
                    </div>
                  )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {t('paymentMethod')}
                  </span>
                  <span className="font-medium">
                    {paymentMethod
                      ? paymentMethods.find((m) => m.id === paymentMethod)?.name
                      : t('notSelected')}
                  </span>
                </div>
              </div>
              <hr className="border-border" />
              <div className="flex justify-between text-lg font-bold">
                <span>{t('total')}</span>
                <span className="text-primary">
                  {selectedAmount
                    ? `${parseInt(selectedAmount).toLocaleString()} FCFA`
                    : customAmount
                      ? `${parseInt(customAmount).toLocaleString()} FCFA`
                      : '0 FCFA'}
                </span>
              </div>
              <Button
                className="w-full"
                size="lg"
                disabled={(!selectedAmount && !customAmount) || !paymentMethod}
              >
                {t('proceedToPay')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Shield className="h-3 w-3" />
                <span>{t('securePayment')}</span>
              </div>
            </CardContent>
          </Card>

          {/* Help Card */}
          <Card className="bg-secondary/50">
            <CardContent className="p-4">
              <h4 className="font-semibold mb-2">{t('needHelp')}</h4>
              <p className="text-sm text-muted-foreground">
                {t('contactSupportRecharge')}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
