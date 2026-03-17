'use client';

import { UserHeader } from '@/components/users/header';
import { AdminHeader } from '@/components/admin/admin-header';
import { useAuth } from '@/lib/auth-context';

export function DynamicHeader() {
  const { isAdmin } = useAuth();

  if (isAdmin) {
    return <AdminHeader />;
  }

  return <UserHeader />;
}
