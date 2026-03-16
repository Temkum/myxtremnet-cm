import React from 'react';
import { UserFooter } from '@/components/users/footer';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { AdminSidebar } from '@/components/admin/admin-sidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen flex bg-background">
        <AdminSidebar />
        <main className="flex-1">{children}</main>
      </div>
      <UserFooter />
    </ProtectedRoute>
  );
}
