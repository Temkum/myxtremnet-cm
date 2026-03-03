'use client';

import { useRouter } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { ArrowLeft, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function NotFoundActions() {
  const router = useRouter();

  return (
    <div className="flex flex-col sm:flex-row items-center gap-3">
      <Button
        variant="outline"
        onClick={() => router.back()}
        className="group w-full sm:w-auto border-2 border-primary/30 hover:border-primary/70 transition-all duration-200"
      >
        <ArrowLeft className="mr-2 h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
        Go Back
      </Button>

      <Button asChild className="w-full sm:w-auto">
        <Link href="/dashboard">
          <LayoutDashboard className="mr-2 h-4 w-4" />
          Dashboard
        </Link>
      </Button>
    </div>
  );
}
