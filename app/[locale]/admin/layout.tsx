import React from 'react';
import AdminDashboard from './page';
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
      </div>
    </ProtectedRoute>
  );
}
