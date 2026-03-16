'use client';

import { UserHeader } from '@/components/users/header';
import { useAuth } from '@/lib/auth-context';

export function ConditionalUserHeader() {
  const { user, isAdmin } = useAuth();

  // Don't show UserHeader if user is an admin
  if (isAdmin) {
    return null;
  }

  return <UserHeader />;
}
