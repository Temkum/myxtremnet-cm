'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Admin root page — redirects to /admin/dashboard.
 *
 * This avoids having two separate dashboard implementations
 * (one at /admin and one at /admin/dashboard).
 */
export default function AdminRootPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin/dashboard');
  }, [router]);

  return null;
}
