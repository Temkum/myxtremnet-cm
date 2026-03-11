'use client';

import { Suspense } from 'react';
import { LoginComponent } from './LoginComponent';
import { Footer } from '@/components/footer';

export default function LoginPage() {
  return (
    <>
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center p-4 bg-background">
            Loading...
          </div>
        }
      >
        <LoginComponent />
      </Suspense>

      <Footer />
    </>
  );
}
