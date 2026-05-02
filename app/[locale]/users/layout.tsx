import React from 'react';
import { UserFooter } from '@/components/users/footer';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { DashboardSidebar } from '@/components/users/sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col lg:flex-row bg-background">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <main className="flex-1">{children}</main>
          <UserFooter />
        </div>
      </div>
    </ProtectedRoute>
  );
}
