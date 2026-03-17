import React from 'react';
import { UserFooter } from '@/components/users/footer';
import AdminRoute from '@/components/AdminRoute';
import { AdminSidebar } from '@/components/admin/admin-sidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminRoute>
      <div className="min-h-screen flex bg-background">
        <AdminSidebar />
        <main className="flex-1">{children}</main>
      </div>
      <UserFooter />
    </AdminRoute>
  );
}
