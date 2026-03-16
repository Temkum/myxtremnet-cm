import React from 'react';
import { UserFooter } from '@/components/users/footer';
import { ProtectedRoute } from '@/components/auth/protected-route';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col bg-background">
        <main className="flex-1">{children}</main>
        <UserFooter />
      </div>
    </ProtectedRoute>
  );
}
