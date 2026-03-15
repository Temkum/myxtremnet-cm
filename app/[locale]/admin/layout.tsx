import React from 'react';
import { DashboardFooter } from '@/components/dashboard/footer';
import { ProtectedRoute } from '@/components/auth/protected-route';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col bg-background">
        <main className="flex-1">{children}</main>
        <DashboardFooter />
      </div>
    </ProtectedRoute>
  );
}
