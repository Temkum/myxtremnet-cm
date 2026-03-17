'use client';

import { useState } from 'react';
import {
  User,
  FileText,
  Lock,
  LogOut,
  Receipt,
  RefreshCw,
  BarChart3,
  LogIn,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/lib/auth-context';
import LoginModal from '@/app/[locale]/(auth)/login-modal/page';

export function UserSection() {
  const t = useTranslations();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const { user, logout } = useAuth();

  const quickActions = [
    { icon: Receipt, label: 'QuickActions.viewBills', color: 'text-primary' },
    { icon: RefreshCw, label: 'QuickActions.recharge', color: 'text-accent' },
    { icon: BarChart3, label: 'QuickActions.dataUsage', color: 'text-primary' },
  ];

  return (
    <>
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* User Welcome / Login Card */}
            <Card className="overflow-hidden border-border/50 bg-card shadow-sm transition-all duration-300 hover:shadow-md lg:col-span-1">
              {user ? (
                <>
                  <CardHeader className="border-b border-border/50 bg-linear-to-r from-primary to-primary/80 text-primary-foreground">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-foreground/20">
                        <User className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-sm opacity-90">
                          {t('User.welcome')},
                        </p>
                        <CardTitle className="text-lg uppercase">
                          {user?.name}
                        </CardTitle>
                        <p className="text-xs opacity-80">
                          Ref: {user?.phoneNumber}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="flex flex-col">
                      <button className="flex items-center gap-3 px-6 py-4 text-left text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-secondary hover:text-foreground">
                        <FileText className="h-4 w-4" />
                        {t('User.customerInfo')}
                      </button>
                      <button className="flex items-center gap-3 border-t border-border/50 px-6 py-4 text-left text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-secondary hover:text-foreground">
                        <Lock className="h-4 w-4" />
                        {t('User.changePassword')}
                      </button>
                      <button
                        onClick={logout}
                        className="flex items-center gap-3 border-t border-border/50 px-6 py-4 text-left text-sm font-medium text-destructive transition-all duration-200 hover:bg-destructive/10"
                      >
                        <LogOut className="h-4 w-4" />
                        {t('User.logout')}
                      </button>
                    </div>
                  </CardContent>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
                  <div className="rounded-full bg-secondary p-4">
                    <User className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">
                      {t('User.notLoggedIn')}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Access your account to manage services
                    </p>
                  </div>
                  <Button
                    className="w-full gap-2"
                    variant="default"
                    onClick={() => setIsLoginOpen(true)}
                  >
                    <LogIn className="h-4 w-4" />
                    {t('Auth.login')}
                  </Button>
                </div>
              )}
            </Card>

            {/* Quick Actions (Remains visible or can be disabled/blurred if preferred) */}
            <Card className="border-border/50 bg-card shadow-sm transition-all duration-300 hover:shadow-md lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-foreground">
                  {t('QuickActions.quickActions')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-3">
                  {quickActions.map((action) => (
                    <Button
                      key={action.label}
                      variant="outline"
                      disabled={!user}
                      className="group flex h-auto flex-col items-center gap-3 border-border/50 p-6 transition-all duration-300 hover:border-primary hover:bg-primary/5 bg-transparent"
                    >
                      <div
                        className={`rounded-xl bg-secondary p-3 transition-colors group-hover:bg-primary/10 ${action.color}`}
                      >
                        <action.icon className="h-6 w-6" />
                      </div>
                      <span className="text-sm font-medium text-foreground">
                        {t(action.label)}
                      </span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
}
