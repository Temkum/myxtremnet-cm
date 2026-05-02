'use client';

import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, LogOut, Settings, Phone } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function AuthButton() {
  const { user, isLoading, logout } = useAuth();
  const t = useTranslations();

  if (isLoading) {
    return <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />;
  }

  if (!user) {
    return (
      <div className="flex gap-2">
        <Button variant="outline" asChild>
          <a href="/login">{t('Auth.signIn')}</a>
        </Button>
        <Button asChild>
          <a href="/register">{t('Auth.register')}</a>
        </Button>
      </div>
    );
  }

  const initials = user.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            {user.phoneNumber && (
              <p className="text-xs leading-none text-muted-foreground flex items-center gap-1">
                <Phone className="h-3 w-3" />
                {user.phoneNumber}
              </p>
            )}
            {user.serviceId && (
              <p className="text-xs leading-none text-muted-foreground">
                {t('Auth.serviceId')}: {user.serviceId}
              </p>
            )}
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <a href="/users/account" className="flex items-center">
            <User className="mr-2 h-4 w-4" />
            <span>{t('Auth.account')}</span>
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href="/users/settings" className="flex items-center">
            <Settings className="mr-2 h-4 w-4" />
            <span>{t('Auth.settings')}</span>
          </a>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={logout}
          className="cursor-pointer text-destructive focus:text-destructive"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>{t('Auth.logout')}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
